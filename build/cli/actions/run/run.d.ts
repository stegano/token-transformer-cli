import { Options } from "./run.interface";
import { Config } from "../../../config/config.interface";
import { PostProcessor, PreProcessor, Preset } from "../../../transform";
/**
 * Get list of pre-processor
 */
export declare const getPreProcessorList: (config: Config, presets: Preset[]) => PreProcessor[];
/**
 * Get list of post-processor
 */
export declare const getPostProcessorList: (config: Config, presets: Preset[]) => PostProcessor[];
/**
 * Run action
 */
export declare const action: (inputToken: string, options: Options) => Promise<void>;
export default action;
