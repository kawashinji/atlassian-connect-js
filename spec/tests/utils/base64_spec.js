import Base64 from 'src/host/utils/base64';

describe('base64 util', () => {
  describe('encode', () => {
    it('encodes given string', () => {
      const testString = 'somestring'
      expect(Base64.encode(testString)).not.toEqual(testString);
    })
  });

  describe('decode', () => {
    it('decodes encoded string', () => {
      const testString = 'somestring'
      const encoded = Base64.encode(testString);
      expect(Base64.encode(testString)).not.toEqual(testString);
      expect(Base64.decode(encoded)).toEqual(testString);
    });
  });
});