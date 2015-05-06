import $ from './dollar';
import XdmRpc from '../common/xdm-rpc';

/**
* Allows add-ons to store, retrieve and erased cookies against the host JIRA / Confluence. These cannot be seen by other add-ons.
* @exports cookie
*/

var exp;

rpc.extend(function (remote) {
    exp = {

        /**
        * Save a cookie.
        * @param name {String} name of cookie
        * @param value {String} value of cookie
        * @param expires {Number} number of days before cookie expires
        * @example
        * AP.require("cookie", function(cookie){
        *   cookie.save('my_cookie', 'my value', 1);
        * });
        */
        save:function(name, value, expires){
            remote.saveCookie(name, value, expires);
        },

        /**
        * Get the value of a cookie.
        * @param name {String} name of cookie to read
        * @param callback {Function} callback to pass cookie data
        * @example
        * AP.require("cookie", function(cookie){
        *   cookie.save('my_cookie', 'my value', 1);
        *   cookie.read('my_cookie', function(value) { alert(value); });
        * });
        */
        read:function(name, callback){
            remote.readCookie(name, callback);
        },

        /**
        * Remove the given cookie.
        * @param name {String} the name of the cookie to remove
        * @example
        * AP.require("cookie", function(cookie){
        *   cookie.save('my_cookie', 'my value', 1);
        *   cookie.read('my_cookie', function(value) { alert(value); });
        *   cookie.erase('my_cookie');
        * });
        */
        erase:function(name){
            remote.eraseCookie(name);
        }
    };
    return {
        stubs: ['saveCookie', 'readCookie', 'eraseCookie']
    };
});

export default exp;

