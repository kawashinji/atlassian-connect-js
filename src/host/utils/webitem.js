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

module.exports = {
  sanitizeTriggers,
  uniqueId
};