module.exports = function (gulp) {
  var filesToLint = [
    'gulpfile.js',
    'gulp-tasks/**/*.js',
    'src/**/*.js',
  ];

  return function () {
    var eslint = require('gulp-eslint');

    return gulp.src(filesToLint)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
  };
};