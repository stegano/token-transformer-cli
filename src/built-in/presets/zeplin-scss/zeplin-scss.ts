import path from "node:path";
import { removeEmptyLines } from "../../post-processors";
import type { Preset } from "../../../transform";
import { toJson } from "../../pre-processors";

/**
 * A preset that converts design tokens created in Zeplin into SCSS file
 */
export const ZeplinScss: Preset = {
  preProcessors: [toJson],
  postProcessors: [removeEmptyLines],
  templateFile: path.resolve(__dirname, "zeplin-scss.hbs"),
  outputFile: {
    ext: "scss",
  },
};

export default ZeplinScss;
