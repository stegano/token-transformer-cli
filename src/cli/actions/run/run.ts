/* eslint-disable global-require */
import path from "node:path";
import os from "node:os";
import fs from "fs-extra";
import chalk from "chalk";
import { Options } from "./run.interface";
import { Config } from "../../../config/config.interface";
import { PostProcessor, PreProcessor, Preset, transform } from "../../../transform";
import { CONFIG_FILE_NAME } from "../../cli.interface";

const { log } = console;

/**
 * Import module
 */
export const importModule = async (name: string, builtInPrefix?: string) => {
  /**
   * Module loading proiority
   * `bulit-in` → `node_modules`
   */
  const builtInModulePath = path.resolve(__dirname, "../../../built-in", builtInPrefix || "", name);
  if (await fs.exists(builtInModulePath)) {
    return (await import(builtInModulePath)).default;
  }
  return import(name);
};

/**
 * Fetch configuration file path
 */
export const fetchConfigPath = async (): Promise<string | void> => {
  const homeDir = os.homedir();
  const currDir = process.cwd();
  if (await fs.exists(path.resolve(currDir, CONFIG_FILE_NAME))) {
    return currDir;
  }
  if (await fs.exists(path.resolve(homeDir, CONFIG_FILE_NAME))) {
    return homeDir;
  }
  return undefined;
};

/**
 * Fetch configuration
 */
export const fetchConfig = async (options: Options): Promise<Config> => {
  let config = {} as Config;
  if (await fs.exists(options.config)) {
    config = (await import(options.config)).default;
  }

  /**
   * Output file
   */
  if (options.outputFile) {
    const { name, dir, ext } = path.parse(options.outputFile);
    config.outputFile = {
      name,
      dir,
      ext,
    };
  }

  /**
   * Token information
   */
  if (options.token) {
    config.token = options.token;
  }

  /**
   * Token file
   */
  if (options.tokenFile) {
    config.tokenFile = options.tokenFile;
  }

  /**
   * Template
   */
  if (options.templateFile) {
    config.templateFile = options.templateFile;
  }

  /**
   * Pre-processor modules
   */
  if (options.preProcessors) {
    config.preProcessors = await Promise.all(
      [...(config.preProcessors || []), ...options.preProcessors].map((module) => {
        if (typeof module === "string") {
          return importModule(module, "pre-processors");
        }
        return module;
      }),
    );
  }

  /**
   * Post-processor modules
   */
  if (options.postProcessors) {
    config.postProcessors = await Promise.all(
      [...(config.postProcessors || []), ...options.postProcessors].map((module) => {
        if (typeof module === "string") {
          return importModule(module, "post-processors");
        }
        return module;
      }),
    );
  }

  /**
   * Preset modules
   */
  if (options.presets) {
    config.presets = await Promise.all(
      [...(config.presets || []), ...options.presets].map((module) => {
        if (typeof module === "string") {
          return importModule(module, "presets");
        }
        return module;
      }),
    );
  }

  /**
   * Verbose mode
   */
  config.verbose = options.verbose === true;

  /**
   * Debug mode
   */
  config.debug = options.debug === true;
  return config;
};

/**
 * Fetch list of template file paths
 */
export const getTemplateFileList = (config: Config, presets: Preset[]): string[] => {
  const ret: string[] = [];
  if (config.templateFile) {
    ret.push(config.templateFile);
  }
  presets.forEach(({ templateFile }) => {
    if (templateFile) {
      ret.push(templateFile);
    }
  });
  return ret;
};

/**
 * Fetch list of file extensions
 */
export const getOutputFileExtensionList = (config: Config, presets: Preset[]): string[] => {
  const ret: string[] = [];
  if (config.outputFile?.ext) {
    ret.push(config.outputFile.ext);
  }
  presets.forEach(({ outputFile: output }) => {
    if (output?.ext) {
      ret.push(output.ext);
    }
  });
  return ret;
};

/**
 * Run action
 */
export const runAction = async (inputToken: string, options: Options): Promise<void> => {
  try {
    const currDir = process.cwd();
    const config = await fetchConfig({ ...options, token: inputToken });
    const configFileDir = await fetchConfigPath();

    const { presets = [], outputFile } = config;

    const templateFileList = options.templateFile
      ? [options.templateFile]
      : getTemplateFileList(config, presets);
    const template =
      templateFileList.length === 0 ? undefined : await fs.readFile(templateFileList[0], "utf-8");

    /**
     * Error occurs when multiple templates exist
     */
    if (templateFileList.length > 1) {
      throw new Error("Multiple templates have been set.");
    }

    const outputFileExtensionList = options.outputFile
      ? [path.parse(options.outputFile).ext.slice(1)]
      : getOutputFileExtensionList(config, presets);
    const outputFileExtension = outputFileExtensionList[0];

    /**
     * Error occurs when multiple file extensions exist
     */
    if (outputFileExtensionList.length > 1) {
      throw new Error("Multiple file extensions have been set.");
    }

    const token = config.token
      ? config.token
      : config.tokenFile &&
        (await fs.readFile(
          path.resolve(options.tokenFile ? currDir : configFileDir || currDir, config.tokenFile),
          "utf-8",
        ));

    /**
     * Error occurs when no token information exists
     */
    if (token === undefined) {
      throw new Error("Token information is not provided.");
    }

    /**
     * Collect processors present in presets and those in the configuration
     * [!] Processors present in configuration file are executed after preset settings
     */
    const preProcessors: PreProcessor[] = [
      ...presets.reduce<PreProcessor[]>((ret, preset) => {
        ret.push(...(preset.preProcessors || []));
        return ret;
      }, []),
      ...(config.preProcessors || []),
    ];
    const postProcessors: PostProcessor[] = [
      ...presets.reduce<PostProcessor[]>((ret, preset) => {
        ret.push(...(preset.postProcessors || []));
        return ret;
      }, []),
      ...(config.postProcessors || []),
    ];

    /**
     * Transformed token information
     */
    const transformed = await transform(token, template, preProcessors, postProcessors);

    /**
     * Generate result file
     */
    if (outputFile) {
      await fs.mkdirp(
        path.resolve(options.outputFile ? currDir : configFileDir || currDir, outputFile.dir),
      );
      const parsedOutputName = path.parse(outputFile.name);
      const outputFilename =
        path.basename(parsedOutputName.name) +
        (outputFileExtension ? `.${outputFileExtension}` : "");
      const outputFilePath = path.resolve(outputFile.dir, outputFilename);
      await fs.writeFile(outputFilePath, transformed, "utf-8");
      log(chalk.green(`[Success] Created '${outputFilePath}'.`));
    } else if (config.verbose === true) {
      if (transformed) {
        process.stdout.write(transformed);
      } else {
        process.stdout.write("(empty)");
      }
    }
  } catch (e) {
    log(chalk.red(`[Error] ${(e as Error).message}`));
  }
};

export default runAction;
