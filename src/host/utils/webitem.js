import _ from '../underscore';

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
// ap-target-key is a dialog module thing
function getKey($target){
  var cssClass = $target.attr('class');
  var m = cssClass ? cssClass.match(/ap-target-key-([^\s]*)/) : null;
  if(!_.isArray(m)){
    m = cssClass ? cssClass.match(/ap-module-key-([^\s]*)/) : null;
  }
  return _.isArray(m) ? m[1] : false;
}

function getFullKey($target){
  return getExtensionKey($target) + '__' + getKey($target);
}

function getModuleOptionsForWebitem(type, $target){
  var addon_key = getExtensionKey($target);
  var key = getKey($target);
  var moduleType = type + 'Modules';
  if(window._AP
    && window._AP[moduleType]
    && window._AP[moduleType][addon_key]
    && window._AP[moduleType][addon_key][key])
  {
    return window._AP[moduleType][addon_key][key].options;
  }
}

// LEGACY - method for handling webitem options for p2
function getOptionsForWebItem($target) {
  var fullKey = getFullKey($target);
  var type = $target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
  var moduleOptions = getModuleOptionsForWebitem(type, $target);
  if(moduleOptions) {
    return moduleOptions;
  }else if(window._AP && window._AP[type + 'Options']){
    return window._AP[type + 'Options'][fullKey] || {};
  } else {
    console.warn('no webitem ' + type + 'Options for ' + fullKey);
  }
}

module.exports = {
  sanitizeTriggers,
  uniqueId,
  getExtensionKey,
  getKey,
  getOptionsForWebItem
};