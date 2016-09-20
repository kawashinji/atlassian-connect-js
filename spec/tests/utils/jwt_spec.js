import jwtUtils from 'src/host/utils/jwt';
import base64 from 'src/host/utils/base64';

describe('jwt utils', () => {
  describe('parseJwtIssuer', () => {
    it('returns iss from claim', () => {
      const iss = 'jira:59975d67-4ca0-4e9e-9960-123412312';
      const claim = {
        iss: iss
      };
      const encodedClaim = base64.encode(JSON.stringify(claim));
      const jwt = `alsdjfaj123.${encodedClaim}.khsadlj234`;
      expect(jwtUtils.parseJwtIssuer(jwt)).toEqual(iss);
    })
  });

  describe('parseJwtClaims', () => {
    it('throws when jwt is empty of null', () => {
      expect(() => {
        jwtUtils.parseJwtClaims(null);
      }).toThrow();

      expect(() => {
        jwtUtils.parseJwtClaims('');
      }).toThrow();
    });

    it('throws when just does not contain 2 periods', () => {
      expect(() => {
        jwtUtils.parseJwtClaims('invalidjwt');
      }).toThrow();

      expect(() => {
        jwtUtils.parseJwtClaims('invalid.jwt');
      }).toThrow();
    });

    it('throws when encoded claims is empty or null', () => {
      expect(() => {
        jwtUtils.parseJwtClaims('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ');
      }).toThrow();
    });

    it('returns claims', () => {
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';
      const expectedClaims = {
        sub: '1234567890',
        name: 'John Doe',
        admin: true
      };
      expect(jwtUtils.parseJwtClaims(jwt)).toEqual(expectedClaims);
    });
  });

  describe('isJwtExpired', () => {
    it('returns true if expired', () => {
      const claim = {
        exp: Math.floor(Date.now() / 1000) - 60
      };
      const encodedClaim = base64.encode(JSON.stringify(claim));
      const jwt = `alsdjfaj123.${encodedClaim}.khsadlj234`;
      expect(jwtUtils.isJwtExpired(jwt)).toBe(true);
    });

    it('returns false if not expired', () => {
      const claim = {
        exp: Math.floor(Date.now() / 1000) + 60
      };
      const encodedClaim = base64.encode(JSON.stringify(claim));
      const jwt = `alsdjfaj123.${encodedClaim}.khsadlj234`;
      expect(jwtUtils.isJwtExpired(jwt)).toBe(false);
    });

    it('returns true if expired with skew', () => {
      const claim = {
        exp: Math.floor(Date.now() / 1000) + 60
      };
      const encodedClaim = base64.encode(JSON.stringify(claim));
      const jwt = `alsdjfaj123.${encodedClaim}.khsadlj234`;
      expect(jwtUtils.isJwtExpired(jwt, 120)).toBe(true);
    });

    it('returns false if not expired with skew', () => {
      const claim = {
        exp: Math.floor(Date.now() / 1000) + 120
      };
      const encodedClaim = base64.encode(JSON.stringify(claim));
      const jwt = `alsdjfaj123.${encodedClaim}.khsadlj234`;
      expect(jwtUtils.isJwtExpired(jwt, 120)).toBe(false);
    });
  });
});