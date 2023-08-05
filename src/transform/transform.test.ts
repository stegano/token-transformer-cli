/* eslint-disable no-param-reassign */
import { postProcess, preProcess } from "./transform";
import { PostProcessor, PreProcessor } from "./transform.interface";

describe("`preProcess` function", () => {
  it("should return the result of the pre-processor", () => {
    const processor: PreProcessor<{ result: string }> = (data) => {
      if (typeof data === "string") {
        return { result: data };
      }
      return { result: `${data.result}A` };
    };
    expect(preProcess("A", [processor])).toEqual({ result: "A" });
    expect(preProcess("A", [processor, processor])).toEqual({ result: "AA" });
    expect(preProcess("A", [processor, processor, processor])).toEqual({ result: "AAA" });
  });

  it("should return the result of the pre-processor with options", () => {
    const processor: PreProcessor<{ result: string }, { char: string }> = (data, options) => {
      if (typeof data === "string") {
        return { result: data + (options?.char || "") };
      }
      return { result: `${data.result}${options?.char || ""}` };
    };
    expect(preProcess("A", [[processor]])).toEqual({ result: "A" });
    expect(preProcess("A", [[processor, { char: "a" }]])).toEqual({ result: "Aa" });
    expect(
      preProcess("A", [
        [processor, { char: "a" }],
        [processor, { char: "b" }],
      ]),
    ).toEqual({ result: "Aab" });
  });
});

describe("`postProcess` function", () => {
  it("should return the result of the post-processor", () => {
    const processor: PostProcessor = (content) => {
      return `${content}A`;
    };
    expect(postProcess("A", [processor], {})).toEqual("AA");
    expect(postProcess("A", [processor, processor], {})).toEqual("AAA");
    expect(postProcess("A", [processor, processor, processor], {})).toEqual("AAAA");
  });

  it("should return the result of the post-processor with options", () => {
    const processor: PostProcessor<any, { char: string }> = (content, _, options) => {
      return `${content}${options?.char || ""}`;
    };
    expect(postProcess("A", [[processor]], {})).toEqual("A");
    expect(postProcess("A", [[processor, { char: "B" }]], {})).toEqual("AB");
    expect(
      postProcess(
        "A",
        [
          [processor, { char: "B" }],
          [processor, { char: "B" }],
        ],
        {},
      ),
    ).toEqual("ABB");
  });
});
