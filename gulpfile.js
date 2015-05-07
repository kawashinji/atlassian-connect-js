var _ = require('lodash');
var babel = require('gulp-babel');
var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var derequire = require('gulp-derequire');
var envify = require('envify/custom');
var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var unreachableBranch = require('unreachable-branch-transform');
var watch = require('gulp-watch');
var watchify = require('watchify');


function build(entryModule, distModule, options) {
    var bundler = watchify(
        browserify(entryModule, {
            debug: true,
            standalone: distModule
        })
        .transform(babelify)
        .transform(envify(options.env || {}))
        .transform(unreachableBranch)
    );

    function rebundle() {
        return bundler.bundle()
            .on('error', function (err) {
                gutil.log(gutil.colors.red('Browserify error'), err.message);
                this.emit('end');
            })
            .pipe(source(distModule + '.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(derequire())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist'));
    }

    if (options.watch) {
        bundler.on('update', function () {
            gutil.log('Rebundling', gutil.colors.blue(entryModule));
            rebundle(bundler, options);
        });
    }

    gutil.log('Bundling', gutil.colors.blue(entryModule));
    return rebundle(bundler, options);
}

function buildPlugin(options) {
    options = options || {};
    return build('./src/plugin/index.js', 'plugin', {
        env: {ENV: 'plugin'},
        watch: options.watch
    });
}

function buildHost(options) {
    options = options || {};
    return build('./src/host/index.js', 'connect-host', {
        env: {ENV: 'host'},
        watch: options.watch
    });
}

function buildHostModule(options){
    options = options || {};
    return build('./src/host/' + module + '.js', 'connect-host-' + module, {
        env: {ENV: 'host'},
        watch: options.watch
    });
}

function buildHostModules(){
    return buildHostModule({module: 'messages'});
/*
        .pipe(buildHostModule('analytics'))
        .pipe(buildHostModule('cookie'))
        .pipe(buildHostModule('dialog'))
        .pipe(buildHostModule('history'))
        .pipe(buildHostModule('inline-dialog'));
*/
}

gulp.task('plugin:build', buildPlugin);
gulp.task('plugin:watch', buildPlugin.bind(null, {watch: true}));

gulp.task('host:build', buildHost);
gulp.task('host:watch', buildHost.bind(null, {watch: true}));

gulp.task('watch', ['plugin:watch', 'host:watch']);
gulp.task('build', ['plugin:build', 'host:build']);

gulp.task('default', ['build']);