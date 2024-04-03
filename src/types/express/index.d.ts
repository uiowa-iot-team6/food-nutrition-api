import formidable from "formidable";
import { RequestDependencies } from "../../middleware/dependencies";

/**
 * You can only safely assume dependencies is declared if the dependency injector middleware has been added
 * to your routes.
 */
declare global {
  declare namespace Express {
    export interface Request {
      dependencies?: RequestDependencies;
      fields?: formidable.Fields<string>;
      files?: formidable.Files<string>;
    }
  }
}
