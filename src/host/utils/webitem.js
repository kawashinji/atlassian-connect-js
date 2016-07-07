import _ from '../underscore';
import jsuri from 'jsuri';

function sanitizeTriggers(triggers) {
  var onTriggers;
  if(_.isArray(triggers)) {
    onTriggers = triggers.join(' ');
  } else if (_.isString(triggers)) {
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
  return _.isArray(m) ? m[1] : false;
}

// LEGACY: get module key by webitem for p2
function getKey($target){
  var cssClass = $target.attr('class');
  var m = cssClass ? cssClass.match(/ap-module-key-([^\s]*)/) : null;
  return _.isArray(m) ? m[1] : false;
}

function getTargetKey($target){
  var cssClass = $target.attr('class');
  var m = cssClass ? cssClass.match(/ap-target-key-([^\s]*)/) : null;
  return _.isArray(m) ? m[1] : false;
}

function getFullKey($target){
  return getExtensionKey($target) + '__' + getKey($target);
}

function getModuleOptionsForWebitem(type, $target){
  var addon_key = getExtensionKey($target);
  var targetKey = getTargetKey($target);
  var moduleType = type + 'Modules';
  if(window._AP
    && window._AP[moduleType]
    && window._AP[moduleType][addon_key]
    && window._AP[moduleType][addon_key][targetKey]) {
    return window._AP[moduleType][addon_key][targetKey].options;
  }
}

// LEGACY - method for handling webitem options for p2
function getOptionsForWebItem($target) {
  var fullKey = getFullKey($target);

  var type = $target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
  var options = getModuleOptionsForWebitem(type, $target);
  if(!options && window._AP && window._AP[type + 'Options']) {
    options = window._AP[type + 'Options'][fullKey] || {};
  }
  if(!options){
    options = {};
    console.warn('no webitem ' + type + 'Options for ' + fullKey);
  }
  options.productContext = options.productContext || {};
  // create product context from url params
  new jsuri($target.attr('href')).queryPairs.forEach((param) => {
    options.productContext[param[0]] = param[1];
  });

  return options;
}

module.exports = {
  sanitizeTriggers,
  uniqueId,
  getExtensionKey,
  getKey,
  getOptionsForWebItem
};