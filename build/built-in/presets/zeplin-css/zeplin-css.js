"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeplinCss = void 0;
const node_path_1 = __importDefault(require("node:path"));
const post_processors_1 = require("../../post-processors");
const pre_processors_1 = require("../../pre-processors");
/**
 * A preset that converts design tokens created in Zeplin into CSS file
 */
exports.ZeplinCss = {
    preProcessors: [pre_processors_1.toJson],
    postProcessors: [post_processors_1.removeEmptyLines],
    templateFile: node_path_1.default.resolve(__dirname, "zeplin-css.hbs"),
    outputFile: {
        ext: "css",
    },
};
exports.default = exports.ZeplinCss;
