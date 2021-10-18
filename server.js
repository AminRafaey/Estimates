var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
}).listen(1812, function (err, result) {
  if (err) {
    return console.log('Error has occured ...', err);
  }
  console.log('Listening at http://localhost:1812/');
});
