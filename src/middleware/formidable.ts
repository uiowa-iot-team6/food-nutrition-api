import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import { ENV } from "../env";
import fs from "node:fs";

if (!fs.existsSync(ENV.UPLOAD_PHOTO_DIR)) {
  fs.mkdirSync(ENV.UPLOAD_PHOTO_DIR, { recursive: true });
}

const form = formidable({
  uploadDir: ENV.UPLOAD_PHOTO_DIR,
  multiples: false,
});

export async function formidableParse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const [fields, files] = await form.parse(req);

  req.fields = fields;
  req.files = files;

  next();
}
