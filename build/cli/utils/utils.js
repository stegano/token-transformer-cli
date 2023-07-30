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
exports.fetchConfigFilePath = exports.fetchConfigDirPath = exports.importModule = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_os_1 = __importDefault(require("node:os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const utils_interface_1 = require("./utils.interface");
/**
 * Import module
 */
const importModule = async (name) => {
    try {
        return (await Promise.resolve(`${name}`).then(s => __importStar(require(s)))).default;
    }
    catch (e) {
        throw new Error(`\`${name}\` is not installed. Please install it first.`);
    }
};
exports.importModule = importModule;
/**
 * Fetch configuration file directory path
 */
const fetchConfigDirPath = async (filename = utils_interface_1.CONFIG_JS_FILE_NAME) => {
    const homeDir = node_os_1.default.homedir();
    const currDir = process.cwd();
    if (await fs_extra_1.default.exists(node_path_1.default.resolve(currDir, filename))) {
        return currDir;
    }
    if (await fs_extra_1.default.exists(node_path_1.default.resolve(homeDir, filename))) {
        return homeDir;
    }
    return undefined;
};
exports.fetchConfigDirPath = fetchConfigDirPath;
/**
 * Fetch configuration file path
 */
const fetchConfigFilePath = async (fileName) => {
    const homeDir = node_os_1.default.homedir();
    const currDir = process.cwd();
    if (fileName) {
        let filePath;
        /**
         * If the input filename exists in the project directory or the home directory, it returns the path.
         */
        filePath = node_path_1.default.resolve(currDir, fileName);
        if (await fs_extra_1.default.exists(filePath)) {
            return filePath;
        }
        filePath = node_path_1.default.resolve(homeDir, fileName);
        if (await fs_extra_1.default.exists(filePath)) {
            return filePath;
        }
    }
    else {
        let filePath;
        /**
         * If the input filename does not exist, it searches for the file in the project directory or the home directory,
         * first with the .js extension and then with the .json extension. If the file is found, it returns the corresponding path
         */
        filePath = node_path_1.default.resolve(currDir, utils_interface_1.CONFIG_JS_FILE_NAME);
        if (await fs_extra_1.default.exists(filePath)) {
            return filePath;
        }
        filePath = node_path_1.default.resolve(currDir, utils_interface_1.CONFIG_JSON_FILE_NAME);
        if (await fs_extra_1.default.exists(filePath)) {
            return filePath;
        }
        filePath = node_path_1.default.resolve(homeDir, utils_interface_1.CONFIG_JS_FILE_NAME);
        if (await fs_extra_1.default.exists(filePath)) {
            return filePath;
        }
        filePath = node_path_1.default.resolve(homeDir, utils_interface_1.CONFIG_JSON_FILE_NAME);
        if (await fs_extra_1.default.exists(filePath)) {
            return filePath;
        }
    }
    return undefined;
};
exports.fetchConfigFilePath = fetchConfigFilePath;
exports.default = {};
