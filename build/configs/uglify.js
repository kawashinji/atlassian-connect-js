module.exports = {

    uglify: {
        options: {
            beautify: {
                ascii_only: true,
                quote_keys: true
            }
        },
        files: {
            '.tmp/host.js': '<%= paths.tmp %>' + 'host-debug.js',
            '.tmp/all.js': '<%= paths.tmp %>' + 'all-debug.js',
        }
    }
};