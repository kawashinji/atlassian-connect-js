import Base64 from 'src/host/utils/base64';

describe('base64 util', () => {
  const testString = 'somestring';
  const testStringEncoded = 'c29tZXN0cmluZw==';

  describe('encode', () => {
    it('encodes given string', () => {
      expect(Base64.encode(testString)).toEqual(testStringEncoded);
    })
  });

  describe('decode', () => {
    it('decodes encoded string', () => {
      const encoded = Base64.encode(testString);
      expect(encoded).toEqual(testStringEncoded);
      expect(Base64.decode(encoded)).toEqual(testString);
    });
  });
});