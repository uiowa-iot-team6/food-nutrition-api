import { Router } from "express";
import { app } from "..";
import { foodRouter } from "./food";
import { injectDependencies } from "../middleware/dependencies";
import { formidableParse } from "../middleware/formidable";
import pinohttp from "pino-http";

const apiRouter = Router();

apiRouter.use(pinohttp());
apiRouter.use(formidableParse);
apiRouter.use(injectDependencies);

app.use("/api", apiRouter);

apiRouter.use("/food", foodRouter);
