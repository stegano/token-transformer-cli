import { PostProcessor } from "../../../transform";

/**
 * A post-processor that removes empty lines
 */
export const removeEmptyLines: PostProcessor = (content: string): string => {
  return content
    .split("\n")
    .filter((str) => /^\s+$/.test(str) === false)
    .join("\n")
    .replace(/\n{3,}/gm, "\n\n");
};

export default removeEmptyLines;
