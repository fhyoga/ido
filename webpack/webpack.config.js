const path = require("path");
module.exports = {
  mode: "production",
  entry: {
    index: "./src/entry/index.js",
    index1: "./src/entry/index1.js",
    index2: "./src/entry/index2.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  optimization: {
    minimize: true,
    splitChunks: { chunks: "all", minSize: 1 },
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      //   {
      //     include: path.resolve("src/lib", "utils1"),
      //     sideEffects: false,
      //   },
    ],
  },
  watch: true,
};
