import MessagesModule from 'src/host/modules/messages';

describe('messages module', () => {
  var msgCallback = function () { };
  msgCallback._id = 'abc123';
  msgCallback._context = {
    extension: {}
  };

  beforeEach(() => {
    $('.aui-message').remove();
  });

  describe('constructor', () => {
    it('creates a generic flag', () => {
      var testTitle = 'some test title';
      var testBody = 'some test body';
      MessagesModule.generic.constructor(testTitle, testBody, {}, msgCallback);
      expect($('.aui-message-generic').length).toEqual(1);
      expect($('.aui-message-generic').first().text().includes(testTitle)).toBe(true);
      expect($('.aui-message-generic').first().text().includes(testBody)).toBe(true);
    });

    it('creates a error flag', () => {
      var testTitle = 'some test title';
      var testBody = 'some test body';
      MessagesModule.error.constructor(testTitle, testBody, {}, msgCallback);
      expect($('.aui-message-error').length).toEqual(1);
      expect($('.aui-message-error').first().text().includes(testTitle)).toBe(true);
      expect($('.aui-message-error').first().text().includes(testBody)).toBe(true);
    });

    it('creates a warning flag', () => {
      var testTitle = 'some test title';
      var testBody = 'some test body';
      MessagesModule.warning.constructor(testTitle, testBody, {}, msgCallback);
      expect($('.aui-message-warning').length).toEqual(1);
      expect($('.aui-message-warning').first().text().includes(testTitle)).toBe(true);
      expect($('.aui-message-warning').first().text().includes(testBody)).toBe(true);
    });

    it('creates a success flag', () => {
      var testTitle = 'some test title';
      var testBody = 'some test body';
      MessagesModule.success.constructor(testTitle, testBody, {}, msgCallback);
      expect($('.aui-message-success').length).toEqual(1);
      expect($('.aui-message-success').first().text().includes(testTitle)).toBe(true);
      expect($('.aui-message-success').first().text().includes(testBody)).toBe(true);
    });

    it('creates a info flag', () => {
      var testTitle = 'some test title';
      var testBody = 'some test body';
      MessagesModule.info.constructor(testTitle, testBody, {}, msgCallback);
      expect($('.aui-message-info').length).toEqual(1);
      expect($('.aui-message-info').first().text().includes(testTitle)).toBe(true);
      expect($('.aui-message-info').first().text().includes(testBody)).toBe(true);
    });

    it('creates a hint flag', () => {
      var testTitle = 'some test title';
      var testBody = 'some test body';
      MessagesModule.hint.constructor(testTitle, testBody, {}, msgCallback);
      expect($('.aui-message-hint').length).toEqual(1);
      expect($('.aui-message-hint').first().text().includes(testTitle)).toBe(true);
      expect($('.aui-message-hint').first().text().includes(testBody)).toBe(true);
      expect($('.aui-message-hint').first().attr('id')).toEqual(`ap-message-${msgCallback._id}`);
    });
  });

  describe('clear', () => {
    it('closes the message', () => {
      MessagesModule.info.constructor('testTitle', 'testBody', {}, msgCallback);
      try {
        MessagesModule.clear({ _id: msgCallback._id });
      } catch (e) {
        // this is needed because _destroy will not be available
      }
      expect($('.aui-message').length).toEqual(0);
    });

    it('does not close the message if not the correct id', () => {
      MessagesModule.info.constructor('testTitle', 'testBody', {}, msgCallback);
      try {
        MessagesModule.clear({ _id: 'not the right one' });
      } catch (e) {
        // this is needed because _destroy will not be available
      }
      expect($('.aui-message').length).toEqual(1);
    });
  });

  describe('onClose', () => {
    it('calls the callback when message closes', () => {
      MessagesModule.info.constructor('testTitle', 'testBody', {}, msgCallback);
      var callbackSpy = jasmine.createSpy('callback');
      MessagesModule.onClose({_id: msgCallback._id}, callbackSpy);
      try {
        MessagesModule.clear({ _id: msgCallback._id });
      } catch (e) {
        // this is needed because _destroy will not be available
      }
      expect(callbackSpy).toHaveBeenCalled();
    });
  });

});