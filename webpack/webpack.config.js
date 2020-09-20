const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  mode: 'production',
  entry: {
    index: './src/entry/index.js',
    // index1: "./src/entry/index1.js",
    // index2: "./src/entry/index2.js",
    // async: "./src/entry/async.js",
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: 'dist/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  optimization: {
    minimize: true,
    // splitChunks: { chunks: 'all', minSize: 1 },
  },
  plugins: [new BundleAnalyzerPlugin()],
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-syntax-dynamic-import'],
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
}
