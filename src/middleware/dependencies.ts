import { NextFunction, Request, Response } from "express";
import OpenAI from "openai";
import mongoose from "mongoose";
import { ENV } from "../env";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

const mongo = mongoose.connect(
  `mongodb://${ENV.MONGO_USER}:${ENV.MONGO_PASSWORD}@127.0.0.1:${ENV.MONGO_PORT}`,
);

export interface RequestDependencies {
  openai: OpenAI;
  mongo: Awaited<typeof mongoose>;
}

export async function buildDependencyInjector() {
  const awaitedMongo = await mongo;

  return function injectDependencies(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    console.log("injecting");
    req.dependencies = { openai, mongo: awaitedMongo };
    next();
  };
}
