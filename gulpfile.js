/* eslint-env node */
const fs = require('fs');
const gulp = require('gulp');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const merge = require('merge-stream');
const { argv } = require('yargs');
const rollup = require('rollup');
const { babel } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const builtins = require('rollup-plugin-node-builtins');
const replace = require('@rollup/plugin-replace');
const { visualizer } = require('rollup-plugin-visualizer');

const taskLint = require('./gulp-tasks/eslint');
const taskKarma = require('./gulp-tasks/karma');

const deployPath = argv.deployPath || '../atlassian-connect/jsapi-v5/src/main/resources/v5';

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
            'useBuiltIns': false,
            'debug': true
          }]
        ],
        babelHelpers: 'runtime'
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
        preventAssignment: true,
        GULP_INJECT_VERSION: JSON.parse(fs.readFileSync('package.json', 'utf8')).version
      }),
      // https://github.com/btd/rollup-plugin-visualizer#options
      visualizer({
        filename: `reports/stats-${distModule || 'default'}.html`,
        gzipSize: true,
        open: false
      })
    ]
  }).then(function (bundle) {
    return bundle.write({
      indent: true,
      format: options.format || 'umd',
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

gulp.task('watch', gulp.series(['plugin:watch', 'host:watch']));
gulp.task('build', gulp.series(['plugin:build', 'host:build']));

gulp.task('deploy', deploy);

gulp.task('default', gulp.series(['build', 'css:minify']));

gulp.task('lint', taskLint);
gulp.task('karma', taskKarma(false));
gulp.task('karma-ci', taskKarma(true));

gulp.task('test', gulp.series('lint', 'karma'));
gulp.task('test-ci', gulp.series('lint', 'karma-ci'));
