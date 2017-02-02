import _ from './underscore';
import $ from './dollar';

function escapeSelector(s) {
  if (!s) {
    throw new Error('No selector to escape');
  }
  return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}

function escapeHtml (str) {
    return str.replace(/[&"'<>`]/g, function (str) {
        var special = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '\'': '&#39;',
            '`': '&#96;'
        };

        if (typeof special[str] === 'string') {
            return special[str];
        }

        return '&quot;';
    });
}


function stringToDimension(value) {
  var percent = false;
  var unit = 'px';

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
  return $('iframe#' + escapeSelector(id));
}

export default {
  escapeHtml,
  escapeSelector,
  stringToDimension,
  getIframeByExtensionId
};