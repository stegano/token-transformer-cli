#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = void 0;
const node_path_1 = __importDefault(require("node:path"));
const commander_1 = require("commander");
const actions_1 = require("./actions");
const run_1 = require("./actions/run");
const cli_interface_1 = require("./cli.interface");
exports.program = new commander_1.Command("tt");
const { env } = process;
exports.program
    .command("init")
    .option("-d, --fileDir <directory>", "Directory to generate config file", ".")
    .option("-f, --force", "Force creation if file exists", false)
    .action(actions_1.initAction);
exports.program
    .argument("[token]")
    .option("-c, --config <file>", "Config file path", env.TT_CONFIG || node_path_1.default.resolve(process.cwd(), cli_interface_1.CONFIG_FILE_NAME))
    .option("-o, --output-file <file>", "Output file path", env.TT_OUTPUT_FILE)
    .option("-i, --token <string>", "Input token (ignores file at token path)", env.TT_TOKEN)
    .option("-t, --token-file <file>", "Token file path", env.TT_TOKEN_FILE)
    .option("-b, --pre-processors <module...>", "Pre-processor names", env.TT_PRE_PROCESSORS || [])
    .option("-a, --post-processors <module...>", "Post-processor names", env.TT_POST_PROCESSORS || [])
    .option("-p, --presets <module...>", "Preset names", env.TT_PRESETS || [])
    .option("-v, --verbose", "Print to stdout if output file doesn't exist", env.TT_VERBOSE === "true")
    .action(run_1.runAction)
    .parse(process.argv);
exports.program.version("0.0.13");
exports.default = exports.program;
