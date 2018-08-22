import Util from '../util';

function sanitizeTriggers(triggers) {
  var onTriggers;
  if(Array.isArray(triggers)) {
    onTriggers = triggers.join(' ');
  } else if (typeof triggers === 'string') {
    onTriggers = triggers.trim();
  }
  return onTriggers;
}

function uniqueId(){
  return 'webitem-' + Math.floor(Math.random() * 1000000000).toString(16);
}

// LEGACY: get addon key by webitem for p2
function getExtensionKey($target){
  var cssClass = $target.attr('class');
  var m = cssClass ? cssClass.match(/ap-plugin-key-([^\s]*)/) : null;
  return Array.isArray(m) ? m[1] : false;
}

// LEGACY: get module key by webitem for p2
function getKey($target){
  var cssClass = $target.attr('class');
  var m = cssClass ? cssClass.match(/ap-module-key-([^\s]*)/) : null;
  return Array.isArray(m) ? m[1] : false;
}

function getTargetKey($target){
  var cssClass = $target.attr('class');
  var m = cssClass ? cssClass.match(/ap-target-key-([^\s]*)/) : null;
  return Array.isArray(m) ? m[1] : false;
}

function getFullKey($target){
  return getExtensionKey($target) + '__' + getKey($target);
}

function getModuleOptionsByAddonAndModuleKey(type, addonKey, moduleKey) {
  var moduleType = type + 'Modules';
  if(window._AP
    && window._AP[moduleType]
    && window._AP[moduleType][addonKey]
    && window._AP[moduleType][addonKey][moduleKey]) {
    return Util.extend({}, window._AP[moduleType][addonKey][moduleKey].options);
  }
}

function getModuleOptionsForWebitem(type, $target){
  var addon_key = getExtensionKey($target);
  var targetKey = getTargetKey($target);
  return getModuleOptionsByAddonAndModuleKey(type, addon_key, targetKey);
}

//gets the connect config from the encoded webitem target (via the url)
function getConfigFromTarget($target){
  var url = $target.attr('href');
  var convertedOptions = {};
  // adg3 has classes outside of a tag so look for href inside the a
  if (!url) {
    url = $target.find('a').attr('href');
  }
  if (url) {
    var hashIndex = url.indexOf('#');
    if (hashIndex >= 0) {
      var hash = url.substring(hashIndex + 1);
      var iframeData;
      try {
        iframeData = JSON.parse(decodeURI(hash));
      } catch (e) {
        console.error('ACJS: cannot decode webitem anchor');
      }
      if (iframeData && window._AP && window._AP._convertConnectOptions) {
        convertedOptions = window._AP._convertConnectOptions(iframeData);
      } else {
        console.error('ACJS: cannot convert webitem url to connect iframe options');
      }
    } else {
      // The URL has no hash component so leave convertedOptions as {}. This may be the case
      // for web items that were persisted prior to the new storage format whereby a hash
      // fragment is added into the URL detailing the target module info. If this info is
      // not present, the content resolver will be used to resolve the module after the web
      // item is clicked.
    }
  }
  return convertedOptions;
}

// LEGACY - method for handling webitem options for p2
function getOptionsForWebItem($target) {
  var fullKey = getFullKey($target);

  var type = $target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
  var options = getModuleOptionsForWebitem(type, $target);
  if(!options && window._AP && window._AP[type + 'Options']) {
    options = Util.extend({}, window._AP[type + 'Options'][fullKey]) || {};
  }
  if(!options){
    options = {};
    console.warn('no webitem ' + type + 'Options for ' + fullKey);
  }
  options.productContext = options.productContext || {};
  options.structuredContext = options.structuredContext || {};
  // create product context from url params

  var convertedConfig = getConfigFromTarget($target);

  if(convertedConfig && convertedConfig.options) {
    Util.extend(options.productContext, convertedConfig.options.productContext);
    Util.extend(options.structuredContext, convertedConfig.options.structuredContext);
    options.contextJwt = convertedConfig.options.contextJwt;
  }

  return options;
}

export default {
  sanitizeTriggers,
  uniqueId,
  getExtensionKey,
  getKey,
  getOptionsForWebItem,
  getModuleOptionsByAddonAndModuleKey,
  getConfigFromTarget
};