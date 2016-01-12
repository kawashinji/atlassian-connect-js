var envify = require('envify/custom'),
    webpack = require('webpack');

module.exports = function(config) {
  var baseConfig = require('./karma.base.conf.js')(config);

  baseConfig.files.push('spec/tests/**/*.js');
  // baseConfig.files.push('test/common/**/*.js');

  baseConfig.exclude = [
    'test/plugin/*-test.js',
    'test/plugin/*Test.js'
  ];
  baseConfig.webpack.module.loaders.push({test: /(?:\/src\/host\/.*?\.js|\/spec\/tests\/.*?\.js)$/, loader: "babel-loader?cacheDirectory"});
  baseConfig.webpack.plugins.push(new webpack.DefinePlugin({'process.env.ENV': '"host"'}));
  config.set(baseConfig);
};
