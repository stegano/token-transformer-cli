import fs from "fs-extra";
import chalk from "chalk";
import path from "path";
import _ from "lodash";
import { CONFIG_JSON_FILE_NAME, fetchConfigFilePath, importModule } from "../../../utils";
import { Options } from "./unset.interface";
import { Config } from "../../../../config";

const { log } = console;

/**
 * Unset action
 */
export const action = async (options: Options) => {
  const index = Number(options.index);
  const configurationIndex = Number.isNaN(index) ? 0 : index;
  const optionName = options.name;

  if (optionName === undefined) {
    log(chalk.yellow("[𝘟] Please specify the option name to be unset."));
    return;
  }

  const configFilePath = options.configFile
    ? ((await fs.exists(options.configFile)) && options.configFile) || undefined
    : await fetchConfigFilePath(CONFIG_JSON_FILE_NAME);

  if (options.configFile && configFilePath === undefined) {
    log(
      chalk.yellow(
        `[𝘟] The configuration file does not exist at the \`${options.configFile}\` path.`,
      ),
    );
    return;
  }

  if (configFilePath === undefined) {
    log(
      chalk.yellow(
        "[𝘟] Configuration file does not exist. Please create the configuration file first using `tt init --cli` command.",
      ),
    );
    return;
  }

  /**
   * Import configuration json
   */
  const config: Config[] | Config = configFilePath
    ? await importModule(path.resolve(configFilePath))
    : undefined;

  if (
    Array.isArray(config) &&
    typeof configurationIndex === "number" &&
    configurationIndex >= config.length
  ) {
    log(
      chalk.yellow(
        `[!] Configuration index \`${configurationIndex}\` does not exist. Please check the configuration file.`,
      ),
    );
    return;
  }

  log(chalk.green.bold(`[✓] The configuration file found at \`${configFilePath}\` path.\n`));

  _.set(Array.isArray(config) ? config[configurationIndex] : config, optionName, undefined);

  fs.writeFile(configFilePath, `${JSON.stringify(config, null, 2)}\n`);

  log(chalk.green.bold(`[✓] The \`${optionName}\` option has been unset.`));
};

export default action;
