import { ENV } from "./env";
import path from "node:path";

const downloadDir = path.join(ENV.TEMP_DATA_DIR, "food-downloads");
console.log(downloadDir);

// TODO: Download food, unzip, import to DB

// DELETE FOOD DOWNLOAD DIR
