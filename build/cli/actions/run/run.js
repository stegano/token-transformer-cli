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
exports.runAction = exports.getOutputFileExtensionList = exports.getTemplateFileList = exports.fetchConfig = exports.fetchConfigPath = exports.importModule = void 0;
/* eslint-disable global-require */
const node_path_1 = __importDefault(require("node:path"));
const node_os_1 = __importDefault(require("node:os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const transform_1 = require("../../../transform");
const cli_interface_1 = require("../../cli.interface");
const { error, log } = console;
/**
 * Import module
 */
const importModule = async (name, builtInPrefix) => {
    /**
     * Module loading proiority
     * `bulit-in` → `node_modules`
     */
    const builtInModulePath = node_path_1.default.resolve(__dirname, "../../../built-in", builtInPrefix || "", name);
    if (await fs_extra_1.default.exists(builtInModulePath)) {
        return (await Promise.resolve(`${builtInModulePath}`).then(s => __importStar(require(s)))).default;
    }
    return Promise.resolve(`${name}`).then(s => __importStar(require(s)));
};
exports.importModule = importModule;
/**
 * Fetch configuration file path
 */
const fetchConfigPath = async () => {
    const homeDir = node_os_1.default.homedir();
    const currDir = process.cwd();
    if (await fs_extra_1.default.exists(node_path_1.default.resolve(currDir, cli_interface_1.CONFIG_FILE_NAME))) {
        return currDir;
    }
    if (await fs_extra_1.default.exists(node_path_1.default.resolve(homeDir, cli_interface_1.CONFIG_FILE_NAME))) {
        return homeDir;
    }
    return undefined;
};
exports.fetchConfigPath = fetchConfigPath;
/**
 * Fetch configuration
 */
const fetchConfig = async (options) => {
    let config = {};
    if (await fs_extra_1.default.exists(options.config)) {
        config = (await Promise.resolve(`${options.config}`).then(s => __importStar(require(s)))).default;
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
    if (options.templateFile) {
        config.templateFile = options.templateFile;
    }
    /**
     * Pre-processor modules
     */
    if (options.preProcessors) {
        config.preProcessors = await Promise.all([...(config.preProcessors || []), ...options.preProcessors].map((module) => {
            if (typeof module === "string") {
                return (0, exports.importModule)(module, "pre-processors");
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
                return (0, exports.importModule)(module, "post-processors");
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
                return (0, exports.importModule)(module, "presets");
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
exports.fetchConfig = fetchConfig;
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
exports.getTemplateFileList = getTemplateFileList;
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
exports.getOutputFileExtensionList = getOutputFileExtensionList;
/**
 * Run action
 */
const runAction = async (inputToken, options) => {
    try {
        const currDir = process.cwd();
        const config = await (0, exports.fetchConfig)({ ...options, token: inputToken });
        const configFileDir = await (0, exports.fetchConfigPath)();
        if (configFileDir) {
            log(chalk_1.default.green.bold(`[!] Configuration file found at ${configFileDir}\n\n`));
        }
        else {
            log(chalk_1.default.yellow.bold("[!] Configuration file not found.\n\n"));
        }
        const { presets = [], outputFile } = config;
        const templateFileList = options.templateFile
            ? [options.templateFile]
            : (0, exports.getTemplateFileList)(config, presets);
        const template = templateFileList.length === 0 ? undefined : await fs_extra_1.default.readFile(templateFileList[0], "utf-8");
        /**
         * Error occurs when multiple templates exist
         */
        if (templateFileList.length > 1) {
            throw new Error("Multiple templates have been set.");
        }
        const outputFileExtensionList = options.outputFile
            ? [node_path_1.default.parse(options.outputFile).ext.slice(1)]
            : (0, exports.getOutputFileExtensionList)(config, presets);
        const outputFileExtension = outputFileExtensionList[0];
        /**
         * Error occurs when multiple file extensions exist
         */
        if (outputFileExtensionList.length > 1) {
            throw new Error("Multiple file extensions have been set.");
        }
        const token = config.token
            ? config.token
            : config.tokenFile &&
                (await fs_extra_1.default.readFile(node_path_1.default.resolve(options.tokenFile ? currDir : configFileDir || currDir, config.tokenFile), "utf-8"));
        /**
         * Error occurs when no token information exists
         */
        if (token === undefined) {
            throw new Error("Token information is not provided.");
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
        if (outputFile) {
            await fs_extra_1.default.mkdirp(node_path_1.default.resolve(options.outputFile ? currDir : configFileDir || currDir, outputFile.dir));
            const parsedOutputName = node_path_1.default.parse(outputFile.name);
            const outputFilename = node_path_1.default.basename(parsedOutputName.name) +
                (outputFileExtension ? `.${outputFileExtension}` : "");
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
exports.runAction = runAction;
exports.default = exports.runAction;
