import IframeUtils from 'src/host/utils/iframe';

describe('iframe utils', () => {
  describe('optionsToAttributes', () => {

    it('returns empty object if options is not an object', () => {
      expect(IframeUtils.optionsToAttributes('not an object')).toEqual({});
    });

    it('returns sanitised dimensions', () => {
      const options = {
        width: '100',
        height: '500',
        size: 'medium'
      };

      const attributes = IframeUtils.optionsToAttributes(options);
      expect(attributes.width).toEqual(`${options.width}px`);
      expect(attributes.height).toEqual(`${options.height}px`);
      expect(attributes.size).not.toBeDefined();
    });

    it('returns sanitised sandbox', () => {
      const sandbox = 'sandbox';
      const attributes = IframeUtils.optionsToAttributes({ sandbox });
      expect(attributes.sandbox).toEqual(sandbox);
    });

    it('does not return sandbox if not present', () => {
      const attributes = IframeUtils.optionsToAttributes({});
      expect(typeof attributes.sandbox).toEqual('undefined');
    });

    it('does not return sandbox if wrong type', () => {
      const sandbox = {};
      const attributes = IframeUtils.optionsToAttributes({ sandbox });
      expect(typeof attributes.sandbox).toEqual('undefined');
    });
  });
});