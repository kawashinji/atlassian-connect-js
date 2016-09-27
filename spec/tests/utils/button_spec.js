import ButtonUtils from 'src/host/utils/button';

describe('button utils', () => {
  describe('randomIdentifier', () => {
    it('returns random id', () => {
      var randomId1 = ButtonUtils.randomIdentifier();
      var randomId2 = ButtonUtils.randomIdentifier();
      expect(randomId1).not.toEqual(randomId2);
    });
  })
});