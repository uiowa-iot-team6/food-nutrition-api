import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const EnvSchema = z.object({
    PORT: z.coerce.number(),
    MONGO_USER: z.string(),
    MONGO_PASSWORD: z.string(),
    MONGO_PORT: z.coerce.number(),
})

export function readEnv() {
    return EnvSchema.parse({
        PORT: process.env.PORT,
        MONGO_USER: process.env.MONGO_USER,
        MONGO_PORT: process.env.MONGO_PORT,
        MONGO_PASSWORD: process.env.MONGO_PASSWORD
    })
}
