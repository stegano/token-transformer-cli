"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEmptyLines = void 0;
/**
 * A post-processor that removes empty lines
 */
const removeEmptyLines = (content) => {
    return content
        .split("\n")
        .filter((str) => /^\s+$/.test(str) === false)
        .join("\n")
        .replace(/\n{3,}/gm, "\n\n");
};
exports.removeEmptyLines = removeEmptyLines;
exports.default = exports.removeEmptyLines;
