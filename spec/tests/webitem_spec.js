import WebItem from 'src/host/components/webitem';
import _ from 'lodash';

describe('webitem component', () => {

  describe('content resolver', () => {

    it('contains a default content resolver', () => {
      expect(WebItem._contentResolver).toEqual(jasmine.any(Function));
    });

    it('setContentResolver sets a content resolver', () => {
      var resolver = jasmine.createSpy('spy');
      WebItem.setContentResolver(resolver);
      expect(WebItem._contentResolver).toEqual(resolver);
    });

    it('requestContent calls the content resolver', () => {
      var resolver = jasmine.createSpy('spy');
      var extension = {
        addon_key: 'some.addon.key',
        key: 'any.module.key'
      };
      WebItem.setContentResolver(resolver);
      WebItem.requestContent(extension);
      expect(resolver).toHaveBeenCalled();
      expect(resolver.calls.first().args[0]).toEqual({
        addon_key: extension.addon_key,
        key: extension.key,
        classifier: 'json'
      });
    });

    it('requestContent returns the content resolver return', () => {
      var resolver = jasmine.createSpy('spy').and.returnValue('response');
      var extension = {
        addon_key: 'some.addon.key',
        key: 'any.module.key'
      };
      WebItem.setContentResolver(resolver);
      expect(WebItem.requestContent(extension)).toEqual('response');
    });
  });

  it('setWebItem adds a webitem to the list', () => {
    var webitemone = {
      name: 'awebitem',
      selector: 'div',
      triggers: []
    };
    expect(WebItem._webitems).toEqual({});
    WebItem.setWebItem(webitemone);
    expect(WebItem._webitems).toEqual({
      'awebitem': webitemone
    });
  });

  describe('getWebItemsBySelector', () => {
    afterEach(() => {
      WebItem._webitems = {};
    });

    it('returns webitems that match the specified selector', () => {
      var webitemone = {
        name: 'awebitem',
        selector: 'div',
        triggers: []
      };
      var webitemtwo = {
        name: 'secondwebitem',
        selector: 'a',
        triggers: []
      };
      WebItem.setWebItem(webitemone);
      WebItem.setWebItem(webitemtwo);

      var filtered = WebItem.getWebItemsBySelector('div');
      expect(filtered).toEqual(webitemone);

    });
  });

  describe('AUI responsive webitems event', () => {
    var oldWebItemId = 'old-web-item';
    var newWebItemId = 'new-web-item';
    var apClassList = ['ap-dialog', 'ap-module-test', 'ap-extension'];
    var nonApClassList = ['aui-nav', 'aui-something', 'not-ap'];

    afterEach(() => {
      $(`#${oldWebItemId}`).remove();
      $(`#${newWebItemId}`).remove();
    });

    it('adds ap classes to the sub menu web items', () => {

      $('body').append($(`<li id="${oldWebItemId}"><a href="https://some.url.com" class="${nonApClassList.join(' ')} ${apClassList.join(' ')}">test</a></li>`));
      $('body').append($(`<li id="${newWebItemId}"><a href="https://some.url.com">test</a></li>`));

      var oldWebItem = document.getElementById(oldWebItemId);
      var newWebItem = document.getElementById(newWebItemId);

      var testEvent;
      if (typeof Event === 'function') {
        testEvent = new Event('aui-responsive-menu-item-created');
        testEvent.detail = {
          originalItem: oldWebItem,
          newItem: newWebItem
        };
        document.dispatchEvent(testEvent);
      } else {
        var testEvent = document.createEvent('Event');
        testEvent.initEvent('aui-responsive-menu-item-created', false, false);
        testEvent.detail = {
          originalItem: oldWebItem,
          newItem: newWebItem
        };
        document.dispatchEvent(testEvent);
      }

      var newWebItemLink = newWebItem.querySelector('a');

      apClassList.forEach((cls) => {
        expect(_.includes(newWebItemLink.classList, cls)).toBe(true);
      });

      nonApClassList.forEach((cls) => {
        expect(_.includes(newWebItemLink.classList, cls)).toBe(false);
      });
    });
  });
});
