var envify = require('envify/custom');
var webpack = require('webpack');
var path = require('path');
var fs = require('graceful-fs');
var cwd = process.cwd();
var getDirs = (srcpath) => fs.readdirSync(srcpath).filter((file) => fs.statSync(path.join(srcpath, file)).isDirectory());
var base = cwd + '/src/host';


module.exports = function(config) {
  var baseConfig = require('./karma.base.conf.js')(config);

  baseConfig.files = [
    'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore.js',
    'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js',
    'https://aui-cdn.atlassian.com/aui-adg/5.9.17/js/aui.js',
    'https://aui-cdn.atlassian.com/aui-adg/5.9.17/css/aui.min.css',
    'https://aui-cdn.atlassian.com/aui-adg/5.9.17/js/aui-experimental.js',
    'dist/connect-host.js',
    'spec/fixtures/docohelper.js',
    {pattern: 'dist/iframe-compat.js', included: false},
    {pattern: 'node_modules/simple-xdm/dist/iframe.js', included: false},
    {pattern: 'spec/fixtures/iframe.html', included: false},
    'spec/exampletests/*.js'];

  // baseConfig.webpack.module.loaders.push({test: /(?:\/spec\/exampletests\/.*?\.js)$/, loader: 'babel-loader?cacheDirectory'});
  // baseConfig.webpack.plugins.push(new webpack.DefinePlugin({'process.env.ENV': '"host"'}));

  // getDirs(base).forEach((root) => baseConfig.webpack.resolve.alias[root] = `${base}/${root}`);
  config.set(baseConfig);
};
