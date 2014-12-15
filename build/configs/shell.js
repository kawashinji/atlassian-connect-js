module.exports = function () {
    'use strict';

    return {
        options: {
            stdout: true
        },
        amdStubs: {
            command: [
                'rm -rf .tmp/amd-stubs',
                'mkdir -p .tmp/amd-stubs',
                'touch .tmp/amd-stubs/connect-host.js'
            ].join('&&')
        }
    };
};