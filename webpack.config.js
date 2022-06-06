const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = () => {
  return {
    entry: {
      demo: "./demo/index.js"
    },
    output: {
      path: path.resolve(__dirname + "/build"),
      filename: "[name].js",
      libraryTarget: "umd",
      globalObject: "this"
    },
    devServer: {
      stats: "minimal",
      inline: false
    },
    mode: "development",
    module: {
      rules: [
        {
          test: require.resolve("react"),
          loader: "expose-loader?React"
        },
        {
          test: require.resolve("react-dom"),
          loader: "expose-loader?ReactDOM"
        },
        {
          test: require.resolve("react-dom/server"),
          loader: "expose-loader?ReactDOMServer"
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ["babel-loader", "eslint-loader"]
        },
        {
          test: /\.css/,
          exclude: /node_modules/,
          loaders: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 1
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [".js", ".jsx"]
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: "[name].[chunkhash].css" }),
      new HtmlWebpackPlugin({
        template: "demo/index.html"
      })
    ]
  };
};
