// Imports: Dependencies
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
require('babel-register');
// Webpack Configuration
const config = {
  // Entry
  entry: ['@babel/polyfill', './src/index.js'],

  // Output
  output: {
    path: path.resolve(__dirname, './src/dist'),
    filename: 'bundle.js',
  },

  // Loaders
  module: {
    rules: [
      // JavaScript/JSX Files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
        resolve: {
          extensions: ['.js'],
        },
      },
      // CSS Files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },

      // SCSS Files
      {
        test: /\.sass$/,
        use: ['style-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf)(\?[a-z0-9=.]+)?$/,
        use: ['url-loader'],
      },
    ],
  },

  // Plugins
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      hash: true,
    }),
  ],

  // Reload On File Change
  watch: true,

  // Development Tools (Map Errors To Source File)
  devtool: 'source-map',

  mode: 'development',
};
// Exports
module.exports = config;
