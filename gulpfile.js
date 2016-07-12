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
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var merge = require('merge-stream');
var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var injectVersion = require('gulp-inject-version');
var deployPath = argv.deployPath || '../atlassian-connect/jsapi/src/main/resources';

function getTask(task) {
  return require('./gulp-tasks/' + task)(gulp);
}

function build(entryModule, distModule, options) {
  var bundler = browserify(entryModule, {
    paths: ['src/host'],
    standalone: options.standalone || distModule
  }).transform(babelify, {presets: ['es2015', 'stage-2']})
      .transform(envify(options.env || {}))
      .transform(unreachableBranch);

  function rebundle() {
    return bundler.bundle()
            .on('error', function (err) {
              gutil.log(gutil.colors.red('Browserify error'), err.message);
              this.emit('end');
            })
            .pipe(source(distModule + '.js'))
            .pipe(buffer())
            .pipe(derequire())
            .pipe(injectVersion())
            .pipe(gulp.dest('./dist'));
  }

  if (options.watch) {
    bundler = watchify(bundler);

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
  return build('./src/plugin/index.js', 'iframe', {
    standalone: 'AP',
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

function buildCss(options) {
  options = options || {};
  options.dest = options.dest || 'dist';

  var g = gulp.src('src/css/host/**/*.css')
    .pipe(concat('connect-host.css'))
    .pipe(gulp.dest(options.dest));

  if(options.minify){
    g.pipe(concat('connect-host.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(options.dest));
  }
  return g;
}

function deploy() {
  return merge(
    gulp.src('./dist/**/*.js')
      .pipe(gulp.dest(`${deployPath}/js/core`)),
    gulp.src('dist/**/*.css')
      .pipe(gulp.dest(`${deployPath}/css/core`))
  );
}

gulp.task('plugin:build', buildPlugin);
gulp.task('plugin:watch', buildPlugin.bind(null, {watch: true}));

gulp.task('host:build', buildHost);
gulp.task('host:watch', buildHost.bind(null, {watch: true}));

gulp.task('css:build', buildCss);
gulp.task('css:minify', buildCss.bind(null, {minify: true}));

gulp.task('watch', ['plugin:watch', 'host:watch']);
gulp.task('build', ['plugin:build', 'host:build']);

gulp.task('deploy', deploy);

gulp.task('default', ['build', 'css:minify']);

gulp.task('lint', getTask('eslint'));
gulp.task('karma', getTask('karma'));
gulp.task('karma-ci', getTask('karma-ci'));

gulp.task('test', function(done) {
  runSequence('lint', 'karma', done);
});

gulp.task('test-ci', function(done) {
  runSequence('lint', 'karma-ci', done);
});
