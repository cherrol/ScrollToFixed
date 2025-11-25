const rspack = require("@rspack/core");

// 基础配置
const baseConfig = {
  entry: {
    index: "./src/index.ts",
  },
  output: {
    path: __dirname + "/dist",
    clean: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
              },
            },
          },
        },
        type: "javascript/auto",
      },
      {
        test: /\.css$/,
        use: [
          rspack.CssExtractRspackPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: false,
            },
          },
        ],
        type: "javascript/auto",
      },
      {
        test: /\.scss$/,
        use: [
          rspack.CssExtractRspackPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: false,
            },
          },
          "sass-loader",
        ],
        type: "javascript/auto",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".scss"],
  },
  plugins: [new rspack.CssExtractRspackPlugin({})],
};

// 开发配置
const devConfig = {
  ...baseConfig,
  mode: "development",
  devtool: "source-map",
  output: {
    ...baseConfig.output,
    filename: "[name].js",
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
};

// 生产配置 - ESM 格式
const esmConfig = {
  ...baseConfig,
  mode: "production",
  devtool: false,
  output: {
    ...baseConfig.output,
    filename: "[name].js",
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
  optimization: {
    minimize: true,
    minimizer: [new rspack.SwcJsMinimizerRspackPlugin()],
  },
};

// 生产配置 - Browser 格式
const browserConfig = {
  ...baseConfig,
  mode: "production",
  devtool: false,
  output: {
    ...baseConfig.output,
    filename: "[name].browser.js",
    library: {
      name: "ScrollToFixed",
      type: "umd",
    },
    globalObject: "window",
  },
  optimization: {
    minimize: true,
    minimizer: [new rspack.SwcJsMinimizerRspackPlugin()],
  },
};

module.exports = (env, argv) => {
  return [esmConfig, browserConfig];
};
