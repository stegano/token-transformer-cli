/**
 * Pre-processor
 */
export type PreProcessor = (data: string | object) => object;
/**
 * Post-processor
 */
export type PostProcessor = (content: string, data: Readonly<object>) => string;
/**
 * Preset
 */
export interface Preset {
    /**
     * Pre-processors
     */
    preProcessors?: PreProcessor[];
    /**
     * Post-processors
     */
    postProcessors?: PostProcessor[];
    /**
     * Template file path
     * [!] If `template` is set, this setting is ignored
     */
    templateFile?: string;
    /**
     * Template string
     */
    template?: string;
    /**
     * Output file information
     */
    outputFile?: {
        /**
         * Output file extension
         */
        ext: string;
    };
}
