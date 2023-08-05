/**
 * Processor options
 */
type ProcessorOptions = Record<string, any>;

/**
 * Pre-processor
 */
export type PreProcessor<R extends object = any, O extends ProcessorOptions = any> =
  | ((data: string | R, options?: Readonly<O>) => R)
  | [processor: (data: string | R, options?: Readonly<O>) => R, options?: O];

/**
 * Post-processor
 */
export type PostProcessor<D extends object = any, O extends ProcessorOptions = any> =
  | ((content: string, data: Readonly<D>, options?: Readonly<O>) => string)
  | [processor: (content: string, data: Readonly<D>, options?: Readonly<O>) => string, options?: O];

/**
 * Preset
 */
export interface Preset<P extends ProcessorOptions = any> {
  /**
   * Pre-processors
   */
  preProcessors?: PreProcessor<any, P>[];
  /**
   * Post-processors
   */
  postProcessors?: PostProcessor<any, P>[];
  /**
   * Processor options
   */
  processorOptions?: P;
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
