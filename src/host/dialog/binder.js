import content from '../content';
import dialog from './api';
import dialogFactory from './factory';
import $ from '../dollar';

export default function () {
  var action = 'click';
  var selector = '.ap-dialog';

  function callback(href, options) {
    var webItemOptions = content.getOptionsForWebItem(options.bindTo);
    var moduleKey = content.getWebItemModuleKey(options.bindTo);
    var addonKey = content.getWebItemPluginKey(options.bindTo);

    $.extend(options, webItemOptions);

    if (!options.ns) {
      options.ns = moduleKey;
    }

    if (!options.container) {
      options.container = options.ns;
    }

    // webitem target options can sometimes be sent as strings.
    if (typeof options.chrome === 'string') {
      options.chrome = (options.chrome.toLowerCase() === 'false') ? false : true;
    }

    //default chrome to be true for backwards compatibility with webitems
    if (options.chrome === undefined) {
      options.chrome = true;
    }

    dialogFactory({
      key: addonKey,
      moduleKey: moduleKey
    }, options, options.productContext);
  }

  content.eventHandler(action, selector, callback);
}