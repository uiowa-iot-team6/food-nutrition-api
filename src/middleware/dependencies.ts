import { NextFunction, Request, Response } from "express";
import OpenAI from "openai";
import { ENV } from "../env";
import { MongoContext } from "../mongo";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export interface RequestDependencies {
  openai: OpenAI;
  mongo: MongoContext;
}

export function injectDependencies(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.dependencies = {
    openai,
    mongo: new MongoContext(ENV.MONGO_URL),
  };
  next();
}
