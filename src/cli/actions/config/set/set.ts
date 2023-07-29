import fs from "fs-extra";
import chalk from "chalk";
import path from "path";
import _ from "lodash";
import { CONFIG_JSON_FILE_NAME, fetchConfigFilePath, importModule } from "../../../utils";
import { Options } from "./set.interface";
import { Config } from "../../../../config";

const { log } = console;

/**
 * Convert type
 */
const convertType = (value: string) => {
  switch (value) {
    case "false":
    case "true": {
      return Boolean(value);
    }
    default:
      return value;
  }
};

/**
 * Set action
 */
export const action = async (options: Options) => {
  const optionName = options.name;

  if (optionName === undefined) {
    log(chalk.yellow("[𝘟] Please specify the option name to be set."));
    return;
  }

  const optionValueList = options.value;

  if (optionValueList.length === 0) {
    log(chalk.yellow("[𝘟] Please specify the option value to be set."));
    return;
  }

  const supportedOptionNameList = [
    "outputFile.name",
    "outputFile.dir",
    "outputFile.ext",
    "token",
    "tokenFile",
    "template",
    "templateFile",
    "preProcessors",
    "postProcessors",
    "presets",
    "verbose",
    "debug",
  ];

  const supportedMultiOptionValueNameList = ["preProcessors", "postProcessors", "presets"];

  if (supportedOptionNameList.includes(optionName) === false) {
    log(chalk.yellow(`[𝘟] The \`${optionName}\` option is not supported.`));
    return;
  }

  if (
    optionValueList.length > 1 &&
    supportedMultiOptionValueNameList.includes(optionName) === false
  ) {
    log(chalk.yellow(`[𝘟] The \`${optionName}\` option does not support multiple values.`));
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

  log(chalk.green.bold(`[✓] Configuration file found at the \`${configFilePath}\` path.\n`));

  _.set(
    config,
    optionName,
    supportedMultiOptionValueNameList.includes(optionName)
      ? optionValueList.map(convertType)
      : convertType(optionValueList[0]),
  );

  fs.writeFile(configFilePath, `${JSON.stringify(config, null, 2)}\n`);

  log(chalk.green.bold(`[✓] The \`${optionName}\` option has been set to \`${optionValueList}\`.`));
};

export default action;
