import UrlUtils from 'src/host/utils/url';
import base64 from 'src/host/utils/base64';

describe('url utils', () => {
  describe('isJwtExpired', () => {
    it('returns true when jwt is expired', () => {
      const claim = {
        exp: Math.floor(Date.now() / 1000) - 60
      };
      const encodedClaim = base64.encode(JSON.stringify(claim));
      const url = `https://some.url.com?jwt=alsdjfaj123.${encodedClaim}.khsadlj234`;
      expect(UrlUtils.isJwtExpired(url)).toBe(true);
    });

    it('returns false when jwt is not expired', () => {
      const claim = {
        exp: Math.floor(Date.now() / 1000) + 70
      };
      const encodedClaim = base64.encode(JSON.stringify(claim));
      const url = `https://some.url.com?jwt=alsdjfaj123.${encodedClaim}.khsadlj234`;
      expect(UrlUtils.isJwtExpired(url)).toBe(false);
    });
  });

  describe('hasJwt', () => {
    it('returns false when jwt is not present in url', () => {
      const url = 'https://some.url.com';
      expect(!!UrlUtils.hasJwt(url)).toBe(false);
    });

    it('returns true when jwt is present in url', () => {
      const jwt = 'test.test.test';
      const url = `https://some.url.com?jwt=${jwt}`;
      expect(UrlUtils.hasJwt(url)).toBe(true);
    });
  });
});