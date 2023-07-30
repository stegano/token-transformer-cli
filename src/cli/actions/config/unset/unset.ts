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
  const optionName = options.name;

  if (optionName === undefined) {
    log(chalk.yellow("[𝘟] Please specify the option name to be unset."));
    return;
  }

  const configFilePath = (await fetchConfigFilePath(CONFIG_JSON_FILE_NAME)) || options.configFile;

  /**
   * Import configuration json
   */
  const config: Config | false =
    (await fs.exists(configFilePath)) && (await importModule(path.resolve(configFilePath)));

  if (config === false) {
    log(
      chalk.yellow(
        "[𝘟] Configuration file does not exist. Please create the configuration file first using `tt init --cli` command.",
      ),
    );
    return;
  }

  log(chalk.green.bold(`[✓] The configuration file found at \`${configFilePath}\` path.\n`));

  _.set(config, optionName, undefined);

  fs.writeFile(configFilePath, `${JSON.stringify(config, null, 2)}\n`);

  log(chalk.green.bold(`[✓] The \`${optionName}\` option has been unset.`));
};

export default action;
