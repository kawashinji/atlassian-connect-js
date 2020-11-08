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
      const sandbox = 'allow-downloads allow-forms allow-modals allow-popups allow-scripts allow-same-origin allow-top-navigation-by-user-activation allow-storage-access-by-user-activation';
      const attributes = IframeUtils.optionsToAttributes({ sandbox });
      // could be anything based on browser support, so just check not-empty
      expect(attributes.sandbox.length > 0).toBe(true);
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