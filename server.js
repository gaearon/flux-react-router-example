var path = require('path'),
    request = require('request'),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    config = require('./webpack.config');

var server = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true
});

server.listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3000');
});

// FIXME: this is not how you're supposed to do it:

server.app.use(function pushStateHook(req, res, next) {
  var ext = path.extname(req.url);
  if ((ext === '' || ext === '.html') && req.url !== '/') {
    req.pipe(request('http://localhost:3000')).pipe(res);
  } else {
    next();
  }
});
