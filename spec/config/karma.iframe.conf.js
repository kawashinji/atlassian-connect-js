var envify = require('envify/custom');
var webpack = require('webpack');

module.exports = function(config) {
  var baseConfig = require('./karma.base.conf.js')(config);

  baseConfig.files.push('test/plugin/**/*.js');
  baseConfig.exclude = [
    'test/host/**/*-test.js',
    'test/common/**/*-test.js'
  ];
  baseConfig.webpack.module.loaders.push({test: /(?:\/src\/plugin\/.*?\.js|\/src\/common\/.*?\.js|\/test\/.*?\.js)$/, loader: 'babel-loader?cacheDirectory'});
  baseConfig.webpack.plugins.push(new webpack.DefinePlugin({'process.env.ENV': '"plugin"'}));
  config.set(baseConfig);
};
