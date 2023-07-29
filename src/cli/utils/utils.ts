import path from "node:path";
import os from "node:os";
import fs from "fs-extra";
import { CONFIG_JS_FILE_NAME } from "./utils.interface";

/**
 * Import module
 */
export const importModule = async (name: string) => {
  return (await import(name)).default;
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
export const fetchConfigFilePath = async (
  filename: string = CONFIG_JS_FILE_NAME,
): Promise<string | void> => {
  const homeDir = os.homedir();
  const currDir = process.cwd();
  if (await fs.exists(path.resolve(currDir, filename))) {
    return path.resolve(currDir, filename);
  }
  if (await fs.exists(path.resolve(homeDir, filename))) {
    return path.resolve(homeDir, filename);
  }
  return undefined;
};

export default {};
