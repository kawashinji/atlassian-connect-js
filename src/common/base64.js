import base64 from 'Base64';

export default {
    encode: base64.btoa,
    decode: base64.atob
}
