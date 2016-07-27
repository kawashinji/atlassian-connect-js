import {toByteArray, fromByteArray} from 'base64-js';
import {TextEncoder, TextDecoder} from 'text-encoding-utf-8';

export default {
  encode: function (string) {
    return fromByteArray(TextEncoder('utf-8').encode(string));
  },
  decode: function (string) {
    var padding = 4 - string.length % 4;
    if (padding === 1) {
      string += '=';
    } else if (padding === 2) {
      string += '==';
    }
    return TextDecoder('utf-8').decode(toByteArray(string));
  }
};