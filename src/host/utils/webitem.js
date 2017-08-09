import qs from 'query-string';
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
  // create product context from url params
  var url = $target.attr('href');

  if (!url) {
    url = $target.find("a").attr("href");
  }
  if (url) {
    var query = qs.parse(qs.extract(url));
    Util.extend(options.productContext, query);
  }

  return options;
}

export default {
  sanitizeTriggers,
  uniqueId,
  getExtensionKey,
  getKey,
  getOptionsForWebItem,
  getModuleOptionsByAddonAndModuleKey
};