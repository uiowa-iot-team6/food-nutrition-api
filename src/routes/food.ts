import { Router, Request, Response } from "express";
import { z } from "zod";
import encode from "../utils/encode";

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
    return res.status(400).json({ message: "No photo provided" });
  }

  const parsedFields = z
    .object({
      mass: z.coerce.number(),
    })
    .safeParse(req.fields);

  if (!parsedFields.success) {
    return res.status(400).json({ message: "No mass field provided" });
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

  res.send({
    message: response.choices[0].message,
  });
});
