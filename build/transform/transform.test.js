"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-param-reassign */
const transform_1 = require("./transform");
describe("`preProcess` function", () => {
    it("should return the result of the pre-processor", () => {
        const processor = (data) => {
            if (typeof data === "string") {
                return { result: data };
            }
            return { result: `${data.result}A` };
        };
        expect((0, transform_1.preProcess)("A", [processor])).toEqual({ result: "A" });
        expect((0, transform_1.preProcess)("A", [processor, processor])).toEqual({ result: "AA" });
        expect((0, transform_1.preProcess)("A", [processor, processor, processor])).toEqual({ result: "AAA" });
    });
    it("should return the result of the pre-processor with options", () => {
        const processor = (data, options) => {
            if (typeof data === "string") {
                return { result: data + (options?.char || "") };
            }
            return { result: `${data.result}${options?.char || ""}` };
        };
        expect((0, transform_1.preProcess)("A", [[processor]])).toEqual({ result: "A" });
        expect((0, transform_1.preProcess)("A", [[processor, { char: "a" }]])).toEqual({ result: "Aa" });
        expect((0, transform_1.preProcess)("A", [
            [processor, { char: "a" }],
            [processor, { char: "b" }],
        ])).toEqual({ result: "Aab" });
    });
});
describe("`postProcess` function", () => {
    it("should return the result of the post-processor", () => {
        const processor = (content) => {
            return `${content}A`;
        };
        expect((0, transform_1.postProcess)("A", [processor], {})).toEqual("AA");
        expect((0, transform_1.postProcess)("A", [processor, processor], {})).toEqual("AAA");
        expect((0, transform_1.postProcess)("A", [processor, processor, processor], {})).toEqual("AAAA");
    });
    it("should return the result of the post-processor with options", () => {
        const processor = (content, _, options) => {
            return `${content}${options?.char || ""}`;
        };
        expect((0, transform_1.postProcess)("A", [[processor]], {})).toEqual("A");
        expect((0, transform_1.postProcess)("A", [[processor, { char: "B" }]], {})).toEqual("AB");
        expect((0, transform_1.postProcess)("A", [
            [processor, { char: "B" }],
            [processor, { char: "B" }],
        ], {})).toEqual("ABB");
    });
});
