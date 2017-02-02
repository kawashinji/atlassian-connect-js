export default function (fn, wait) {
  var timeout;
  return function () {
    var ctx = this;
    var args = [].slice.call(arguments);
    function later() {
      timeout = null;
      fn.apply(ctx, args);
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait || 50);
  };
};