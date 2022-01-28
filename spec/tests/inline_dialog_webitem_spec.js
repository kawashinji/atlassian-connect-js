import simpleXDM from 'simple-xdm/host';
import { InlineDialogWebItem as InlineDialogWebItemConstructor } from 'src/host/components/inline_dialog_webitem';
import InlineDialogActions from 'src/host/actions/inline_dialog_actions';
import InlineDialogComponent from 'src/host/components/inline_dialog';
import WebItemActions from 'src/host/actions/webitem_actions';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import IframeContainer from 'src/host/components/iframe_container';
import jwtActions from 'src/host/actions/jwt_actions';
import base64 from 'src/host/utils/base64';

describe('Inline Dialog Webitem', () => {
  var webitemButton;
  var InlineDialogWebitem;
  const classPluginKey = 'ap-plugin-key-my-plugin';

  function buildJWT(exp){
    const claim = {
      exp: Math.floor(Date.now() / 1000) + exp
    };
    const encodedClaim = base64.encode(JSON.stringify(claim));
    return `alsdjfaj123.${encodedClaim}.khsadlj234`;
  }

  beforeEach(() => {
    $('.aui-inline-dialog').remove();
    webitemButton = $('<a />').attr('href', 'https://www.example.com?a.x=b#' + encodeURI(JSON.stringify({productCtx:'{"b.c":"d"}'})));
    webitemButton.text('i am a webitem');
    webitemButton.addClass(`ap-inline-dialog ${classPluginKey} ap-module-key-key ap-target-key-key ap-link-webitem`);
    webitemButton.appendTo('body');

    // We must do it this way as InlineDialogWebItem exports a singleton which is created before this value can be mocked
    InlineDialogWebitem = new InlineDialogWebItemConstructor()
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    webitemButton.remove();
    if (window && window._AP) {
      delete window._AP.inlineDialogModules;
    }
  });

  it('getWebItem returns a webitem compatible object', function(){
    var inlineDialogWebitemSpec = InlineDialogWebitem.getWebItem();
    expect(inlineDialogWebitemSpec).toEqual({
      name: 'inline-dialog',
      selector: '.ap-inline-dialog',
      triggers: [ 'mouseenter', 'click' ]
    });
  });

  describe('rendering', () => {

    it('renders an inline dialog', (done) => {
      EventDispatcher.registerOnce('after:webitem-invoked:inline-dialog', function(){
        expect($('.aui-inline-dialog').length).toBe(1);
        done();
      });
      $(function(){
        $('.ap-inline-dialog').click();
      });
    });

    it('does not render multiple times for the same extension', (done) => {
      $(function(){
        $('.ap-inline-dialog').click();
        expect($('.aui-inline-dialog').length).toBe(1);
        $('.ap-inline-dialog').click();
        expect($('.aui-inline-dialog').length).toBe(1);
        done();
      });
    });


    it('passes inline dialog options to component', (done) => {
      var allPossibleOptions = {
        closeOthers: true,
        isRelativeToMouse: true,
        offsetX: '1px',
        offsetY: '1px',
        onHover: true,
        onTop: true,
        persistent: true,
        showDelay: true,
        width: '100px'
      };

      window._AP = window._AP || {};
      window._AP.inlineDialogModules = {};
      window._AP.inlineDialogModules['my-plugin'] = {
        key: {
          options: allPossibleOptions
        }
      };

      EventDispatcher.registerOnce('inline-dialog-opened', function(data){
        Object.getOwnPropertyNames(allPossibleOptions).forEach(function(name){
          expect(data.extension.options[name]).toEqual(allPossibleOptions[name]);
        });
        done();
      });
      $(function(){
        $('.ap-inline-dialog').click();
      });
    });

  });

  describe('triggers', () => {
    beforeEach(() => {
      window._AP = {
        _convertConnectOptions: function(data){
          return {
            options: {
              productContext: JSON.parse(data.productCtx)
            }
          };
        }
      }
    });

    afterEach(() => {
      delete window._AP._convertConnectOptions;
    });

    it('is set to be triggered by hover and click', () => {
      expect(InlineDialogWebitem.getWebItem().triggers).toEqual(['mouseenter', 'click']);
    });

    it('responds to a click event', (done) => {
      var spy = jasmine.createSpy('spy');
      spyOn(WebItemActions, 'webitemInvoked');
      $(function(){
        $('.ap-inline-dialog').click();
        expect(WebItemActions.webitemInvoked.calls.count()).toEqual(1);
        done();
      });
    });

    it('responds to a mouseenter event', (done) => {
      var spy = jasmine.createSpy('spy');
      spyOn(WebItemActions, 'webitemInvoked');
      $(function(){
        $('.ap-inline-dialog').trigger('mouseenter');
        expect(WebItemActions.webitemInvoked.calls.count()).toEqual(1);
        done();
      });
    });


    it('opens with product context', (done) => {
      EventDispatcher.register('inline-dialog-extension', function(data){
        expect(data.extension.options.productContext).toEqual({
          a: 'b'
        });
        done();
      });

      jwtActions.registerContentResolver({callback: function(data){
        return jQuery.Deferred(function(defer){
          defer.resolve({
            url: 'http://www.example.com',
            addon_key: data.addon_key,
            key: data.key,
            options: {
              productContext: {
                a: 'b'
              }
            }
          });
        }).promise();
      }});

      InlineDialogWebitem.opened({
        $el: $('<div />'),
        extension: {
          addon_key: 'a-key',
          key: 'key'
        }
      });
    });

    it('invokes with product context', (done) => {
      var spy = jasmine.createSpy('spy');
      spyOn(WebItemActions, 'webitemInvoked');
      $(function(){
        $('.ap-inline-dialog').trigger('click');
        var extensionObj = WebItemActions.webitemInvoked.calls.first().args[2];
        expect(extensionObj.options.productContext).toEqual({'b.c': 'd'});
        done();
      });
    });

    it('only calls the content resolver once per add-on', (done) => {
      var spy = jasmine.createSpy('spy');

      jwtActions.registerContentResolver({callback: function(data){
        spy();
        // if you don't return a promise this regression test will always pass
        return jQuery.Deferred(function(defer){
          defer.resolve({
            url: 'http://www.example.com',
            addon_key: data.addon_key,
            key: data.key,
            options: {
              productContext: {
                a: 'b'
              }
            }
          });
        }).promise();
      }});
      $(function(){
        $('.ap-inline-dialog').trigger('click');
        setTimeout(function(){
          expect(spy.calls.count()).toEqual(1);
          done();
        }, 300);
      });
    });

    it('reuses iframe if JWT has not timed out', () => {
      const jwt = buildJWT(100);

      jwtActions.registerContentResolver({callback: function(data){
        return jQuery.Deferred(function(defer){
          defer.resolve({
            url: 'http://www.example.com?jwt=' + jwt,
            addon_key: data.addon_key,
            key: data.key,
            options: {
              productContext: {
                a: 'b'
              }
            }
          });
        }).promise();
      }});

      let data = {
        $el: $('<div />'),
        extension: {
          addon_key: 'a-key',
          key: 'key'
        }
      };
      expect(InlineDialogWebitem.opened(data)).toEqual(true);
      expect(InlineDialogWebitem.opened(data)).toEqual(false);
    });

    it('gets new JWT if expired', () => {
      jasmine.clock().install();
      const jwt = buildJWT(0);
      jwtActions.registerContentResolver({callback: function(data){
        return jQuery.Deferred(function(defer){
          defer.resolve({
            url: 'http://www.example.com?jwt=' + jwt,
            addon_key: data.addon_key,
            key: data.key,
            options: {
              productContext: {
                a: 'b'
              }
            }
          });
        }).promise();
      }});

      let data = {
        $el: $('<div />'),
        extension: {
          addon_key: 'a-key',
          key: 'key'
        }
      };
      expect(InlineDialogWebitem.opened(data)).toEqual(true);
      jasmine.clock().tick(10000000);
      expect(InlineDialogWebitem.opened(data)).toEqual(true);
      jasmine.clock().uninstall();
    });

    it('reuses iframe if url is known and no jwt', () => {
      jwtActions.registerContentResolver({callback: function(data){
        return jQuery.Deferred(function(defer){
          defer.resolve({
            url: 'http://www.example.com',
            addon_key: data.addon_key,
            key: data.key,
            options: {
              productContext: {
                a: 'b'
              }
            }
          });
        }).promise();
      }});

      let data = {
        $el: $('<div />'),
        extension: {
          addon_key: 'a-key',
          key: 'key',
          url: 'http://www.example.com'
        }
      };
      expect(InlineDialogWebitem.opened(data)).toEqual(true);
      expect(InlineDialogWebitem.opened(data)).toEqual(false);
    });
  });

  it('drops events for confluence com.addonengine.analytics plugin until analytics module is loaded', (done) => {
    spyOn(WebItemActions, 'webitemInvoked');
    $(function(){
      // With a regular plugin key, the click should pass through uninterrupted
      $(webitemButton).trigger('click');
      expect(WebItemActions.webitemInvoked.calls.count()).toEqual(1);

      // With the special plugin key, the click should be blocked if the analytics module isn't loaded
      $(webitemButton).removeClass(classPluginKey).addClass('ap-plugin-key-com.addonengine.analytics');
      $(webitemButton).trigger('click');
      expect(WebItemActions.webitemInvoked.calls.count()).toEqual(1);

      // When we load the analytics module the click passes through again
      simpleXDM.defineModule('analytics', {});
      $(webitemButton).trigger('click');
      expect(WebItemActions.webitemInvoked.calls.count()).toEqual(2);
      done();
    });
  });

});