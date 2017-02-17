import IframeCreate from 'src/host/iframe-create';

describe('Iframe Create', () => {
  var extensionConfig = {
    addon_key: 'addon-key',
    key: 'module-key',
    url: '/iframe-content.html',
    options: {
      isGeneral: true
    }, //options to send to the iframe
    data: { //data to stay on the host side
      pageType: 'general',
      productCtx: '{}',
      uid: 'someUserId'
    }
  };


  it('returns an iframe container node', () => {
    var container = IframeCreate(extensionConfig);
    expect(container.length).toEqual(1);
    expect(container.hasClass('ap-iframe-container')).toBe(true);
    expect(container.find('iframe').length).toEqual(1);
  });

  describe('iframe has attribute', () => {
    var iframe = IframeCreate(extensionConfig).find('iframe');
    it('src', () => {
      expect(iframe.attr('src')).toContain(extensionConfig.url);
    });

    it('id', () => {
      expect(iframe.attr('id')).toContain(extensionConfig.addon_key);
      expect(iframe.attr('id')).toContain(extensionConfig.key);
    });

    it('name', () => {
      expect(iframe.attr('name')).toContain('{}');
    });

  });

});
