/* eslint-disable no-await-in-loop */
import path from "node:path";
import fs from "fs-extra";
import chalk from "chalk";
import { Options } from "./run.interface";
import { Config } from "../../../config/config.interface";
import { PostProcessor, PreProcessor, Preset, transform } from "../../../transform";
import { fetchConfigFilePath, importModule } from "../../utils";

const { error, log } = console;
const currDir = process.cwd();
/**
 * Fetch configuration
 */
const fetchConfigList = async (options: Options): Promise<Config[]> => {
  const configList: Config[] = [];

  if (options.configFile && (await fs.exists(options.configFile))) {
    const config: Config | Config[] = (await import(path.resolve(options.configFile))).default;
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

  return Promise.all(promiseList);
};

/**
 * Get list of template
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
 * Get list of template file paths
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
 * Get list of file extensions
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
 * Get list of pre-processor
 */
export const getPreProcessorList = (config: Config, presets: Preset[]) => {
  return [
    ...presets.reduce<PreProcessor[]>((ret, preset) => {
      if (preset.preProcessors) {
        const { processorOptions } = preset;
        ret.push(
          ...preset.preProcessors.map<PreProcessor>((processor) => {
            return Array.isArray(processor)
              ? [processor[0], { ...processor[1], ...processorOptions }]
              : [processor, processorOptions];
          }),
        );
      }
      return ret;
    }, []),
    // [!] Processors in the configuration file are added to the end of the list.
    ...(config.preProcessors || []),
  ];
};

/**
 * Get list of post-processor
 */
export const getPostProcessorList = (config: Config, presets: Preset[]) => {
  return [
    ...presets.reduce<PostProcessor[]>((ret, preset) => {
      if (preset.postProcessors) {
        const { processorOptions } = preset;
        ret.push(
          ...preset.postProcessors.map<PostProcessor>((processor) => {
            return Array.isArray(processor)
              ? [processor[0], { ...processor[1], ...processorOptions }]
              : [processor, processorOptions];
          }),
        );
      }
      return ret;
    }, []),
    // [!] Processors in the configuration file are added to the end of the list.
    ...(config.postProcessors || []),
  ];
};

/**
 * Display key-value pairs of an object in the console.
 */
const displayObjectKv = (config: object, prefix?: string) => {
  Object.entries(config).forEach(([key, value]) => {
    switch (typeof value) {
      case "object": {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            const k = prefix ? `${prefix}.${key}[${index}]` : `${key}[${index}]`;
            if (typeof item === "function") {
              log(chalk.bgBlack.white(`> ${k}: <function>`));
            } else if (typeof item === "string") {
              log(chalk.bgBlack.white(`> ${k}: "${value}"`));
            } else {
              displayObjectKv(item, `${key}[${index}]`);
            }
          });
        } else {
          displayObjectKv(value, `${key}`);
        }
        break;
      }
      default: {
        const k = prefix ? `${prefix}.${key}` : `${key}`;
        log(chalk.bgBlack.white(`> ${k}: "${value}"`));
        break;
      }
    }
  });
};

/**
 * Display the applied configurations in the console.
 */
const displayAppliedConfigurations = (config: Config) => {
  log(chalk.bgBlack.white.bold("[✓] Applied configurations."));
  displayObjectKv(config);
  log("");
};

/**
 * Perform the transformation process with the input options and configurations.
 */
const performTransformation = async (config: Config, configFileDir?: string) => {
  const { presets = [], outputFile } = config;
  const templateList = config.template ? [config.template] : getTemplateList(config, presets);

  const templateFileList = config.templateFile
    ? [config.templateFile]
    : getTemplateFileList(config, presets);

  displayAppliedConfigurations(config);

  /**
   * Error occurs when multiple templates exist.
   */
  if (templateList.length + templateFileList.length > 1) {
    log(chalk.red("[𝘟] Multiple templates have been set."));
    return;
  }

  const template =
    templateFileList.length > 0 ? await fs.readFile(templateFileList[0], "utf-8") : templateList[0];

  const outputFileExtensionList = config.outputFile?.ext
    ? [config.outputFile?.ext]
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
        path.resolve(config.tokenFile ? currDir : configFileDir || currDir, config.tokenFile),
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
   * Transformed token information
   */
  const transformed = await transform(
    token,
    template,
    getPreProcessorList(config, presets),
    getPostProcessorList(config, presets),
  );

  /**
   * Generate result file
   */
  if (outputFile?.dir && outputFile?.name) {
    await fs.mkdirp(
      path.resolve(config.outputFile ? currDir : configFileDir || currDir, outputFile.dir),
    );
    const parsedOutputName = path.parse(outputFile.name);
    const outputFilename = outputFileExtension
      ? `${path.basename(parsedOutputName.name)}.${outputFileExtension}`
      : parsedOutputName.name;
    const outputFilePath = path.resolve(outputFile.dir, outputFilename);
    await fs.writeFile(outputFilePath, transformed, "utf-8");
    log(chalk.green(`[✓] Created '${outputFilePath}'.`));
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
    const configFilePath = options.configFile
      ? ((await fs.exists(options.configFile)) && options.configFile) || undefined
      : await fetchConfigFilePath();

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

    const configFileDir = configFilePath ? path.dirname(configFilePath) : undefined;

    if (configFilePath) {
      log(chalk.green.bold(`[✓] The configuration file found at \`${configFilePath}\` path.\n`));
    } else {
      log(chalk.yellow("[𝘟] Configuration file not found."));
    }

    const configList = await fetchConfigList({
      ...options,
      configFile: configFilePath,
      token: inputToken,
    });

    if (options.parallel) {
      await Promise.all(configList.map((config) => performTransformation(config, configFileDir)));
    } else {
      for (let i = 0; i < configList.length; i += 1) {
        await performTransformation(configList[i], configFileDir);
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
