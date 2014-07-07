//HACK FOR limitation in grunt-closure-compiler
var fs = require('fs'),
closureDir = 'bower_components/closure-compiler';

closureBuildDir = closureDir + '/build';
if(!fs.existsSync(closureBuildDir)){
    fs.mkdirSync(closureBuildDir);
    fs.writeFileSync(closureBuildDir + "/compiler.jar", fs.readFileSync(closureDir + "/compiler.jar"));
}

var globalOptions = {
    closurePath: closureDir,
    options: {
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        language_in: 'ECMASCRIPT5_STRICT',
        source_map_format: 'V3',
        //warning_level: "VERBOSE",
        define: [
            '"DEBUG=false"'
        ]
    }
};

module.exports = {
    host: {
        js: '<%= paths.tmp %>' + 'host-debug.js',
        jsOutputFile: '<%= paths.tmp %>' + 'host.js',
        options: {
            create_source_map: '<%= paths.tmp %>' + 'host.map'
        }

    },
    plugin: {
        js: '<%= paths.tmp %>' + 'all-debug.js',
        jsOutputFile: '<%= paths.tmp %>' + 'all.js',
        options: {
            create_source_map: '<%= paths.tmp %>' + 'all.map'
        }
    }
};

var extend = require('extend');

Object.keys(module.exports).forEach(function(val) {
    extend(true, module.exports[val], globalOptions);
});
