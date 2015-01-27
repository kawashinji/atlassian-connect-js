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
                'touch .tmp/amd-stubs/connect-host.js',
                'touch .tmp/amd-stubs/connect-host-messages.js',
                'touch .tmp/amd-stubs/connect-host-env.js',
                'touch .tmp/amd-stubs/connect-host-request.js'
            ].join('&&')
        }
    };
};