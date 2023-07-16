import { Options } from "./run.interface";
import { Config } from "../../../config/config.interface";
import { Preset } from "../../../transform";
/**
 * Import module
 */
export declare const importModule: (name: string) => Promise<any>;
/**
 * Fetch configuration file path
 */
export declare const fetchConfigPath: () => Promise<string | void>;
/**
 * Fetch configuration
 */
export declare const fetchConfig: (options: Options) => Promise<Config>;
/**
 * Fetch list of template
 */
export declare const getTemplateList: (config: Config, presets: Preset[]) => string[];
/**
 * Fetch list of template file paths
 */
export declare const getTemplateFileList: (config: Config, presets: Preset[]) => string[];
/**
 * Fetch list of file extensions
 */
export declare const getOutputFileExtensionList: (config: Config, presets: Preset[]) => string[];
/**
 * Run action
 */
export declare const runAction: (inputToken: string, options: Options) => Promise<void>;
export default runAction;
