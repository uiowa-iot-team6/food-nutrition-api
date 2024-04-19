import { Router } from "express";
import { app } from "..";
import { foodRouter } from "./food";
import { injectDependencies } from "../middleware/dependencies";
import { formidableParse } from "../middleware/formidable";
import pinohttp from "pino-http";
import { authRouter } from "./auth";
import { UserRouter } from "./user";
import { deviceRouter } from "./device";
import express from "express";
const apiRouter = Router();

apiRouter.use(pinohttp());
apiRouter.use(formidableParse);
apiRouter.use(injectDependencies);
app.use("/api", apiRouter);

app.use(express.json());
apiRouter.use("/food", foodRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/user", UserRouter);
apiRouter.use("/device", deviceRouter);
