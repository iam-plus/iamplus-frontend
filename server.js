// Gets called when running npm start

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev.config');
var serverPort = 3003;

new WebpackDevServer(webpack(config), { // Start a server
  publicPath: config.output.publicPath,
  hot: true, // With hot reloading
  inline: false,
  disableHostCheck: true,
  historyApiFallback: true,
  quiet: false // Without logging
}).listen(serverPort, '0.0.0.0', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log(`Listening at localhost:${serverPort}`);
});