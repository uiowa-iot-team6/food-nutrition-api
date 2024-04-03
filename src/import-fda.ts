import { ENV } from "./env";
import path from "node:path";
import pino from "pino";
import https from "https";
import fs from "node:fs";
import yauzl from "yauzl";
import { Writable, WritableOptions } from "stream";

const logger = pino();

const downloadDir = path.join(ENV.TEMP_DATA_DIR, "food-downloads");

/**
 * @returns Path to downloaded file.
 */
async function download(
  url: string,
  outDir: string = downloadDir,
  options?: {
    redownload: boolean;
  },
): Promise<string> {
  const zipPath = path.join(downloadDir, "food-data.zip");

  logger.info({ outDir }, "Setting up temp directory for downloads.");
  if (!fs.existsSync(outDir)) {
    logger.info("Output directory missing, creating missing directory.");
    fs.mkdirSync(outDir, { recursive: true });
  }

  if (fs.existsSync(zipPath)) {
    if (!options?.redownload) {
      logger.info(
        "File already exists, skipping redownload (this behavior can be changed within options)",
      );
      return zipPath;
    }

    logger.info(
      { zipPath },
      "Redownload flag set to true. Deleting the outdated zip file.",
    );
    fs.rmSync(zipPath);
  }

  const dataZip = fs.createWriteStream(zipPath);

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

class FoodDBWriter extends Writable {
  private queue: unknown[];

  constructor(options?: WritableOptions) {
    super(options);
    this.queue = [];
  }

  _write(
    chunk: unknown,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void {
    this.queue.push(chunk);

    logger.info(
      { data: Buffer.from(this.queue as number[]), encoding },
      "Buffer so far",
    );
    callback();
  }

  _final(callback: (error?: Error | null) => void): void {
    // Do something with the data here
    callback();
  }
}

async function main() {
  const zipPath = await download(ENV.FOOD_DATA_DOWNLOAD);
  logger.info(zipPath);

  yauzl.open(
    zipPath,
    { lazyEntries: true, decodeStrings: true },
    function (err, zipfile) {
      if (err) throw err;
      zipfile.readEntry();
      zipfile.on("entry", function (entry) {
        if (/\/$/.test(entry.fileName)) {
          // Directory file names end with '/'.
          // Note that entries for directories themselves are optional.
          // An entry's fileName implicitly requires its parent directories to exist.
          zipfile.readEntry();
        } else {
          // file entry
          zipfile.openReadStream(entry, function (err, readStream) {
            if (err) throw err;
            readStream.on("end", function () {
              zipfile.readEntry();
            });
            readStream.pipe(new FoodDBWriter());
          });
        }
      });
    },
  );
}

main().catch((err) => logger.error(err));
