var nightwatch = require('gulp-nightwatch');
var gutil = require('gulp-util');

module.exports = function (gulp) {
  return function() {
    return gulp.src('')
    .pipe(nightwatch({
      configFile: 'test/nightwatch.json'
    }))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('Tests failed.'), err.message);
      this.emit('end');
    });
  }
};
