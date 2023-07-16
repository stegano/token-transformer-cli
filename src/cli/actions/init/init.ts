/* eslint-disable import/extensions */
import path from "node:path";
import fs from "fs-extra";
import chalk from "chalk";
import { Options } from "./init.interface";
import { CONFIG_FILE_NAME } from "../../cli.interface";
import defaultConfig from "./token-transformer.config.js";

const { log } = console;

/**
 * Configuration file name
 */
const filename = CONFIG_FILE_NAME;

/**
 * Create configuration file
 */
export const initAction = async (options: Options): Promise<void> => {
  const isExistFile = await fs.exists(path.resolve(process.cwd(), options.fileDir, filename));
  if (isExistFile === true && options.force === false) {
    log(
      chalk.yellow(
        `Failed to create the default configuration file because a configuration file already exists. Use the \`-f\` flag if you want to overwrite the existing file.`,
      ),
    );
    return;
  }
  if (isExistFile === false || options.force === true) {
    await fs.writeFile(path.resolve(process.cwd(), options.fileDir, filename), defaultConfig, {
      encoding: "utf-8",
    });
  }
};

export default initAction;
