/** @type {import("@stegano/token-transformer").Config} */
const config = {
  /**
   * Output file information
   */
  outputFile: {
    /**
     * Output file name
     */
    name: "design-style",
    /**
     * Output file path
     */
    dir: "out",
    /**
     * Output file extension
     */
    // ext?: "scss",
  },

  /**
   * Preset modules
   * (=`preset` is a set of configurations that includes pre-processors and post-processors.)
   */
  presets: [
    "zeplin-scss",
    // or "zeplin-css",
    // or "jwt-formatter",
  ],

  /**
   * Token file path
   */
  tokenFile: "./design-token.json",

  /**
   * Token string
   * (=Use when you want to input the token directly rather than entering a path in the tokenFile field)
   */
  // token: "<token>",

  /**
   * Template file path
   */
  // templateFile: "<filePath>",

  /**
   * Pre-processor modules
   */
  // preProcessors: ["<module>"],

  /**
   * Post-processor modules
   */
  // postProcessors: ["<module>"],

  /**
   * Standard output to console
   * If `outputFile` value is not set, output to `stdout`
   */
  verbose: false,
};
module.exports = config;
