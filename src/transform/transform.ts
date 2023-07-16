import Handlebars from "handlebars/runtime";
import { PostProcessor, PreProcessor } from "./transform.interface";

/**
 * Pre-processor executor
 */
export const preProcess = (tokenData: string, preProcessors: PreProcessor[]): object =>
  preProcessors.reduce<object>(
    (data, preProcessor, index) => preProcessor(index === 0 ? tokenData : data),
    {},
  );

/**
 * Post-processor executor
 */
export const postProcess = (
  content: string,
  postProcessors: PostProcessor[],
  data: object,
): string => postProcessors.reduce((str, postProcessor) => postProcessor(str, data), content);

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
