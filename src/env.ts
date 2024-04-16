import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number(),
  OPENAI_API_KEY: z.string(),
  TEMP_DATA_DIR: z.string(),
  MONGO_URL: z.string(),
  FOOD_DATA_API_KEY: z.string(),
});

function readEnv() {
  return EnvSchema.parse({
    PORT: process.env.PORT,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    TEMP_DATA_DIR: process.env.TEMP_DATA_DIR,
    MONGO_URL: process.env.MONGO_URL,
    FOOD_DATA_API_KEY: process.env.FOOD_DATA_API_KEY,
  });
}

export const ENV = readEnv();
