import {toByteArray, fromByteArray} from 'base64-js';
import {TextEncoderLite, TextDecoderLite} from 'text-encoder-lite-module';

export default {
  encode: function (string) {
    return fromByteArray(TextEncoderLite.prototype.encode(string));
  },
  decode: function (string) {
    var padding = 4 - string.length % 4;
    if (padding === 1) {
      string += '=';
    } else if (padding === 2) {
      string += '==';
    }
    return TextDecoderLite.prototype.decode(toByteArray(string));
  }
};