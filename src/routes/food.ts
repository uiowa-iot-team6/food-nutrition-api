import { Router, Request, Response } from "express";
import { z } from "zod";
import encode from "../utils/encode";
import { errorResponse } from "../utils/response";
import usdaapi from "../utils/usda-api";

export const foodRouter = Router();

const foodPrompt =
  "If the picture shows food describe in 3 words or less the food in the photo. If the photo does not contain food, say 'not food'";

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

  const parsedFields = z
    .object({
      mass: z
        .array(z.coerce.number())
        .min(1)
        .max(1)
        .transform((arg) => arg.at(0)),
    })
    .safeParse(req.fields);

  if (!parsedFields.success) {
    return errorResponse(res, 400, "Invalid mass field provided");
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
    return errorResponse(res, 400, "No food found in image.");
  }

  console.log("Found foods: ", await usdaapi.foods(message));

  res.send({
    message: response.choices[0].message,
  });
});
