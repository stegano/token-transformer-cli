/**
 * Pre-processor
 */
export type PreProcessor = (data: any) => object;

/**
 * Post-processor
 */
export type PostProcessor = (content: string, data: Readonly<object>) => string;

/**
 * Preset
 */
export interface Preset {
  preProcessors?: PreProcessor[];
  postProcessors?: PostProcessor[];
  templateFile?: string;
  outputFile?: {
    ext: string;
  };
}
