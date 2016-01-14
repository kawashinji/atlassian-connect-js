import _ from '../underscore';

function sanitizeTriggers(triggers) {
  var onTriggers;
  if(_.isArray(triggers)) {
    onTriggers = triggers.join(" ");
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

// LEGACY - method for handling webitem options for p2
function getOptionsForWebItem($target) {
  var moduleKey = getKey($target);
  var type = $target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
  return window._AP[type + 'Options'][moduleKey] || {};
}


module.exports = {
  sanitizeTriggers,
  uniqueId,
  getExtensionKey,
  getKey,
  getOptionsForWebItem
};