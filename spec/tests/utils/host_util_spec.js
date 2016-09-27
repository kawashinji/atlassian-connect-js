import util from 'src/host/util';

describe('host util', () => {
  describe('escapeSelector', () => {
    it('throws an error when selector not defined', () => {
      expect(() => {
        util.escapeSelector();
      }).toThrow();
    });

    it('escapes given string', () => {
      const testString = '!"#$%&\'()*+,.\/:;<=>?@[\\\]^`{|}~test';
      const expectedString = '\\!\\"\\#\\$\\%\\&\\\'\\(\\)\\*\\+\\,\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\\\\\\]\\^\\`\\{\\|\\}\\~test';
      expect(util.escapeSelector(testString)).toEqual(expectedString);
    });

    it('does not escape string if there are no special characters', () => {
      const testString = 'this is a string';
      expect(util.escapeSelector(testString)).toEqual(testString);
    });
  });

  describe('stringToDimension', () => {
    it('return formatted string (px) given a string', () => {
      const dimension = '100px';
      expect(util.stringToDimension(dimension)).toEqual(dimension);
    });

    it('return formatted string (%) given a string', () => {
      const dimension = '100%';
      expect(util.stringToDimension(dimension)).toEqual(dimension);
    });

    it('defaults to px', () => {
      const dimension = '100';
      expect(util.stringToDimension(dimension)).toEqual(`${dimension}px`);
    });

    it('defaults to px (number)', () => {
      const dimension = 100;
      expect(util.stringToDimension(dimension)).toEqual(`${dimension}px`);
    });
  });
});

