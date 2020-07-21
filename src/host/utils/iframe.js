import util from '../util';
import getBooleanFeatureFlag from './feature-flag';

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
        if (getBooleanFeatureFlag('com.atlassian.connect.acjs-sandbox-attr-check')) {
          var domElem = document.createElement('iframe');
          sanitized.sandbox = options.sandbox
            .split(' ')
            .filter(value => util.isSupported(domElem, 'sandbox', value, true))
            .reduce((accumulator, currentValue) => accumulator + currentValue + ' ', '')
            .slice(0, -1);
        } else {
          sanitized.sandbox = options.sandbox;

          // No Firefox support: allow-top-navigation-by-user-activation
          // https://bugzilla.mozilla.org/show_bug.cgi?id=1359867
          if (window.navigator.userAgent.indexOf('Firefox') !== -1) {
            sanitized.sandbox = sanitized.sandbox.replace('allow-top-navigation-by-user-activation', 'allow-top-navigation');
          }
        }
      }
    }
    return sanitized;
  }
};
