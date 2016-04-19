import IframeContainerComponent from 'src/host/components/iframe_container';

describe('Iframe container component', () => {

  describe('createExtension', () => {

    it('returns a container', () => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com'
      };
      var createdExtension = IframeContainerComponent.createExtension(extension);
      expect(createdExtension.hasClass('ap-iframe-container')).toBe(true);
    });
  });


});
