import { PostProcessor, PreProcessor } from "./transform.interface";
/**
 * Pre-processor executor
 */
export declare const preProcess: (tokenData: string, preProcessors: PreProcessor[]) => object;
/**
 * Post-processor executor
 */
export declare const postProcess: (content: string, postProcessors: PostProcessor[], data: object) => string;
/**
 * Transform token
 */
export declare const transform: (token: string, template?: string, preProcessorList?: PreProcessor[], postProcessorList?: PostProcessor[]) => Promise<string>;
export default transform;
