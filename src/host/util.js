import _ from './underscore';
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

  if(_.isString(value)) {
    percent = value.indexOf('%') === value.length - 1;
    value = Math.ceil(parseFloat(value));
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