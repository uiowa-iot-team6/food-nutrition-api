import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import { ENV } from "../env";
import fs from "node:fs";
import path from "node:path";

const photoUploadsDir = path.join(ENV.TEMP_DATA_DIR, "photos");

if (!fs.existsSync(photoUploadsDir)) {
  fs.mkdirSync(photoUploadsDir, { recursive: true });
}

export async function formidableParse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const form = formidable({
    uploadDir: photoUploadsDir,
    multiples: false,
  });
  const [fields, files] = await form.parse(req);

  req.fields = fields;
  req.files = files;

  next();
}
