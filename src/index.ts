import express, { Express } from "express";
import { ENV } from "./env";

export const app: Express = express();
const port = ENV.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

import "./routes";
