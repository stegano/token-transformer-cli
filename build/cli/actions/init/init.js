"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("../../utils");
const { log } = console;
/**
 * Create configuration file
 */
const action = async (options) => {
    const isExistFile = await fs_extra_1.default.exists(node_path_1.default.resolve(process.cwd(), options.fileDir, options.cli ? utils_1.CONFIG_JSON_FILE_NAME : utils_1.CONFIG_JS_FILE_NAME));
    if (isExistFile === true && options.force === false) {
        log(chalk_1.default.yellow(`[𝘟] Failed to create the default configuration file because a configuration file already exists. Use the \`-f\` flag if you want to overwrite the existing file.`));
        return;
    }
    if (isExistFile === false || options.force === true) {
        const configFilePath = node_path_1.default.resolve(process.cwd(), options.fileDir, options.cli ? utils_1.CONFIG_JSON_FILE_NAME : utils_1.CONFIG_JS_FILE_NAME);
        if (options.cli) {
            const config = await (0, utils_1.importModule)(node_path_1.default.resolve(__dirname, utils_1.CONFIG_JS_FILE_NAME));
            fs_extra_1.default.writeFile(configFilePath, `${JSON.stringify(config, null, 2)}\n`);
        }
        else {
            fs_extra_1.default.copy(node_path_1.default.resolve(__dirname, utils_1.CONFIG_JS_FILE_NAME), configFilePath);
        }
        log(chalk_1.default.green.bold(`[✓] A configuration file has been created at the \`${configFilePath}\` path.`));
    }
};
exports.action = action;
exports.default = exports.action;
