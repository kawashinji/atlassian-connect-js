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
var minifyCSS = require('gulp-minify-css');
var eslint = require('gulp-eslint');
var clean = require('gulp-clean');

function getTask(task) {
  return require('./gulp-tasks/' + task)(gulp);
}

function build(entryModule, distModule, options) {
  var bundler = browserify(entryModule, {
    debug: true,
    paths: ['src/host'],
    standalone: options.standalone || distModule
  }).transform(babelify)
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
            .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(derequire())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(options.dest || './dist'));
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
  return build('./src/plugin/index.js', 'plugin', {
    standalone: 'AP',
    env: {ENV: 'plugin'},
    watch: options.watch
  });
}

function buildHost(options) {
  options = options || {};
  return build('./src/host/index.js', 'connect-host', {
    env: {ENV: 'host'},
    watch: options.watch,
    dest: options.dest
  });
}

function buildCss(options) {
  options = options || {};
  options.dest = options.dest || 'dist';

  var g = gulp.src('src/css/**/*.css')
    .pipe(concat('connect-host.css'))
    .pipe(gulp.dest(options.dest));

  if(options.minify){
    g.pipe(concat('connect-host.min.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(options.dest));
  }
  return g;
}

function lintJS() {
  return gulp.src('**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
}

function testSetup() {
  buildHost({dest: './test/app/dist'});
  buildCss({dest: './test/app/dist'});
  return gulp
    .src('./node_modules/simple-xdm/dist/iframe.js')
    .pipe(gulp.dest('test/app/dist'));
}

function testClean() {
  return gulp.src('./test/app/dist', {read: false})
    .pipe(clean());
}

gulp.task('plugin:build', buildPlugin);
gulp.task('plugin:watch', buildPlugin.bind(null, {watch: true}));

gulp.task('host:build', buildHost);
gulp.task('host:watch', buildHost.bind(null, {watch: true}));

gulp.task('css:build', buildCss);
gulp.task('css:minify', buildCss.bind(null, {minify: true}));

gulp.task('lint', lintJS);

gulp.task('watch', ['host:watch']);
gulp.task('build', ['lint', /*'plugin:build',*/ 'host:build']);

gulp.task('default', ['build', 'css:minify']);

gulp.task('karma', getTask('karma'));
gulp.task('karma-ci', getTask('karma-ci'));

gulp.task('test:setup', testSetup);
gulp.task('test:clean', ['test:setup', 'server:stop'] ,testClean);

gulp.task('server:start', ['test:setup'], getTask('test-server').start);
gulp.task('server:stop', ['server:start', 'nightwatch'], getTask('test-server').stop);

gulp.task('nightwatch', ['test:setup', 'server:start'], getTask('nightwatch'));

gulp.task('test:integration', ['nightwatch', 'server:stop', 'test:clean']);
