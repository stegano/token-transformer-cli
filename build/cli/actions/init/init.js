"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initAction = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const cli_interface_1 = require("../../cli.interface");
const { log } = console;
/**
 * Configuration file name
 */
const filename = cli_interface_1.CONFIG_FILE_NAME;
/**
 * Create configuration file
 */
const initAction = async (options) => {
    const isExistFile = await fs_extra_1.default.exists(node_path_1.default.resolve(process.cwd(), options.fileDir, filename));
    if (isExistFile === true && options.force === false) {
        log(chalk_1.default.yellow(`Failed to create the default configuration file because a configuration file already exists. Use the \`-f\` flag if you want to overwrite the existing file.`));
        return;
    }
    if (isExistFile === false || options.force === true) {
        fs_extra_1.default.copy(node_path_1.default.resolve(__dirname, filename), node_path_1.default.resolve(process.cwd(), options.fileDir, filename));
    }
};
exports.initAction = initAction;
exports.default = exports.initAction;
