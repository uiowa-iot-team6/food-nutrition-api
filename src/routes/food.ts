import { Router, Request, Response } from "express";
import { z } from "zod";
import encode from "../utils/encode";
import { errorResponse } from "../utils/response";

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
      mass: z.coerce.number(),
    })
    .safeParse(req.fields);

  if (!parsedFields.success) {
    return errorResponse(res, 400, "No mass field provided");
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
    return errorResponse(res, 400, "Unable to find any relevant food");
  }

  if (/(not food)/i.test(message)) {
    return errorResponse(
      res,
      400,
      "The image does not contain any relevant food",
    );
  }

  res.send({
    message: response.choices[0].message,
  });
});
