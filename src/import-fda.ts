import { ENV } from "./env";
import path from "node:path";
import pino from "pino";
import https from "https";
import fs from "node:fs";

const logger = pino();

const downloadDir = path.join(ENV.TEMP_DATA_DIR, "food-downloads");

/**
 *
 * @returns Path to downloaded file.
 */
async function download(
  url: string,
  outDir: string = downloadDir,
): Promise<string> {
  const zipPath = path.join(downloadDir, "food-data.zip");
  const dataZip = fs.createWriteStream(zipPath);

  logger.info({ outDir }, "Setting up temp directory for downloads.");
  if (!fs.existsSync(outDir)) {
    logger.info("Output directory missing, creating missing directory.");
    fs.mkdirSync(outDir, { recursive: true });
  }

  const request = new Promise((res, rej) => {
    https.get(url, function (response) {
      logger.info({ downloadUrl: url }, "Beginning download");
      response.pipe(dataZip);

      dataZip.on("finish", () => {
        dataZip.close();
        logger.info({ zipPath }, "Download complete.");
        res(true);
      });

      dataZip.on("error", (error) => {
        rej(error);
      });
    });
  });

  await request;

  return zipPath;
}

async function main() {
  const zipPath = await download(ENV.FOOD_DATA_DOWNLOAD);
  logger.info(zipPath);
}

main().catch((err) => logger.error(err));
