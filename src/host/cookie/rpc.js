import api from './api';

export default function () {
  return {
    internals: {
      saveCookie(name, value, expires) {
        api.saveCookie(this.addonKey, name, value, expires);
      },

      readCookie(name, callback) {
        api.readCookie(this.addonKey, name, callback);
      },

      eraseCookie(name) {
        api.eraseCookie(this.addonKey, name);
      }
    }
  };
}
