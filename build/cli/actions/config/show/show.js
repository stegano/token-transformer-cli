"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = void 0;
const chalk_1 = __importDefault(require("chalk"));
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const lodash_1 = __importDefault(require("lodash"));
const utils_1 = require("../../../utils");
const { log } = console;
/**
 * Pad the given number with the specified padding character on the left.
 */
const numberWithPadding = (number, paddingStr = " ", paddingSize = 0) => {
    const numberStr = number.toString();
    const padding = paddingStr.repeat(paddingSize - numberStr.length);
    return `${padding}${numberStr}`;
};
/**
 * Display json data
 */
const displayJson = (data, lineNumbers = false) => {
    const configStr = JSON.stringify(data, null, 2);
    if (lineNumbers === true) {
        const lines = configStr.split("\n");
        const paddingSize = lines.length.toString().length;
        lines.forEach((str, index) => {
            log(`${chalk_1.default.bgGreen(`${numberWithPadding(index, " ", paddingSize)}:`)} ${chalk_1.default.green(`${str}`)}`);
        });
    }
    else {
        log(chalk_1.default.green(configStr));
    }
};
/**
 * Show action
 */
const action = async (options) => {
    const index = Number(options.index);
    const configurationIndex = Number.isNaN(index) ? undefined : index;
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
        ? await (0, utils_1.importModule)(node_path_1.default.resolve(configFilePath))
        : undefined;
    if (Array.isArray(config) &&
        typeof configurationIndex === "number" &&
        configurationIndex >= config.length) {
        log(chalk_1.default.yellow(`[!] Configuration index \`${configurationIndex}\` does not exist. Please check the configuration file.`));
        return;
    }
    log(chalk_1.default.green.bold(`[✓] The configuration file found at \`${configFilePath}\` path.\n`));
    /**
     * Display the values for the input option names
     */
    if (options.name.length > 0) {
        options.name.forEach((n) => {
            const value = lodash_1.default.get(Array.isArray(config) && typeof configurationIndex === "number"
                ? config[configurationIndex]
                : config, n);
            log(chalk_1.default.bgGreen(`<${n}>\n`));
            switch (typeof value) {
                case "object": {
                    displayJson({ [n]: value }, options.lineNumbers);
                    log(`\n`);
                    break;
                }
                case "string": {
                    displayJson(lodash_1.default.set({}, n, value), options.lineNumbers);
                    log(`\n`);
                    break;
                }
                case "undefined":
                default: {
                    log(chalk_1.default.yellow(`[𝘟] the \`${n}\` does not exist.`));
                    break;
                }
            }
        });
        return;
    }
    /**
     * Display without name option
     */
    displayJson(Array.isArray(config) && typeof configurationIndex === "number"
        ? config[configurationIndex]
        : config, options.lineNumbers);
};
exports.action = action;
exports.default = exports.action;
