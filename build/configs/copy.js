module.exports = {
    dist: {
        files: [{
            cwd: '<%= paths.tmp %>',
            dest:  '<%= paths.dist %>',
            expand: true,
            filter: 'isFile',
            src: ['**']
        }]
    }
};