"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtViewer = void 0;
const node_path_1 = __importDefault(require("node:path"));
/**
 * Apply Formatting to JSON string
 */
const prettyJsonString = (data) => {
    return JSON.stringify(JSON.parse(data), null, 2);
};
/**
 * A preset that parses JWT
 */
exports.JwtViewer = {
    preProcessors: [
        (data) => {
            const [header, payload, signature] = data.split(".");
            return {
                header: prettyJsonString(Buffer.from(header, "base64").toString()),
                payload: prettyJsonString(Buffer.from(payload, "base64").toString()),
                signature,
            };
        },
    ],
    templateFile: node_path_1.default.resolve(__dirname, "jwt-viewer.hbs"),
};
exports.default = exports.JwtViewer;
