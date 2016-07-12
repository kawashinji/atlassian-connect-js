module.exports = function (gulp) {
  var filesToLint = [
    '**/*.js'
  ];

  return function () {
    var eslint = require('gulp-eslint');

    return gulp.src(filesToLint)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
  };
};