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

    it('generates a form targeting to iframe', () => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com',
        options: {
          renderingMethod: 'POST'
        }
      };
      var $container = IframeContainerComponent.createExtension(extension, $('<div />'));
      var $iframe = $container.find('iframe');
      var $form = $container.find('form');

      expect($iframe.length).toEqual(1);
      expect($form.length).toEqual(1);
      expect($form.attr('target')).toEqual($iframe.attr('name'));
      expect($iframe.attr('src')).toBeFalsy();
    });

  });

});
