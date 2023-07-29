"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const transform_1 = require("../../../transform");
const utils_1 = require("../../utils");
const { error, log } = console;
/**
 * Fetch configuration
 */
const fetchConfig = async (options) => {
    let config = {};
    if (await fs_extra_1.default.exists(options.configFile)) {
        config = (await Promise.resolve(`${options.configFile}`).then(s => __importStar(require(s)))).default;
    }
    /**
     * Output file
     */
    if (options.outputFile) {
        const { name, dir, ext } = node_path_1.default.parse(options.outputFile);
        config.outputFile = {
            name,
            dir,
            ext,
        };
    }
    /**
     * Token information
     */
    if (options.token) {
        config.token = options.token;
    }
    /**
     * Token file
     */
    if (options.tokenFile) {
        config.tokenFile = options.tokenFile;
    }
    /**
     * Template
     */
    if (options.template) {
        config.template = options.template;
    }
    /**
     * Template file
     */
    if (options.templateFile) {
        config.templateFile = options.templateFile;
    }
    /**
     * Pre-processor modules
     */
    if (options.preProcessors) {
        config.preProcessors = await Promise.all([...(config.preProcessors || []), ...options.preProcessors].map((module) => {
            if (typeof module === "string") {
                return (0, utils_1.importModule)(module);
            }
            return module;
        }));
    }
    /**
     * Post-processor modules
     */
    if (options.postProcessors) {
        config.postProcessors = await Promise.all([...(config.postProcessors || []), ...options.postProcessors].map((module) => {
            if (typeof module === "string") {
                return (0, utils_1.importModule)(module);
            }
            return module;
        }));
    }
    /**
     * Preset modules
     */
    if (options.presets) {
        config.presets = await Promise.all([...(config.presets || []), ...options.presets].map((module) => {
            if (typeof module === "string") {
                return (0, utils_1.importModule)(module);
            }
            return module;
        }));
    }
    /**
     * Verbose mode
     */
    config.verbose = options.verbose === true;
    /**
     * Debug mode
     */
    config.debug = options.debug === true;
    return config;
};
/**
 * Fetch list of template
 */
const getTemplateList = (config, presets) => {
    const ret = [];
    if (config.template) {
        ret.push(config.template);
    }
    presets.forEach(({ template }) => {
        if (template) {
            ret.push(template);
        }
    });
    return ret;
};
/**
 * Fetch list of template file paths
 */
const getTemplateFileList = (config, presets) => {
    const ret = [];
    if (config.templateFile) {
        ret.push(config.templateFile);
    }
    presets.forEach(({ templateFile }) => {
        if (templateFile) {
            ret.push(templateFile);
        }
    });
    return ret;
};
/**
 * Fetch list of file extensions
 */
const getOutputFileExtensionList = (config, presets) => {
    const ret = [];
    if (config.outputFile?.ext) {
        ret.push(config.outputFile.ext);
    }
    presets.forEach(({ outputFile: output }) => {
        if (output?.ext) {
            ret.push(output.ext);
        }
    });
    return ret;
};
/**
 * Run action
 */
const action = async (inputToken, options) => {
    try {
        const configFilePath = (await (0, utils_1.fetchConfigFilePath)(utils_1.CONFIG_JS_FILE_NAME)) ||
            (await (0, utils_1.fetchConfigFilePath)(utils_1.CONFIG_JSON_FILE_NAME));
        const configFileDir = configFilePath ? node_path_1.default.dirname(configFilePath) : undefined;
        if (configFilePath) {
            log(chalk_1.default.green(`[✓] Configuration file found at \`${configFilePath}\`\n`));
        }
        else {
            log(chalk_1.default.yellow("[𝘟] Configuration file not found.\n"));
        }
        const currDir = process.cwd();
        const config = await fetchConfig({
            ...options,
            configFile: configFilePath || "",
            token: inputToken,
        });
        const { presets = [], outputFile } = config;
        const templateList = options.template ? [options.template] : getTemplateList(config, presets);
        const templateFileList = options.templateFile
            ? [options.templateFile]
            : getTemplateFileList(config, presets);
        /**
         * Error occurs when multiple templates exist.
         */
        if (templateList.length + templateFileList.length > 1) {
            log(chalk_1.default.red("[𝘟] Multiple templates have been set."));
            return;
        }
        let template = templateList[0];
        if (template === undefined && templateFileList.length > 0) {
            template = await fs_extra_1.default.readFile(templateFileList[0], "utf-8");
        }
        const outputFileExtensionList = options.outputFile
            ? [node_path_1.default.parse(options.outputFile).ext.slice(1)]
            : getOutputFileExtensionList(config, presets);
        const outputFileExtension = outputFileExtensionList[0];
        /**
         * Error occurs when multiple file extensions exist.
         */
        if (outputFileExtensionList.length > 1) {
            log(chalk_1.default.red("[𝘟] Multiple file extensions have been set."));
            return;
        }
        const token = config.token
            ? config.token
            : config.tokenFile &&
                (await fs_extra_1.default.readFile(node_path_1.default.resolve(options.tokenFile ? currDir : configFileDir || currDir, config.tokenFile), "utf-8"));
        /**
         * Error occurs when no token information exists
         */
        if (token === undefined) {
            log(chalk_1.default.red("[𝘟] Token information is not provided."));
            return;
        }
        /**
         * Collect processors present in presets and those in the configuration
         * [!] Processors present in configuration file are executed after preset settings
         */
        const preProcessors = [
            ...presets.reduce((ret, preset) => {
                ret.push(...(preset.preProcessors || []));
                return ret;
            }, []),
            ...(config.preProcessors || []),
        ];
        const postProcessors = [
            ...presets.reduce((ret, preset) => {
                ret.push(...(preset.postProcessors || []));
                return ret;
            }, []),
            ...(config.postProcessors || []),
        ];
        /**
         * Transformed token information
         */
        const transformed = await (0, transform_1.transform)(token, template, preProcessors, postProcessors);
        /**
         * Generate result file
         */
        if (outputFile?.dir && outputFile?.name) {
            await fs_extra_1.default.mkdirp(node_path_1.default.resolve(options.outputFile ? currDir : configFileDir || currDir, outputFile.dir));
            const parsedOutputName = node_path_1.default.parse(outputFile.name);
            const outputFilename = outputFileExtension
                ? `${node_path_1.default.basename(parsedOutputName.name)}.${outputFileExtension}`
                : parsedOutputName.name;
            const outputFilePath = node_path_1.default.resolve(outputFile.dir, outputFilename);
            await fs_extra_1.default.writeFile(outputFilePath, transformed, "utf-8");
            log(chalk_1.default.green(`[Success] Created '${outputFilePath}'.`));
        }
        else if (config.verbose === true) {
            if (transformed) {
                process.stdout.write(transformed);
            }
            else {
                process.stdout.write("(empty)");
            }
        }
    }
    catch (e) {
        if (options.debug) {
            error(e);
        }
        else {
            log(chalk_1.default.red(`[Error] ${e.message}`));
        }
    }
};
exports.action = action;
exports.default = exports.action;
