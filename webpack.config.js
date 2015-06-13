module.exports = {
  entry: "./example/main.js",
  output: {
    library: 'ReactSelectBox',
    libraryTarget: 'umd'
  },

  externals: {
    react: 'React',
    'react/addons': 'React'
  },
  debug: true,
  devtool: '#source-map',
  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader'}
    ]
  }
};
