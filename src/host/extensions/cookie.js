import $ from '../dollar';
import CookieUtils from '../utils/cookie';
import util from '../util';

function prefixCookieFromCallback(callback, name) {
  return CookieUtils.prefixCookie(callback._context.extension.addon_key, name);
}

export default {
  erase: function (name, callback) {
    var prefixedCookieName = prefixCookieFromCallback(callback, name);
    AJS.Cookie.erase(prefixedCookieName);
  },
  read: function (name, callback) {
    var prefixedCookieName = prefixCookieFromCallback(callback, name);
    var value = AJS.Cookie.read(prefixedCookieName);
    callback(value);
  },
  save: function (name, value, expires, callback) {
    var prefixedCookieName = prefixCookieFromCallback(callback, name);
    AJS.Cookie.save(prefixedCookieName, value, expires);
  }

};