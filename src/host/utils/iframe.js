import util from '../util';

export default {
  optionsToAttributes: function(options){
    var sanitized = {};
    if(options && typeof options ==='object'){
      if(options.width){
        sanitized.width = util.stringToDimension(options.width);
      }
      if(options.height){
        sanitized.height = util.stringToDimension(options.height);
      }
      if (typeof options.sandbox === 'string'){
        var domElem = document.createElement('iframe');
        sanitized.sandbox = options.sandbox
          .split(' ')
          .filter(value => util.isSupported(domElem, 'sandbox', value, true))
          .join(' ');
      }
    }
    return sanitized;
  }
};
