"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJson = void 0;
/**
 * A pre-processor that converts JSON string into object
 */
const toJson = (data) => JSON.parse(data);
exports.toJson = toJson;
exports.default = exports.toJson;
