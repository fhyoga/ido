const config = require("./webpack.config");
const webpack = require("webpack");

webpack(config, (err, stats) => {
  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    }) + "\n\n",
  );
});
