import IframeContainerComponent from 'src/host/components/iframe_container';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import urlUtil from 'src/host/utils/url';

describe('Iframe container component', () => {

  beforeEach(() => {
    IframeContainerComponent._contentResolver = false;
  });

  describe('content resolver', () =>{
    it('setContentResolver sets the content resolver', () => {
      var spy = jasmine.createSpy('spy');
      expect(IframeContainerComponent._contentResolver).not.toEqual(spy);
      IframeContainerComponent.setContentResolver(spy);
      expect(IframeContainerComponent._contentResolver).toEqual(spy);
    });

    it('sets the content resolver when content-resolver-register-by-extension is triggered', () => {
      var spy = jasmine.createSpy('spy');
      expect(IframeContainerComponent._contentResolver).not.toEqual(spy);
      EventDispatcher.dispatch('content-resolver-register-by-extension', {
        callback: spy
      });
      expect(IframeContainerComponent._contentResolver).toEqual(spy);
    });
  });


  describe('_insertIframe', () => {

    it('returns an iframe', () => {
      var container = $("<div />");
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key'
      };
      var iframe = IframeContainerComponent._insertIframe(container, extension);
      expect(iframe.$el[0].nodeName).toEqual('IFRAME');
    });

    it('sets the default width and height', () => {
      var container = $("<div />");
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        options: {
          width: '123px',
          height: '444px'
        }
      };
      var iframe = IframeContainerComponent._insertIframe(container, extension);
      expect(iframe.$el.css('width')).toEqual(extension.options.width);
      expect(iframe.$el.css('height')).toEqual(extension.options.height);
    });
    it('returns an extenision', () => {
      var container = $("<div />");
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key'
      };
      var iframe = IframeContainerComponent._insertIframe(container, extension);

      expect(iframe.extension).toEqual(jasmine.any(Object));
      expect(iframe.extension.addon_key).toEqual(extension.addon_key);
      expect(iframe.extension.key).toEqual(extension.key);
      expect(iframe.extension.id).toEqual(jasmine.any(String));
    });

    it('notifies that an iframe has been created', (done) => {
      var container = $("<div />");
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key'
      };
      EventDispatcher.once('iframe-create', (data) => {
        expect(data.extension).toEqual(jasmine.any(Object));
        expect(data.$el[0].nodeName).toEqual('IFRAME');
        done();
      });
      IframeContainerComponent._insertIframe(container, extension);
    });

  });
  describe('createExtension', () => {

    it('returns a container', () => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com'
      };
      var createdExtension = IframeContainerComponent.createExtension(extension);
      expect(createdExtension.hasClass('ap-container')).toBe(true);
    });

    it('non JWT url iframe is immediately inserted', () => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com'
      };
      var createdExtension = IframeContainerComponent.createExtension(extension);
      expect(createdExtension.find('iframe').length).toEqual(1);
      expect(createdExtension.find('iframe').attr('src')).toEqual(extension.url);
    });
    it('JWT url', () => {
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com?jwt=abc123'
      };
      spyOn(urlUtil,'hasJwt').and.returnValue(true);
      spyOn(urlUtil,'isJwtExpired').and.returnValue(false);
      var createdExtension = IframeContainerComponent.createExtension(extension);
      expect(createdExtension.find('iframe').length).toEqual(1);
      expect(createdExtension.find('iframe').attr('src')).toEqual(extension.url);
    });

    it('expired JWT', () => {
      var spy = jasmine.createSpy('spy');
      var extension = {
        addon_key: 'some-addon-key',
        key: 'some-module-key',
        url: 'https://www.example.com?jwt=abc123',
        id: 'some-id'
      };
      spyOn(urlUtil,'hasJwt').and.returnValue(true);
      spyOn(urlUtil,'isJwtExpired').and.returnValue(true);

      var createdExtension = IframeContainerComponent.createExtension(extension);
      expect(createdExtension.hasClass('ap-container')).toBe(true);
      expect(createdExtension.find('iframe').length).toEqual(0);
    });
  });


});
