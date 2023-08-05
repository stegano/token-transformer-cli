import { Config } from "../../../config";
import { getPostProcessorList, getPreProcessorList } from "./run";

describe("`getPreProcessorList` function", () => {
  it("should return the list of pre-processor", () => {
    const preProcessor = () => {};

    expect(getPreProcessorList({}, [{}])).toEqual([]);

    const config: Config = {
      preProcessors: [preProcessor],
    };

    expect(
      getPreProcessorList({}, [
        {
          preProcessors: [preProcessor],
        },
      ]),
    ).toHaveLength(1);

    expect(
      getPreProcessorList({}, [
        {
          preProcessors: [preProcessor, preProcessor],
        },
      ]),
    ).toHaveLength(2);

    expect(
      getPreProcessorList(config, [
        {
          preProcessors: [preProcessor, preProcessor],
        },
      ]),
    ).toHaveLength(3);

    const preProcessorList = getPreProcessorList(config, [
      {
        preProcessors: [preProcessor, preProcessor],
        processorOptions: { option: "option" },
      },
    ]).map((processor) => {
      return Array.isArray(processor) ? processor : [processor];
    });

    expect(preProcessorList[0][1]).toEqual({ option: "option" });
    expect(preProcessorList[1][1]).toEqual({ option: "option" });
    // [!] Processors in the configuration file are added to the end of the list.
    expect(preProcessorList[2][1]).toBe(undefined);
  });
});

describe("`getPostProcessorList` function", () => {
  it("should return the list of post-processor", () => {
    const postProcessor = () => "";

    expect(getPostProcessorList({}, [{}])).toEqual([]);

    const config: Config = {
      postProcessors: [postProcessor],
    };

    expect(
      getPostProcessorList({}, [
        {
          postProcessors: [postProcessor],
        },
      ]),
    ).toHaveLength(1);

    expect(
      getPostProcessorList({}, [
        {
          postProcessors: [postProcessor, postProcessor],
        },
      ]),
    ).toHaveLength(2);

    expect(
      getPostProcessorList(config, [
        {
          postProcessors: [postProcessor, postProcessor],
        },
      ]),
    ).toHaveLength(3);

    const postProcessorList = getPostProcessorList(config, [
      {
        postProcessors: [postProcessor, postProcessor],
        processorOptions: { option: "option" },
      },
    ]).map((processor) => {
      return Array.isArray(processor) ? processor : [processor];
    });

    expect(postProcessorList[0][1]).toEqual({ option: "option" });
    expect(postProcessorList[1][1]).toEqual({ option: "option" });
    // [!] Processors in the configuration file are added to the end of the list.
    expect(postProcessorList[2][1]).toBe(undefined);
  });
});
