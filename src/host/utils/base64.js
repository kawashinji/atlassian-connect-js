import { toByteArray, fromByteArray } from 'base64-js';
import { TextEncoderLite, TextDecoderLite } from 'text-encoder-lite';
import { Flags } from './feature-flag';

export function encode(string) {
  return fromByteArray(
    Flags.isFeatureFlagNativeTextEncoder()
      ? new TextEncoder().encode(string)
      : TextEncoderLite.prototype.encode(string)
  );
}

export function decode(string) {
  var padding = 4 - string.length % 4;
  if (padding === 1) {
    string += '=';
  } else if (padding === 2) {
    string += '==';
  }
  return Flags.isFeatureFlagNativeTextEncoder()
    ? new TextDecoder().decode(toByteArray(string))
    : TextDecoderLite.prototype.decode(toByteArray(string));
}

export default {
  encode,
  decode
}
