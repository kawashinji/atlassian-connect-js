import _ from './underscore';
import $ from './dollar';

function escapeSelector(s) {
  if (!s) {
    throw new Error('No selector to escape');
  }
  return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

function stringToDimension(value, precision) {
  var percent = false;
  var unit = 'px';

  if(_.isString(value)) {
    percent = value.indexOf('%') === value.length - 1;
    value = parseFloat(value);
    // if not a whole number, use precision
    if((value % 1 !== 0) && precision) {
      value = value.toFixed(precision);
    }

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

export default {
  escapeSelector,
  stringToDimension,
  getIframeByExtensionId
};