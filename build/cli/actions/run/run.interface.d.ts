/**
 * Options
 */
export interface Options {
    /**
     * Configuration file
     */
    configFile?: string;
    /**
     * Output file path
     */
    outputFile?: string;
    /**
     * Token
     */
    token?: string;
    /**
     * Token file path
     */
    tokenFile?: string;
    /**
     * Template
     */
    template?: string;
    /**
     * Templat file path
     */
    templateFile?: string;
    /**
     * Pre-processor module names
     */
    preProcessors?: string[];
    /**
     * Post-processor module names
     */
    postProcessors: string[];
    /**
     * Preset module names
     */
    presets: string[];
    /**
     * Standard output to console
     * If `outputFile` value is not set, output to `stdout`
     */
    verbose: boolean;
    /**
     * Debug mode
     */
    debug: boolean;
    /**
     * Run work in parallel
     */
    parallel: boolean;
}
