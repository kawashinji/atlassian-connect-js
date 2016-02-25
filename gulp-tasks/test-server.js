var connect = require('gulp-connect');

module.exports = function (gulp) {
  return {
    start: function() {
      return connect.server({
        root: './test/app'
      });
    },
    stop: function() {
      return connect.serverClose();
    }
  }
}
