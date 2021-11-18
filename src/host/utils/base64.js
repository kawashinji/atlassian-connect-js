import { toByteArray, fromByteArray } from 'base64-js';

export function encode(string) {
  return fromByteArray(new TextEncoder().encode(string));
}

export function decode(string) {
  var padding = 4 - string.length % 4;
  if (padding === 1) {
    string += '=';
  } else if (padding === 2) {
    string += '==';
  }
  return new TextDecoder().decode(toByteArray(string));
}

export default {
  encode,
  decode
}
