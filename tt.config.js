const pkg = require("./package.json");

/** @type {import("@stegano/token-transformer").Config} */
const config = {
  /**
   * Output file information
   */
  outputFile: {
    /**
     * Output file name
     */
    name: "cli",
    /**
     * Output file path
     */
    dir: "./build/cli",
    /**
     * Output file extension
     */
    ext: "js",
  },

  /**
   * Preset modules
   * (=`preset` is a set of configurations that includes pre-processors and post-processors.)
   */
  presets: [],

  /**
   * Token string
   * (=Use when you want to input the token directly rather than entering a path in the tokenFile field)
   */
  token: " ",

  /**
   * Template file path
   */
  templateFile: "./build/cli/cli.js",

  /**
   * Post-processor modules
   */
  postProcessors: [
    (template) => {
      return template.replace("<version>", pkg.version);
    },
  ],
};
module.exports = config;
