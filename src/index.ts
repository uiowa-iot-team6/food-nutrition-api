import express, { Express } from "express";
import { ENV } from "./env";
import pino from "pino";

const logger = pino();

export const app: Express = express();
const port = ENV.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

import "./routes";
