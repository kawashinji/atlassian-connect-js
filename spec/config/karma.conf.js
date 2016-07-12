var envify = require('envify/custom');
var webpack = require('webpack');
var path = require('path');
var fs = require('graceful-fs');
var cwd = process.cwd();
var getDirs = (srcpath) => fs.readdirSync(srcpath).filter((file) => fs.statSync(path.join(srcpath, file)).isDirectory());
var base = cwd + '/src/host';


module.exports = function(config) {
  var baseConfig = require('./karma.base.conf.js')(config);

  baseConfig.files.push('spec/tests/**/*.js');

  baseConfig.webpack.plugins.push(new webpack.DefinePlugin({'process.env.ENV': '"host"'}));

  getDirs(base).forEach((root) => baseConfig.webpack.resolve.alias[root] = `${base}/${root}`);

  config.set(baseConfig);
};
