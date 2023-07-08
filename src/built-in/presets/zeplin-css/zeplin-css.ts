import path from "node:path";
import { removeEmptyLines } from "../../post-processors";
import type { Preset } from "../../../transform";
import { toJson } from "../../pre-processors";

/**
 * A preset that converts design tokens created in Zeplin into CSS file
 */
export const ZeplinCss: Preset = {
  preProcessors: [toJson],
  postProcessors: [removeEmptyLines],
  templateFile: path.resolve(__dirname, "zeplin-css.hbs"),
  outputFile: {
    ext: "css",
  },
};

export default ZeplinCss;
