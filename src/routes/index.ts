import { Router } from "express";
import { app } from "..";
import { foodRouter } from "./food";
import { injectDependencies } from "../middleware/dependencies";
import { formidableParse } from "../middleware/formidable";

const apiRouter = Router();

apiRouter.use(formidableParse);
apiRouter.use(injectDependencies);

app.use("/api", apiRouter);

apiRouter.use("/food", foodRouter);
