"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const run_1 = require("./run");
describe("`getPreProcessorList` function", () => {
    it("should return the list of pre-processor", () => {
        const preProcessor = () => { };
        expect((0, run_1.getPreProcessorList)({}, [{}])).toEqual([]);
        const config = {
            preProcessors: [preProcessor],
        };
        expect((0, run_1.getPreProcessorList)({}, [
            {
                preProcessors: [preProcessor],
            },
        ])).toHaveLength(1);
        expect((0, run_1.getPreProcessorList)({}, [
            {
                preProcessors: [preProcessor, preProcessor],
            },
        ])).toHaveLength(2);
        expect((0, run_1.getPreProcessorList)(config, [
            {
                preProcessors: [preProcessor, preProcessor],
            },
        ])).toHaveLength(3);
        const preProcessorList = (0, run_1.getPreProcessorList)(config, [
            {
                preProcessors: [preProcessor, preProcessor],
                processorOptions: { option: "option" },
            },
        ]).map((processor) => {
            return Array.isArray(processor) ? processor : [processor];
        });
        expect(preProcessorList[0][1]).toEqual({ option: "option" });
        expect(preProcessorList[1][1]).toEqual({ option: "option" });
        // [!] Processors in the configuration file are added to the end of the list.
        expect(preProcessorList[2][1]).toBe(undefined);
    });
});
describe("`getPostProcessorList` function", () => {
    it("should return the list of post-processor", () => {
        const postProcessor = () => "";
        expect((0, run_1.getPostProcessorList)({}, [{}])).toEqual([]);
        const config = {
            postProcessors: [postProcessor],
        };
        expect((0, run_1.getPostProcessorList)({}, [
            {
                postProcessors: [postProcessor],
            },
        ])).toHaveLength(1);
        expect((0, run_1.getPostProcessorList)({}, [
            {
                postProcessors: [postProcessor, postProcessor],
            },
        ])).toHaveLength(2);
        expect((0, run_1.getPostProcessorList)(config, [
            {
                postProcessors: [postProcessor, postProcessor],
            },
        ])).toHaveLength(3);
        const postProcessorList = (0, run_1.getPostProcessorList)(config, [
            {
                postProcessors: [postProcessor, postProcessor],
                processorOptions: { option: "option" },
            },
        ]).map((processor) => {
            return Array.isArray(processor) ? processor : [processor];
        });
        expect(postProcessorList[0][1]).toEqual({ option: "option" });
        expect(postProcessorList[1][1]).toEqual({ option: "option" });
        // [!] Processors in the configuration file are added to the end of the list.
        expect(postProcessorList[2][1]).toBe(undefined);
    });
});
