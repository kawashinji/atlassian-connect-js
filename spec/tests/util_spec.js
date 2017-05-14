import Util from 'src/host/util';

describe('Host utils', () => {
  describe('last', () => {

    it('returns the last entry in an array', () => {
      var arr = ['a','b','c','d'];
      expect(Util.last(arr)).toEqual('d');
    });

  });
  describe('first', () => {

    it('returns the first entry in an array', () => {
      var arr = ['a','b','c','d'];
      expect(Util.first(arr)).toEqual('a');
    });

    it('returns the first X entries in an array', () => {
      var arr = ['a','b','c','d'];
      expect(Util.first(arr, 3)).toEqual(['a','b','c']);
    });

  });

  describe('pick', () => {

    it('returns a filtered copy of obj with only the specified keys', () => {
      var obj = {
        a: 'aaa',
        b: 'bb',
        c: 'cccc',
        d: ['a','b','c']
      };
      expect(Util.pick(obj, ['b','d'])).toEqual({
        b: 'bb', d: ['a','b','c']
      });

    });

    it('returns an empty object when nothing matches', () => {
      var obj = {
        a: 'aaa',
        b: 'bb',
        c: 'cccc',
        d: ['a','b','c']
      };
      expect(Util.pick(obj, ['x'])).toEqual({});
    });

    it('returns an empty object when undefined is supplied', () => {
      expect(Util.pick(undefined, ['x'])).toEqual({});
    });
  });
});