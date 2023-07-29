# Token Transformer
![NPM License](https://img.shields.io/npm/l/@stegano/token-transformer)
![NPM Downloads](https://img.shields.io/npm/dw/@stegano/token-transformer)

Token Transformer: A versatile library that enables the transformation of token information into desired forms (e.g., converting design tokens into CSS, SCSS, and more).

## Installation

The easiest way to install [`@stegano/token-transformer`](https://npm.com/@stegano/token-transformer) is with [npm](https://www.npmjs.com/).

```bash
npm install @stegano/token-transformer token-transformer-presets -g
```

Alternately, download the source.

```bash
git clone https://github.com/stegano/token-transformer.git
```

## Quick Starts

Get started quickly with [token-transformer-presets](https://www.npmjs.com/package/@stegano/token-transformer)

* **Convert Zeplin design token to a CSS file.**
  ```bash
  tt -p token-transformer-presets/zeplin-css -t <tokenFilePath>
  ```

* **Convert Zeplin design token to a SCSS file.**
  ```bash
  tt -p token-transformer-presets/zeplin-scss -t <tokenFilePath>
  ```

* **Parsing JWT tokens and displaying them on the screen.**
  ```bash
  tt <token> -p token-transformer-presets/jwt-viewer # or `tt -p token-transformer-presets/jwt-viewer` -t <tokenFilePath>
  ```

## Commands

You can run Token Transformer via `tt` or `token-transformer` command. To see the commands and options, run the following command line.

```bash
tt --help
```

## Advanced
### Configuration

If you want to use a complex transformation process, it is recommended to configure the configuration file.

#### Create a `token-transformer.config.js` file.

Please refer to the [Config](./src/config/config.interface.ts) interface

```bash
# Create a default Token Transformer configuration file(`tokent-transformer.config.js`)
tt init 
```

### Customizing

You can create and use custom pre or post-processors and presets.

#### Pre-Processor

> The pre-processor converts the input token string into object form for use in the template.

The pre-processor accepts either a token string or an object as an argument and returns an object. The first pre-processor receives a token string as an argument, and subsequent preprocessors receive an object that is the return value of the previously executed pre-processor.


Below is an example of converting the input token to JSON.

```ts
const preProcessor = (data: string | object): object => {
  if(typeof data === "string") {
    return JSON.stringify(data);
  }
  return data;
}
```


#### Post-Processor

> The post-processor can reprocess the template string converted by Transformer.

The post-processor receives the template string as the first argument and the data object used when constructing the template as the second argument, reprocesses it, and returns a string. The first preprocessor receives the converted template string as its first argument, but subsequent postprocessors receive as its argument the string that is the return value of the previously executed post-processor.

Below is an example of removing consecutive spaces in a string.

```ts
const postProcessor = (template: string, data: Readonly<object>): string => {
  return template.replace(/\s{2,}/, " ");
}
```

#### Presets
Presets allow you to pre-configure a pre-processor post-processor and some settings. See [Preset](./src/transform/transform.interface.ts) Interface for details.