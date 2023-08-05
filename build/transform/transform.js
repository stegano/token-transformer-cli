"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = exports.postProcess = exports.preProcess = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
/**
 * Pre-processor executor
 */
const preProcess = (tokenData, preProcessors) => preProcessors.reduce((data, preProcessor, index) => {
    const evaluatedData = index === 0 ? tokenData : data;
    return Array.isArray(preProcessor)
        ? preProcessor[0](evaluatedData, preProcessor[1])
        : preProcessor(evaluatedData);
}, {});
exports.preProcess = preProcess;
/**
 * Post-processor executor
 */
const postProcess = (content, postProcessors, data) => postProcessors.reduce((str, postProcessor) => {
    return Array.isArray(postProcessor)
        ? postProcessor[0](str, data, postProcessor[1])
        : postProcessor(str, data);
}, content);
exports.postProcess = postProcess;
/**
 * Default template
 */
const defaultTemplate = `{{{tokenData.text}}}{{"\n"}}`;
/**
 * Transform token
 */
const transform = async (token, template = defaultTemplate, preProcessorList = [], postProcessorList = []) => {
    const tokenData = (0, exports.preProcess)(token, preProcessorList);
    const content = (0, exports.postProcess)(handlebars_1.default.compile(template)({
        tokenData,
    }), postProcessorList, tokenData);
    return content;
};
exports.transform = transform;
exports.default = exports.transform;
