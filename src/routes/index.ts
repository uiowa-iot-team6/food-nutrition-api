import { Router } from "express";
import { app } from "..";
import bodyParser from "body-parser";
import { foodRouter } from "./food";
import { buildDependencyInjector } from "../middleware/dependencies";

const jsonParser = bodyParser.json();

const apiRouter = Router();

apiRouter.use(jsonParser);
buildDependencyInjector()
  .then((dependencyInjector) => {
    console.log("injecting 1!");
    apiRouter.use(dependencyInjector);
  })
  .catch((err) => console.error(err));

app.use("/api", apiRouter);

apiRouter.use("/food", foodRouter);
