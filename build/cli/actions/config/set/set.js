"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../../../utils");
const { log } = console;
/**
 * Convert type
 */
const convertType = (value) => {
    switch (value) {
        case "false":
        case "true": {
            return Boolean(value);
        }
        default:
            return value;
    }
};
/**
 * Set action
 */
const action = async (options) => {
    const index = Number(options.index);
    const configurationIndex = Number.isNaN(index) ? 0 : index;
    const optionName = options.name;
    if (optionName === undefined) {
        log(chalk_1.default.yellow("[𝘟] Please specify the option name to be set."));
        return;
    }
    const optionValueList = options.value;
    if (optionValueList.length === 0) {
        log(chalk_1.default.yellow("[𝘟] Please specify the option value to be set."));
        return;
    }
    const supportedOptionNameList = [
        "outputFile.name",
        "outputFile.dir",
        "outputFile.ext",
        "token",
        "tokenFile",
        "template",
        "templateFile",
        "preProcessors",
        "postProcessors",
        "presets",
        "verbose",
        "debug",
    ];
    const supportedMultiOptionValueNameList = ["preProcessors", "postProcessors", "presets"];
    if (supportedOptionNameList.includes(optionName) === false) {
        log(chalk_1.default.yellow(`[𝘟] The \`${optionName}\` option is not supported.`));
        return;
    }
    if (optionValueList.length > 1 &&
        supportedMultiOptionValueNameList.includes(optionName) === false) {
        log(chalk_1.default.yellow(`[𝘟] The \`${optionName}\` option does not support multiple values.`));
        return;
    }
    const configFilePath = options.configFile
        ? ((await fs_extra_1.default.exists(options.configFile)) && options.configFile) || undefined
        : await (0, utils_1.fetchConfigFilePath)(utils_1.CONFIG_JSON_FILE_NAME);
    if (options.configFile && configFilePath === undefined) {
        log(chalk_1.default.yellow(`[𝘟] The configuration file does not exist at the \`${options.configFile}\` path.`));
        return;
    }
    if (configFilePath === undefined) {
        log(chalk_1.default.yellow("[𝘟] Configuration file does not exist. Please create the configuration file first using `tt init --cli` command."));
        return;
    }
    /**
     * Import configuration json
     */
    const config = configFilePath
        ? await (0, utils_1.importModule)(path_1.default.resolve(configFilePath))
        : undefined;
    if (Array.isArray(config) &&
        typeof configurationIndex === "number" &&
        configurationIndex >= config.length) {
        log(chalk_1.default.yellow(`[!] Configuration index \`${configurationIndex}\` does not exist. Please check the configuration file.`));
        return;
    }
    log(chalk_1.default.green.bold(`[✓] The configuration file found at \`${configFilePath}\` path.\n`));
    lodash_1.default.set(Array.isArray(config) ? config[configurationIndex] : config, optionName, supportedMultiOptionValueNameList.includes(optionName)
        ? optionValueList.map(convertType)
        : convertType(optionValueList[0]));
    fs_extra_1.default.writeFile(configFilePath, `${JSON.stringify(config, null, 2)}\n`);
    log(chalk_1.default.green.bold(`[✓] The \`${optionName}\` option has been set to \`${optionValueList}\`.`));
};
exports.action = action;
exports.default = exports.action;
