import { toByteArray, fromByteArray } from 'base64-js';
import { TextEncoderLite, TextDecoderLite } from 'text-encoder-lite';

export function encode(string) {
  return fromByteArray(TextEncoderLite.prototype.encode(string));
}

export function decode(string) {
  var padding = 4 - string.length % 4;
  if (padding === 1) {
    string += '=';
  } else if (padding === 2) {
    string += '==';
  }
  return TextDecoderLite.prototype.decode(toByteArray(string));
}

export default {
  encode,
  decode
}
