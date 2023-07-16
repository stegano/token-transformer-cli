/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  target: "node",
  entry: {
    cli: path.resolve(__dirname, "src", "cli", "index.ts"),
    transform: path.resolve(__dirname, "src", "transform", "index.ts"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build", "bin"),
    libraryTarget: "commonjs",
  },
  module: {
    rules: [
      {
        test: /token-transformer.config.js$/,
        use: "raw-loader",
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.build.json"),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: "#!/usr/bin/env node",
      raw: true,
      include: /cli\.js/,
    }),
  ],
};
