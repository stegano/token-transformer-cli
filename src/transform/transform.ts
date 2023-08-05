import Handlebars from "handlebars";
import { PostProcessor, PreProcessor } from "./transform.interface";

/**
 * Pre-processor executor
 */
export const preProcess = (tokenData: string, preProcessors: PreProcessor[]): object =>
  preProcessors.reduce<object>((data, preProcessor, index) => {
    const evaluatedData = index === 0 ? tokenData : data;
    return Array.isArray(preProcessor)
      ? preProcessor[0](evaluatedData, preProcessor[1])
      : preProcessor(evaluatedData);
  }, {});

/**
 * Post-processor executor
 */
export const postProcess = (
  content: string,
  postProcessors: PostProcessor[],
  data: object,
): string =>
  postProcessors.reduce((str, postProcessor) => {
    return Array.isArray(postProcessor)
      ? postProcessor[0](str, data, postProcessor[1])
      : postProcessor(str, data);
  }, content);

/**
 * Default template
 */
const defaultTemplate = `{{{tokenData.text}}}{{"\n"}}`;

/**
 * Transform token
 */
export const transform = async (
  token: string,
  template: string = defaultTemplate,
  preProcessorList: PreProcessor[] = [],
  postProcessorList: PostProcessor[] = [],
): Promise<string> => {
  const tokenData = preProcess(token, preProcessorList);
  const content = postProcess(
    Handlebars.compile(template)({
      tokenData,
    }),
    postProcessorList,
    tokenData,
  );
  return content;
};

export default transform;
