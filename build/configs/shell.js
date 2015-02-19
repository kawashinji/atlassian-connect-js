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
                'touch .tmp/amd-stubs/connect-host-amd.js',
                'touch .tmp/amd-stubs/connect-host-messages.js',
                'touch .tmp/amd-stubs/connect-host-env.js',
                'touch .tmp/amd-stubs/connect-host-cookie.js',
                'touch .tmp/amd-stubs/connect-host-history.js',
                'touch .tmp/amd-stubs/connect-host-request.js',
                'touch .tmp/amd-stubs/connect-host-inline-dialog.js',
                'touch .tmp/amd-stubs/connect-host-dialog.js'
            ].join('&&')
        }
    };
};