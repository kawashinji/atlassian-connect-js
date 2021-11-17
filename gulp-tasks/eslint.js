const gulp = require('gulp');
const eslint = require('gulp-eslint');

module.exports = function () {
  var filesToLint = [
    '**/*.js'
  ];

  return gulp.src(filesToLint)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
};