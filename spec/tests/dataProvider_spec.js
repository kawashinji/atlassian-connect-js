import AP from 'src/plugin';

describe('AP.events.onDataProvider', () => {
  var extensionId = '3d6693a6-ec1f-4419-b56e-3194a26bd593';

  beforeEach(() => {
    AP._data.extension_id = extensionId;
    AP._data.origin = '*';
  });

  it('should register the provided callback', () => {
    var callback = function () {};
    expect(AP.events.onDataProvider(callback)).toBe(callback);
  });

  it('should respond with an error message on missing callback', () => {
    var callbackSpy = jasmine.createSpy('callbackSpy');
    var postMessageSpy = jasmine.createSpy('postMessageSpy');
    var event = {
      data: {
        eid: extensionId,
      },
      source: {
        postMessage: postMessageSpy,
      },
    };

    expect(AP.events.onDataProvider).toThrow();
    expect(callbackSpy.calls.count()).toEqual(0);
  });

  describe('When a data_provider message is received', () => {
    it('should have called the callback ', () => {
      var callbackSpy = jasmine.createSpy('callbackSpy');
      var postMessageSpy = jasmine.createSpy('postMessageSpy');
      var event = {
        data: {
          eid: extensionId,
        },
        source: {
          postMessage: postMessageSpy,
        },
      };

      expect(AP.events.onDataProvider(callbackSpy)).toBe(callbackSpy);
      expect(callbackSpy.calls.count()).toEqual(0);

      AP._messageHandlers.data_provider(event);
      expect(callbackSpy.calls.count()).toEqual(1);
    });

    it('should respond with a confirmation message on each success', () => {
      var callbackSpy = jasmine.createSpy('callbackSpy');
      var postMessageSpy = jasmine.createSpy('postMessageSpy');
      var event = {
        data: {
          eid: extensionId,
        },
        source: {
          postMessage: postMessageSpy,
        },
      };

      expect(AP.events.onDataProvider(callbackSpy)).toBe(callbackSpy);
      expect(callbackSpy.calls.count()).toEqual(0);
      expect(postMessageSpy.calls.count()).toEqual(0);

      AP._messageHandlers.data_provider(event);
      expect(callbackSpy.calls.count()).toEqual(1);
      expect(postMessageSpy.calls.count()).toEqual(1);
      expect(postMessageSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: 'data_provider_success',
          eid: extensionId,
        }),
        '*'
      );

      AP._messageHandlers.data_provider(event);
      expect(callbackSpy.calls.count()).toEqual(2);
      expect(postMessageSpy.calls.count()).toEqual(2);
    });

    it('should respond with an error message on missing callback', () => {
      var extensionId = 'unregistered-extension-id';
      var callbackSpy = jasmine.createSpy('callbackSpy');
      var postMessageSpy = jasmine.createSpy('postMessageSpy');
      var event = {
        data: {
          eid: extensionId,
        },
        source: {
          postMessage: postMessageSpy,
        },
      };

      expect(callbackSpy.calls.count()).toEqual(0);
      expect(postMessageSpy.calls.count()).toEqual(0);

      AP._messageHandlers.data_provider(event);
      expect(callbackSpy.calls.count()).toEqual(0);
      expect(postMessageSpy.calls.count()).toEqual(1);
      expect(postMessageSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          type: 'data_provider_error',
          error: 'no callback registered',
          eid: extensionId,
        }),
        '*'
      );
    });
  });
});
