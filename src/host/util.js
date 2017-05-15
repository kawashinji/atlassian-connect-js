import $ from './dollar';

function escapeSelector(s) {
  if (!s) {
    throw new Error('No selector to escape');
  }
  return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

function stringToDimension(value) {
  var percent = false;
  var unit = 'px';

  if(typeof value === 'string') {
    percent = value.indexOf('%') === value.length - 1;
    value = parseInt(value, 10);
    if (percent) {
      unit = '%';
    }
  }

  if(!isNaN(value)) {
    return value + unit;
  }
}

function getIframeByExtensionId(id) {
  return $('iframe#' + escapeSelector(id));
}

function first(arr, numb){
  if(numb) {
    return arr.slice(0, numb);
  }
  return arr[0];
}

function last(arr){
  return arr[arr.length - 1];
}

function pick(obj, values) {
  if(typeof obj !== 'object') {
    return {};
  }
  return Object.keys(obj)
    .filter((key) => values.indexOf(key) >= 0)
    .reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
}

function debounce (fn, wait) {
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
}


export default {
  escapeSelector,
  stringToDimension,
  getIframeByExtensionId,
  first,
  last,
  pick,
  debounce
};