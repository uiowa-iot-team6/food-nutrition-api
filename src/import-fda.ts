import { ENV } from "./env";
import path from "node:path";
import pino from "pino";

const logger = pino();

const downloadDir = path.join(ENV.TEMP_DATA_DIR, "food-downloads");
logger.info({ downloadDir }, "Setting up temp directory for downloads.");

// TODO: Download food, unzip, import to DB

// DELETE FOOD DOWNLOAD DIR
