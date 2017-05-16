import jwtUtils from 'src/host/utils/jwt';
import base64 from 'src/host/utils/base64';

describe('jwt utils', () => {

  describe('funky characters decoding', () => {
    it('Accented characters', () => {
      const claims = {
        user: 'aàáâãäåçèéêëìíîðñòôõööz'
      };
      const encodedClaims = 'eyJ1c2VyIjoiYcOgw6HDosOjw6TDpcOnw6jDqcOqw6vDrMOtw67DsMOxw7LDtMO1w7bDtnoifQ';
      const jwt = `alsdjfaj123.${encodedClaims}.khsadlj234`;
      expect(jwtUtils.parseJwtClaims(jwt)).toEqual(claims);
    });

    it('Asian characters', () => {
      const claims = {
        user: 'a国際交流基金海外運営専門員z'
      };
      const encodedClaims = 'eyJ1c2VyIjoiYeWbvemam-S6pOa1geWfuumHkea1t-WklumBi-WWtuWwgumWgOWToXoifQ';
      const jwt = `alsdjfaj123.${encodedClaims}.khsadlj234`;
      expect(jwtUtils.parseJwtClaims(jwt)).toEqual(claims);
    });

    it('Good international string characters', () => {
      const claims = {
        user: 'àáâãäåçèéêëìíîðñòôõöö 国際交流абвгдежзبْجَدِيَّة عَرَبِيَّة‎עִבְרִיתदिंदुसरोवरλληνικ'
      };
      const encodedClaims = 'eyJ1c2VyIjoiw6DDocOiw6PDpMOlw6fDqMOpw6rDq8Osw63DrsOww7HDssO0w7XDtsO2IOWb' +
          'vemam-S6pOa1gdCw0LHQstCz0LTQtdC20LfYqNmS2KzZjtiv2ZDZitmO2ZHYqSDYudmO2LHZjtio2ZDZitmO2ZHYqe' +
          'KAjtei1rTXkdaw16jWtNeZ16rgpKbgpL_gpILgpKbgpYHgpLjgpLDgpYvgpLXgpLDOu867zrfOvc65zroifQ';
      const jwt = `alsdjfaj123.${encodedClaims}.khsadlj234`;
      expect(jwtUtils.parseJwtClaims(jwt)).toEqual(claims);
    });

    it('Good international string characters', () => {
      const claims = {
        user: 'a♬♬♫b'
      };
      const encodedClaims = 'eyJ1c2VyIjoiYeKZrOKZrOKZq2IifQ';
      const jwt = `alsdjfaj123.${encodedClaims}.khsadlj234`;
      expect(jwtUtils.parseJwtClaims(jwt)).toEqual(claims);
    });


  });

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