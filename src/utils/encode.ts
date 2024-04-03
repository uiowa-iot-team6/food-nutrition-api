import formidable from "formidable";
import fs from "node:fs";

function encodeFile(
  file: formidable.File,
  encoding: BufferEncoding = "base64",
) {
  const bitmap = fs.readFileSync(file.filepath);
  return bitmap.toString(encoding);
}

export default {
  file: encodeFile,
};
