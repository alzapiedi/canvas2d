module.exports = {
  entry: './src/index.js',
  output: {
    filename: './app.js'
  },
  devtool: 'source-map',
  resolve: {
    modules: ['./', 'node_modules']
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};
