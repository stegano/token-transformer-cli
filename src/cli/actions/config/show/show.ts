import chalk from "chalk";
import path from "node:path";
import fs from "fs-extra";
import _ from "lodash";
import { CONFIG_JSON_FILE_NAME, fetchConfigFilePath, importModule } from "../../../utils";
import { Options } from "./show.interface";
import { Config } from "../../../../config";

const { log } = console;

/**
 * Pad the given number with the specified padding character on the left.
 */
const numberWithPadding = (number: number, paddingStr = " ", paddingSize: number = 0) => {
  const numberStr = number.toString();
  const padding = paddingStr.repeat(paddingSize - numberStr.length);
  return `${padding}${numberStr}`;
};

/**
 * Display json data
 */
const displayJson = (data: object, lineNumbers: boolean = false) => {
  const configStr = JSON.stringify(data, null, 2);
  if (lineNumbers === true) {
    const lines = configStr.split("\n");
    const paddingSize = lines.length.toString().length;
    lines.forEach((str, index) => {
      log(
        `${chalk.bgGreen(`${numberWithPadding(index, " ", paddingSize)}:`)} ${chalk.green(
          `${str}`,
        )}`,
      );
    });
  } else {
    log(chalk.green(configStr));
  }
};

/**
 * Show action
 */
export const action = async (options: Options) => {
  const configFilePath = (await fetchConfigFilePath(CONFIG_JSON_FILE_NAME)) || options.configFile;

  /**
   * Import configuration json
   */
  const config: Config | false =
    (await fs.exists(configFilePath)) && (await importModule(path.resolve(configFilePath)));

  if (config === false) {
    log(
      chalk.yellow(
        "[!] Configuration file does not exist. Please create the configuration file first using `tt init` command.",
      ),
    );
    return;
  }

  log(chalk.green.bold(`[✓] Configuration file found at the \`${configFilePath}\` path.\n`));

  /**
   * Display the values for the input option names
   */
  if (options.name.length > 0) {
    options.name.forEach((n) => {
      const value = _.get(config, n);
      log(chalk.bgGreen(`<${n}>\n`));
      switch (typeof value) {
        case "object": {
          displayJson({ [n]: value }, options.lineNumbers);
          log(`\n`);
          break;
        }
        case "string": {
          displayJson(_.set({}, n, value), options.lineNumbers);
          log(`\n`);
          break;
        }
        case "undefined":
        default: {
          log(chalk.yellow(`[𝘟] the \`${n}\` does not exist.`));
          break;
        }
      }
    });
    return;
  }

  /**
   * Display without name option
   */
  displayJson(config, options.lineNumbers);
};

export default action;
