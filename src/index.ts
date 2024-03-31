import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import { readEnv } from "./env";

const ENV = readEnv();

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb://${ENV.MONGO_USER}:${ENV.MONGO_PASSWORD}@127.0.0.1:${ENV.MONGO_PORT}`);

    const app: Express = express();
    const port = process.env.PORT || 3000;

    app.get("/", (req: Request, res: Response) => {
        res.send("Hello World!");
    });

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
}
