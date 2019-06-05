/* eslint-env node */
var buffer = require('vinyl-buffer');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var merge = require('merge-stream');
var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var deployPath = argv.deployPath || '../atlassian-connect/jsapi-v5/src/main/resources/v5';
var rollup = require('rollup');
var babel = require('rollup-plugin-babel');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
var builtins = require('rollup-plugin-node-builtins');
var replace = require('rollup-plugin-replace');
var fs = require('fs');

function getTask(task) {
  return require('./gulp-tasks/' + task)(gulp);
}

function build(entryModule, distModule, options) {
  return rollup.rollup({
    input: entryModule,
    plugins: [
      babel({
        exclude: new RegExp('node_modules\/(promise\-polyfill|query\-string)'),
        plugins: [
          '@babel/plugin-transform-runtime',
         // Stage 2
          ['@babel/plugin-proposal-decorators', { 'legacy': true }]
        ],
        presets: [
          ['@babel/preset-env', {
            'targets': {
              'browsers': [
                'last 1 Chrome versions',
                'last 1 Firefox versions',
                'last 1 Safari versions',
                'Explorer 11',
                'last 1 Edge versions'
              ]
            },
            'modules': false,
            'useBuiltIns': false,
            'loose': true,
            'debug': true
          }]
        ],
        runtimeHelpers: true
      }),
      builtins(),
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true,
        preferBuiltins: false
      }),
      commonjs({
        // ignoreGlobal: true,
        include: 'node_modules/**'
      }),
      replace({
        delimiters: [ '%%', '%%' ],
        GULP_INJECT_VERSION: JSON.parse(fs.readFileSync('package.json', 'utf8')).version
      })
    ]
  }).then(function (bundle) {
    return bundle.write({
      indent: true,
      format: options.format || 'umd',
      moduleId: options.standalone || distModule,
      moduleName: options.standalone || distModule,
      name: options.standalone || distModule,
      file: './dist/' + distModule + '.js'
    });
  });
}

function buildPlugin() {
  return build('src/plugin/index.js', 'iframe', {
    standalone: 'AP',
    env: {ENV: 'plugin'},
    format: 'iife'
  });
}

function watchPlugin() {
  return watch('src/plugin/**/*.js', {
    name: 'Plugin watcher',
    ignoreInitial: false
  }, buildPlugin);
}

function buildHost() {
  return build('src/host/index.js', 'connect-host', {
    standalone: 'connectHost',
    env: {ENV: 'host'}
  });
}

function watchHost() {
  return watch('src/host/**/*.js', {
    name: 'Host watcher',
    ignoreInitial: false
  }, buildHost);
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
gulp.task('plugin:watch', watchPlugin);

gulp.task('host:build', buildHost);
gulp.task('host:watch', watchHost);

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
