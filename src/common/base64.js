import base64 from 'base-64';
import utf8 from 'utf8';

export default {
  encode: function (string) {
    return base64.encode(utf8.encode(string));
  },
  decode: function (string) {
    return utf8.decode(base64.decode(string));
  }
};