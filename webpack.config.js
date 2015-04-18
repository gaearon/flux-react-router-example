/*eslint-disable no-var*/
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './scripts/index'
  ],
  devtool: 'inline-source-map',
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/scripts/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: [ '', '.js' ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'react-hot', 'babel-loader' ],
        exclude: /node_modules/
      }
    ]
  }
};
