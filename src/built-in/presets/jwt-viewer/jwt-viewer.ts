import path from "node:path";
import type { Preset } from "../../../transform";

/**
 * Apply Formatting to JSON string
 */
const prettyJsonString = (data: string): string => {
  return JSON.stringify(JSON.parse(data), null, 2);
};

/**
 * A preset that parses JWT
 */
export const JwtViewer: Preset = {
  preProcessors: [
    (data: string) => {
      const [header, payload, signature] = data.split(".");
      return {
        header: prettyJsonString(Buffer.from(header, "base64").toString()),
        payload: prettyJsonString(Buffer.from(payload, "base64").toString()),
        signature,
      };
    },
  ],
  templateFile: path.resolve(__dirname, "jwt-viewer.hbs"),
};

export default JwtViewer;
