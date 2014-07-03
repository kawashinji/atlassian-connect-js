var helper = require('./bin-helper');

helper.chain([
    [helper.npmNormalize('./node_modules/.bin/bower'), ['install']]
]);