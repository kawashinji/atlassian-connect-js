import Cookie from 'src/host/utils/cookie';

describe('cookie util', () => {
  describe('prefixCookie', () => {
    it('returns expected result', () => {
      const addonKey = 'someAddonKey';
      const name = 'cookieName';
      expect(Cookie.prefixCookie(addonKey, name)).toEqual(`${addonKey}$$${name}`);
    });

    it('throws an error if addonKey is missing', () => {
      expect(() => Cookie.prefixCookie(null, 'name')).toThrow(new Error('addon key must be defined on cookies'));
    });

    it('throws an error if name is missing', () => {
      expect(() => Cookie.prefixCookie('key', null)).toThrow(new Error('Name must be defined'));
    });
  });
});