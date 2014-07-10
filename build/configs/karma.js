module.exports = {
    options: {
        singleRun: true
    },
    host: {
        configFile: 'karma.conf.js'
    },
    plugin: {
        configFile: 'karma.iframe.conf.js'
    }
};