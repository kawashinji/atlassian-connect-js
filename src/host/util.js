function escapeSelector(s) {
  if (!s) {
    throw new Error('No selector to escape');
  }
  return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

var defer = window.requestAnimationFrame || function (f) {
  setTimeout(f,10);
};

export default {escapeSelector, defer}