#!/usr/bin/env node
import path from "node:path";
import { Command } from "commander";
import { initAction } from "./actions";
import { runAction } from "./actions/run";
import { CONFIG_FILE_NAME } from "./cli.interface";

export const program = new Command("tt");

const { env } = process;

program
  .command("init")
  .option("-d, --fileDir <directory>", "Directory to generate config file", ".")
  .option("-f, --force", "Force creation if file exists", false)
  .action(initAction);

program
  .argument("[token]")
  .option(
    "-c, --config <file>",
    "Config file path",
    env.TT_CONFIG || path.resolve(process.cwd(), CONFIG_FILE_NAME),
  )
  .option("-o, --output-file <file>", "Output file path", env.TT_OUTPUT_FILE)
  .option("-i, --token <string>", "Input token (ignores file at token path)", env.TT_TOKEN)
  .option("-t, --token-file <file>", "Token file path", env.TT_TOKEN_FILE)
  .option("-b, --pre-processors <module...>", "Pre-processor names", env.TT_PRE_PROCESSORS || [])
  .option("-a, --post-processors <module...>", "Post-processor names", env.TT_POST_PROCESSORS || [])
  .option("-p, --presets <module...>", "Preset names", env.TT_PRESETS || [])
  .option(
    "-v, --verbose",
    "Print to stdout if output file doesn't exist",
    env.TT_VERBOSE === "true",
  )
  .action(runAction)
  .parse(process.argv);

program.version("0.0.13");

export default program;
