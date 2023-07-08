import type { Preset } from "../../../transform";

/**
 * A preset that applies formatting to JSON string
 */
export const JsonFormatter: Preset = {
  preProcessors: [
    (data: string) => {
      return { text: JSON.stringify(JSON.parse(data), null, 2) };
    },
  ],
};

export default JsonFormatter;
