import path from "node:path";
import fs from "fs-extra";
import chalk from "chalk";
import { Options } from "./init.interface";
import { CONFIG_JSON_FILE_NAME, CONFIG_JS_FILE_NAME, importModule } from "../../utils";

const { log } = console;

/**
 * Create configuration file
 */
export const action = async (options: Options): Promise<void> => {
  const isExistFile = await fs.exists(
    path.resolve(
      process.cwd(),
      options.fileDir,
      options.cli ? CONFIG_JSON_FILE_NAME : CONFIG_JS_FILE_NAME,
    ),
  );
  if (isExistFile === true && options.force === false) {
    log(
      chalk.yellow(
        `[𝘟] Failed to create the default configuration file because a configuration file already exists. Use the \`-f\` flag if you want to overwrite the existing file.`,
      ),
    );
    return;
  }
  if (isExistFile === false || options.force === true) {
    const configFilePath = path.resolve(
      process.cwd(),
      options.fileDir,
      options.cli ? CONFIG_JSON_FILE_NAME : CONFIG_JS_FILE_NAME,
    );

    if (options.cli) {
      const config = await importModule(path.resolve(__dirname, CONFIG_JS_FILE_NAME));
      fs.writeFile(configFilePath, `${JSON.stringify(config, null, 2)}\n`);
    } else {
      fs.copy(path.resolve(__dirname, CONFIG_JS_FILE_NAME), configFilePath);
    }

    log(
      chalk.green.bold(
        `[✓] A configuration file has been created at the \`${configFilePath}\` path.`,
      ),
    );
  }
};

export default action;
