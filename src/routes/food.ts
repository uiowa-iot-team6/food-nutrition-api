import { Router, Request, Response } from "express";
import { z } from "zod";
import encode from "../utils/encode";
import { errorResponse } from "../utils/response";
import usdaapi from "../utils/usda-api";
import FuzzySearch from "fuzzy-search";
import { createFoodRecordFromUSDAFood, FoodRecord } from "../models/food";
import { UserModel } from "../models/user";
export const foodRouter = Router();

const foodPrompt =
  "If the picture shows food describe in 3 words or less the food in the photo. If the photo does not contain food, say 'not food'";

const RecordFoodRequestSchema = z
.object({
  mass: z
    .array(z.coerce.number())
    .min(1)
    .max(1)
    .transform((arg) => arg.at(0)),
  username: z.string().optional(),
  deviceCode: z.string().optional(),
})
.refine((arg) => {
  return arg.deviceCode || arg.username;
}, {message: "A device code or username must be provided"})

/**
 * POST /api/food/record
 *
 * Log a food to the user's consumption records.
 */
foodRouter.post("/record", async (req: Request, res: Response) => {
  const openai = req.dependencies!.openai;

  const photo = req.files?.photo?.at(0);

  if (!photo) {
    return errorResponse(res, 400, "No photo provided");
  }

  const parsedFields = RecordFoodRequestSchema.safeParse(req.fields);

  if (!parsedFields.success) {
    return errorResponse(res, 400, parsedFields.error.message);
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: foodPrompt,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${encode.file(photo)}`,
            },
          },
        ],
      },
    ],
  });

  const message = response.choices[0].message.content;

  if (!message) {
    return errorResponse(
      res,
      400,
      "An unexpected error occured with the OpenAI API response.",
    );
  }

  if (/(not food)/i.test(message)) {
    return errorResponse(res, 404, "No food found in image.");
  }

  try {
    const foods = (await usdaapi.foods(message)).filter((food) => {
      return food.servingSize && food.servingSizeUnit?.toLowerCase() === "g";
    });
    const searcher = new FuzzySearch(foods, ["description"], {
      caseSensitive: false,
    });
    let closestMatch = searcher.search(message).at(0);
    if (!closestMatch) {
      req.log.warn("No matching food found within USDA database matching label");
      try {
        req.log.info("Trying to find the closest match", foods[0]);
        closestMatch = foods[0];
      } catch (e) {
        return errorResponse(
          res,
          404,
          `No matching food found within USDA database matching label '${message}'`,
        );
      }
    }
    const user = await UserModel.findOne({ username: req.fields?.username });
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    const foodRecord = createFoodRecordFromUSDAFood(
      closestMatch,
      parsedFields.data.mass!,
      user._id,
    );
    foodRecord.save();

    return res.send({
      ...closestMatch,
    });
  } catch (e) {
    req.log.error("Error fetching foods from USDA API", e);
    return errorResponse(
      res,
      500,
      `An unexpected error occured: ${(e as unknown as Error).message}`,
    );
  }
});

foodRouter.post("/create-manually", async (req: Request, res: Response) => {
  if (!req.fields) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  const {
    username,
    fdcId,
    description,
    servingSize,
    servingSizeUnit,
    servingsConsumed,
    foodNutrients,
  } = req.fields;

  try {
    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }
    if (user) {
      // Create a new food record
      const foodRecord = new FoodRecord({
        fdcId,
        description,
        servingSize,
        servingSizeUnit,
        servingsConsumed,
        foodNutrients,
        associatedUser: user._id,
      });

      // Save the food record to the database
      await foodRecord.save();

      return res.status(201).json({ food: foodRecord });
    }
  } catch (error) {
    req.log.error("Error creating food record:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

foodRouter.get("/get-by-username", async (req, res) => {
  if (!req.query) {
    return res.status(400).json({ message: "Request query is missing" });
  }
  const { username } = req.query;
  if (typeof username === "string") {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }
    if (user) {
      //find food by associated user id
      const food = await FoodRecord.find({ associatedUser: user._id });
      return res.status(201).json({ food });
    }
  }
});

//get food entries from today
foodRouter.get("/get-by-username-today", async (req, res) => {
  if (!req.query) {
    return res.status(400).json({ message: "Request query is missing" });
  }
  const { username } = req.query;
  if (typeof username === "string") {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }
    if (user) {
      //find food by associated user id
      const food = await FoodRecord.find({
        associatedUser: user._id,
        date: { $gte: new Date(new Date().setHours(0, 0, 0)) },
      });
      return res.status(201).json({ food });
    }
  }
});
