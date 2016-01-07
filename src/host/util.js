import _ from './underscore';

function escapeSelector(s) {
  if (!s) {
    throw new Error('No selector to escape');
  }
  return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

function stringToDimension(value) {
  var percent = false,
    unit = 'px';  

  if(_.isString(value)) {
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
  return $("iframe#" + id);
}

export default {
  escapeSelector,
  stringToDimension,
  getIframeByExtensionId
};