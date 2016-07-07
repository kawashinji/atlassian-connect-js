import WebItem from 'src/host/components/webitem';

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

  it('setWebItem adds a webitem to the list',() => {
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


});
