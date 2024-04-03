import dotenv from "dotenv";
import { z } from "zod";
import fs from "node:fs";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number(),
  OPENAI_API_KEY: z.string(),
  UPLOAD_PHOTO_DIR: z.string(),
  MONGO_USER: z.string(),
  MONGO_PASSWORD: z.string(),
  MONGO_PORT: z.coerce.number(),
});

function readEnv() {
  const env = EnvSchema.parse({
    PORT: process.env.PORT,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    UPLOAD_PHOTO_DIR: process.env.UPLOAD_PHOTO_DIR,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PORT: process.env.MONGO_PORT,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  });

  if (!fs.existsSync(env.UPLOAD_PHOTO_DIR)) {
    fs.mkdirSync(env.UPLOAD_PHOTO_DIR, { recursive: true });
  }

  return env;
}

export const ENV = readEnv();
