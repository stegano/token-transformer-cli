/**
 * Options
 */
export interface Options {
    /**
     * Force overwrite(if config file exists)
     */
    force: boolean;
    /**
     * Configuration file directory
     */
    fileDir: string;
    /**
     * Create a dedicated configuration file for the CLI
     */
    cli: boolean;
}
