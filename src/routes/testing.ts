import { Express, Request, Response } from "express";
import { z } from "zod";
import OpenAI from "openai";

export function initTestingRoutes(app: Express, openai: OpenAI) {
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  app.post("/chat", (req: Request, res: Response) => {
    const Schema = z.object({
      message: z.string(),
    });

    const parsedSchema = Schema.safeParse(req.body);
    if (!parsedSchema.success) {
      return res.status(400).json({ error: "Invalid request" });
    }

    res.send({
      message: "test",
    });
  });
}
