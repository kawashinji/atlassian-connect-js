var helper = require('./bin-helper');

helper.chain([
    [helper.npmNormalize('./node_modules/.bin/bower'), ['install']],
    [helper.npmNormalize('./node_modules/grunt-cli/bin/grunt'),
        ['--gruntfile', helper.npmNormalize('./Gruntfile.js'), 'build']
    ]

]);