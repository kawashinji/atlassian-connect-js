// LEGACY!
import $ from './dollar';
import uri from '../common/uri';

/**
 * Utility methods for rendering connect addons in AUI components
 */


function contextFromUrl(url) {
  var pairs = new uri.init(url).queryPairs;
  var obj = {};
  $.each(pairs, function (key, value) {
    obj[value[0]] = value[1];
  });
  return obj;
}

function eventHandler(action, selector, callback) {

  function domEventHandler(event) {
    event.preventDefault();
    var $el = $(event.target).closest(selector);
    var href = $el.attr('href');
    var url = new uri.init(href);
    var options = {
      bindTo: $el,
      header: $el.text(),
      width: url.getQueryParamValue('width'),
      height: url.getQueryParamValue('height'),
      cp: url.getQueryParamValue('cp'),
      key: getWebItemPluginKey($el),
      productContext: contextFromUrl(href)
    };
    callback(href, options, event.type);
  }

  $(window.document).on(action, selector, domEventHandler);

}

export default {
  eventHandler,
  getOptionsForWebItem,
  getWebItemPluginKey,
  getWebItemModuleKey
}