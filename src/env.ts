import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number(),
  OPENAI_API_KEY: z.string(),
  MONGO_USER: z.string(),
  MONGO_PASSWORD: z.string(),
  MONGO_PORT: z.coerce.number(),
});

function readEnv() {
  return EnvSchema.parse({
    PORT: process.env.PORT,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PORT: process.env.MONGO_PORT,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  });
}

export const ENV = readEnv();
