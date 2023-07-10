import type { PreProcessor, PostProcessor, Preset } from "../transform";

/**
 * Config
 */
export interface Config {
  /**
   * Output file information
   */
  outputFile?: {
    /**
     * Output file name
     */
    name: string;
    /**
     * Output file path
     */
    dir: string;
    /**
     * Output file extension
     */
    ext?: string;
  };
  /**
   * Token string
   */
  token?: string;
  /**
   * Token file path
   */
  tokenFile?: string;
  /**
   * Template file path
   */
  templateFile?: string;
  /**
   * Pre-processor modules
   */
  preProcessors?: PreProcessor[];
  /**
   * Post-processor modules
   */
  postProcessors?: PostProcessor[];
  /**
   * Preset modules
   */
  presets?: Preset[];
  /**
   * Standard output to console
   * If `outputFile` value is not set, output to `stdout`
   */
  verbose?: boolean;
  /**
   * Debug mode
   */
  debug?: boolean;
}
