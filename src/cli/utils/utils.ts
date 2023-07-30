import path from "node:path";
import os from "node:os";
import fs from "fs-extra";
import { CONFIG_JSON_FILE_NAME, CONFIG_JS_FILE_NAME } from "./utils.interface";

/**
 * Import module
 */
export const importModule = async (name: string) => {
  try {
    return (await import(name)).default;
  } catch (e) {
    throw new Error(`\`${name}\` is not installed. Please install it first.`);
  }
};

/**
 * Fetch configuration file directory path
 */
export const fetchConfigDirPath = async (
  filename: string = CONFIG_JS_FILE_NAME,
): Promise<string | void> => {
  const homeDir = os.homedir();
  const currDir = process.cwd();
  if (await fs.exists(path.resolve(currDir, filename))) {
    return currDir;
  }
  if (await fs.exists(path.resolve(homeDir, filename))) {
    return homeDir;
  }
  return undefined;
};

/**
 * Fetch configuration file path
 */
export const fetchConfigFilePath = async (fileName?: string): Promise<string | undefined> => {
  const homeDir = os.homedir();
  const currDir = process.cwd();
  if (fileName) {
    let filePath: string;
    /**
     * If the input filename exists in the project directory or the home directory, it returns the path.
     */
    filePath = path.resolve(currDir, fileName);
    if (await fs.exists(filePath)) {
      return filePath;
    }
    filePath = path.resolve(homeDir, fileName);
    if (await fs.exists(filePath)) {
      return filePath;
    }
  } else {
    let filePath: string;
    /**
     * If the input filename does not exist, it searches for the file in the project directory or the home directory,
     * first with the .js extension and then with the .json extension. If the file is found, it returns the corresponding path
     */
    filePath = path.resolve(currDir, CONFIG_JS_FILE_NAME);
    if (await fs.exists(filePath)) {
      return filePath;
    }

    filePath = path.resolve(currDir, CONFIG_JSON_FILE_NAME);
    if (await fs.exists(filePath)) {
      return filePath;
    }

    filePath = path.resolve(homeDir, CONFIG_JS_FILE_NAME);
    if (await fs.exists(filePath)) {
      return filePath;
    }

    filePath = path.resolve(homeDir, CONFIG_JSON_FILE_NAME);
    if (await fs.exists(filePath)) {
      return filePath;
    }
  }
  return undefined;
};

export default {};
