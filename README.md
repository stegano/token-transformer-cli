# Token Transformer CLI
![NPM License](https://img.shields.io/npm/l/token-transformer-cli)
![NPM Downloads](https://img.shields.io/npm/dw/token-transformer-cli)

Token Transformer CLI: A versatile library that enables the transformation of token information into desired forms (e.g., converting design tokens into CSS, SCSS, and more).

## Installation

The easiest way to install [`token-transformer-cli`](https://www.npmjs.com/package/token-transformer-cli) is with [npm](https://www.npmjs.com/).

```bash
npm install token-transformer-cli token-transformer-presets -g
```

Alternately, download the source.

```bash
git clone https://github.com/stegano/token-transformer-cli.git
```

## Quick Starts

Get started quickly with [token-transformer-presets](https://www.npmjs.com/package/token-transformer-cli)

* **Convert Zeplin design token to a CSS file.**
  ```bash
  tt run -p token-transformer-presets/zeplin-css -t <tokenFilePath>
  ```

* **Convert Zeplin design token to a SCSS file.**
  ```bash
  tt run -p token-transformer-presets/zeplin-scss -t <tokenFilePath>
  ```

* **Parsing JWT tokens and displaying them on the screen.**
  ```bash
  tt run <token> -p token-transformer-presets/jwt-viewer # or `tt -p token-transformer-presets/jwt-viewer` -t <tokenFilePath>
  ```

### Quick Setting Example

This configuration sets Token Transformer CLI to run with `jwt-viewer` preset as the default.

* Create a dedicated CLI configuration file.
  ```bash
  cd ~ && tt init --cli 
  ```

* Save the `jwt-viewer` preset configuration.
  ```bash
  tt config set -n presets -v token-transformer-presets/jwt-viewer
  ```
* Runt Token Transformer CLI with `jwt-viewer`
  ```bash
  tt run "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
  ```
## Commands

You can run Token Transformer CLI via `tt` or `tt-cli` command. To see the commands and options, run the following command line.

```bash
tt --help
```

## Advanced
### Configuration

If you want to use a complex transformation process, it is recommended to configure the configuration file.

#### Create a `tt.config.js` or `tt.config.json` file.

Create a default Token Transformer CLI configuration file(`tt.config.js` or `tt.config.json`)

Please refer to the [Config](./src/config/config.interface.ts) interface

```bash
tt init # or tt init --cli
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