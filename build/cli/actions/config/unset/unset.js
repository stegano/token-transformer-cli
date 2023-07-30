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
 * Unset action
 */
const action = async (options) => {
    const optionName = options.name;
    if (optionName === undefined) {
        log(chalk_1.default.yellow("[𝘟] Please specify the option name to be unset."));
        return;
    }
    const configFilePath = (await (0, utils_1.fetchConfigFilePath)(utils_1.CONFIG_JSON_FILE_NAME)) || options.configFile;
    /**
     * Import configuration json
     */
    const config = (await fs_extra_1.default.exists(configFilePath)) && (await (0, utils_1.importModule)(path_1.default.resolve(configFilePath)));
    if (config === false) {
        log(chalk_1.default.yellow("[𝘟] Configuration file does not exist. Please create the configuration file first using `tt init --cli` command."));
        return;
    }
    log(chalk_1.default.green.bold(`[✓] The configuration file found at \`${configFilePath}\` path.\n`));
    lodash_1.default.set(config, optionName, undefined);
    fs_extra_1.default.writeFile(configFilePath, `${JSON.stringify(config, null, 2)}\n`);
    log(chalk_1.default.green.bold(`[✓] The \`${optionName}\` option has been unset.`));
};
exports.action = action;
exports.default = exports.action;
