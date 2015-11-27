module.exports = function (grunt) {
    // Overwrite the target files that are run by the lint command so that
    // it only checks the file that was modified.
    grunt.event.on('watch', function(action, filepath) {
        grunt.config('jscs.all', filepath);
        grunt.config('jshint.all', filepath);
    });

    if (grunt.option('deployPath')) {
        // Deploy, and *only* deploy, on watch if the command-line param is set.
        return {
            deploy: {
                tasks: [
                    'build-and-deploy'
                ],
                files: [
                    'src/**'
                ]
            }
        };
    }

    return {
        lint: {
            files: [
                'Gruntfile.js',
                'src/js/{*,**/*}.js',
                'tests/js/{*,**/*}.js'
            ],
            options: {
                spawn: false
            },
            tasks: [
                'lint'
            ]
        },
        compile: {
            tasks: [
                'build-js'
            ],
            files: [
                'src/**'
            ]
        },
        test: {
            files: [
                'src/**',
                'tests/unit/**'
            ],
            tasks: [
                'karma:host',
                'karma:plugin'
            ],
            options: {
                atBegin: true
            }
        }
    };
};