import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number(),
  OPENAI_API_KEY: z.string(),
  TEMP_DATA_DIR: z.string(),
  MONGO_USER: z.string(),
  MONGO_PASSWORD: z.string(),
  MONGO_PORT: z.coerce.number(),
  MONGO_URL: z.string(),
  FOOD_DATA_API_KEY: z.string(),
});

function readEnv() {
  return EnvSchema.parse({
    PORT: process.env.PORT,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TEMP_DATA_DIR: process.env.TEMP_DATA_DIR,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PORT: process.env.MONGO_PORT,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    MONGO_URL: process.env.MONGO_URL,
    FOOD_DATA_API_KEY: process.env.FOOD_DATA_API_KEY,
  });
}

export const ENV = readEnv();
