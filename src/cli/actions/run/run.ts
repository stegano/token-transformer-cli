/* eslint-disable no-await-in-loop */
import path from "node:path";
import fs from "fs-extra";
import chalk from "chalk";
import { Options } from "./run.interface";
import { Config } from "../../../config/config.interface";
import { PostProcessor, PreProcessor, Preset, transform } from "../../../transform";
import {
  CONFIG_JSON_FILE_NAME,
  CONFIG_JS_FILE_NAME,
  fetchConfigFilePath,
  importModule,
} from "../../utils";

const { error, log } = console;
const currDir = process.cwd();
/**
 * Fetch configuration
 */
const fetchConfigList = async (options: Options): Promise<Config[]> => {
  const configList: Config[] = [];

  if (options.configFile && (await fs.exists(options.configFile))) {
    const config: Config | Config[] = (await import(options.configFile)).default;
    configList.push(...(Array.isArray(config) ? config : [config]));
  }

  const promiseList = configList.map(async (config) => {
    let ret: Config = { ...config };
    /**
     * Output file
     */
    if (options.outputFile) {
      const { name, dir, ext } = path.parse(options.outputFile);
      ret = {
        ...ret,
        outputFile: {
          name,
          dir,
          ext,
        },
      };
    }

    /**
     * Token information
     */
    if (options.token) {
      ret = {
        ...ret,
        token: options.token,
      };
    }

    /**
     * Token file
     */
    if (options.tokenFile) {
      ret = {
        ...ret,
        tokenFile: options.tokenFile,
      };
    }

    /**
     * Template
     */
    if (options.template) {
      ret = {
        ...ret,
        template: options.template,
      };
    }

    /**
     * Template file
     */
    if (options.templateFile) {
      ret = {
        ...ret,
        templateFile: options.templateFile,
      };
    }

    /**
     * Pre-processor modules
     */
    if (options.preProcessors) {
      ret = {
        ...ret,
        preProcessors: await Promise.all(
          [...(config.preProcessors || []), ...options.preProcessors].map((module) => {
            if (typeof module === "string") {
              return importModule(module);
            }
            return module;
          }),
        ),
      };
    }

    /**
     * Post-processor modules
     */
    if (options.postProcessors) {
      ret = {
        ...ret,
        postProcessors: await Promise.all(
          [...(config.postProcessors || []), ...options.postProcessors].map((module) => {
            if (typeof module === "string") {
              return importModule(module);
            }
            return module;
          }),
        ),
      };
    }

    /**
     * Preset modules
     */
    if (options.presets) {
      ret = {
        ...ret,
        presets: await Promise.all(
          [...(config.presets || []), ...options.presets].map((module) => {
            if (typeof module === "string") {
              return importModule(module);
            }
            return module;
          }),
        ),
      };
    }

    /**
     * Verbose mode
     */
    ret = {
      ...ret,
      verbose: options.verbose === true,
    };

    /**
     * Debug mode
     */
    ret = {
      ...ret,
      debug: options.debug === true,
    };

    return ret;
  });

  await Promise.all(promiseList);

  return configList;
};

/**
 * Fetch list of template
 */
const getTemplateList = (config: Config, presets: Preset[]): string[] => {
  const ret: string[] = [];
  if (config.template) {
    ret.push(config.template);
  }
  presets.forEach(({ template }) => {
    if (template) {
      ret.push(template);
    }
  });
  return ret;
};

/**
 * Fetch list of template file paths
 */
const getTemplateFileList = (config: Config, presets: Preset[]): string[] => {
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
const getOutputFileExtensionList = (config: Config, presets: Preset[]): string[] => {
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
 * Perform the transformation process with the input options and configurations.
 */
const performTransformation = async (options: Options, config: Config, configFileDir?: string) => {
  const { presets = [], outputFile } = config;
  const templateList = options.template ? [options.template] : getTemplateList(config, presets);

  const templateFileList = options.templateFile
    ? [options.templateFile]
    : getTemplateFileList(config, presets);

  /**
   * Error occurs when multiple templates exist.
   */
  if (templateList.length + templateFileList.length > 1) {
    log(chalk.red("[𝘟] Multiple templates have been set."));
    return;
  }

  let template = templateList[0];

  if (template === undefined && templateFileList.length > 0) {
    template = await fs.readFile(templateFileList[0], "utf-8");
  }

  const outputFileExtensionList = options.outputFile
    ? [path.parse(options.outputFile).ext.slice(1)]
    : getOutputFileExtensionList(config, presets);
  const outputFileExtension = outputFileExtensionList[0];

  /**
   * Error occurs when multiple file extensions exist.
   */
  if (outputFileExtensionList.length > 1) {
    log(chalk.red("[𝘟] Multiple file extensions have been set."));
    return;
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
    log(chalk.red("[𝘟] Token information is not provided."));
    return;
  }

  /**
   * Collect processors present in presets and those in the configuration
   * [!] Processors present in configuration file are executed after all preset settings
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
  if (outputFile?.dir && outputFile?.name) {
    await fs.mkdirp(
      path.resolve(options.outputFile ? currDir : configFileDir || currDir, outputFile.dir),
    );
    const parsedOutputName = path.parse(outputFile.name);
    const outputFilename = outputFileExtension
      ? `${path.basename(parsedOutputName.name)}.${outputFileExtension}`
      : parsedOutputName.name;
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
};

/**
 * Run action
 */
export const action = async (inputToken: string, options: Options): Promise<void> => {
  try {
    const configFilePath =
      (await fetchConfigFilePath(CONFIG_JS_FILE_NAME)) ||
      (await fetchConfigFilePath(CONFIG_JSON_FILE_NAME)) ||
      undefined;

    const configFileDir = configFilePath ? path.dirname(configFilePath) : undefined;

    if (configFilePath) {
      log(chalk.green(`[✓] Configuration file found at \`${configFilePath}\`\n`));
    } else {
      log(chalk.yellow("[𝘟] Configuration file not found.\n"));
    }

    const configList = await fetchConfigList({
      ...options,
      configFile: configFilePath,
      token: inputToken,
    });

    if (options.parallel) {
      await Promise.all(
        configList.map((config) => performTransformation(options, config, configFileDir)),
      );
    } else {
      for (let i = 0; i < configList.length; i += 1) {
        await performTransformation(options, configList[i], configFileDir);
      }
    }
  } catch (e) {
    if (options.debug) {
      error(e);
    } else {
      log(chalk.red(`[Error] ${(e as Error).message}`));
    }
  }
};

export default action;
