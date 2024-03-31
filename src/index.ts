import express, { Express } from "express";
import mongoose from "mongoose";
import { readEnv } from "./env";
import { initTestingRoutes } from "./routes/testing";
import OpenAI from "openai";

const ENV = readEnv();
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    `mongodb://${ENV.MONGO_USER}:${ENV.MONGO_PASSWORD}@127.0.0.1:${ENV.MONGO_PORT}`,
  );

  const app: Express = express();
  const port = process.env.PORT || 3000;

  initTestingRoutes(app, openai);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
