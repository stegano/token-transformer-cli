"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonFormatter = void 0;
/**
 * A preset that applies formatting to JSON string
 */
exports.JsonFormatter = {
    preProcessors: [
        (data) => {
            return { text: JSON.stringify(JSON.parse(data), null, 2) };
        },
    ],
};
exports.default = exports.JsonFormatter;
