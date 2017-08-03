import FlagModule from 'src/host/modules/flag';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import EventActions from 'src/host/actions/event_actions';

describe('flag api module', () => {

  afterEach(() => {
    $('.aui-flag').remove();
  });

  it('should return the flag api the correct methods', () => {
    expect(Object.getOwnPropertyNames(FlagModule)).toEqual(['create']);
    expect(Object.getOwnPropertyNames(FlagModule.create)).toEqual(['constructor', 'close']);
  });

  describe('constructor', () => {
    it('should create a flag', (done) => {

      EventDispatcher.registerOnce('flag-open', (e) => {
        expect(e.id).toEqual('ap-flag-abc123');
        expect($('#' + e.id).hasClass('aui-flag')).toBe(true);
        expect($('#' + e.id).find('.title').text()).toEqual('some title');
        expect($('#' + e.id).find('.ac-flag-actions a').text()).toEqual('action text');
        done();
      });

      var flagCallback = function(){};
      flagCallback._id = 'abc123';
      flagCallback._context = {
        extension: {
          extension_id: 'an-extension-id'
        }
      };
      new FlagModule.create.constructor({
        type: 'success',
        title: 'some title',
        body: 'the body',
        actions: {
          key: 'action text'
        }
      }, flagCallback);

    });
  });

  describe('action', () => {
    it('should trigger an event on click', () =>{
      var flagCallback = function(){};
      flagCallback._id = 'a1';
      flagCallback._context = {
        extension: {
          extension_id: 'an-extension-id'
        }
      };
      var flag = new FlagModule.create.constructor({
        type: 'success',
        title: 'some title',
        body: 'the body',
        actions: {
          akey: 'some value'
        }
      }, flagCallback);
      expect($('.ac-flag-actions a').length).toEqual(1);
      spyOn(EventActions,'broadcast');
      expect(EventActions.broadcast).not.toHaveBeenCalled();
      $('.ac-flag-actions a').click();
      expect(EventActions.broadcast).toHaveBeenCalled();
      expect(EventActions.broadcast).toHaveBeenCalledWith(
        'flag.action',
        flagCallback._context.extension,
        {
          flagIdentifier: flagCallback._id,
          actionIdentifier: 'akey'
        });
    });
  });

  describe('close', () => {
    it('should close the flag', () =>{
      var flagCallback = function(){};
      flagCallback._id = 'abc1234';
      flagCallback._context = {
        extension: {}
      };
      var flag = new FlagModule.create.constructor({
        type: 'success',
        title: 'some title',
        body: 'the body'
      }, flagCallback);
      expect($('.aui-flag').attr('aria-hidden')).toEqual('false');
      flag.close(flagCallback);
      expect($('.aui-flag').attr('aria-hidden')).toEqual('true');
    });
  });

  describe('on close', () => {
    it('should set an event hanler', () => {
      var flagCallback = function(){};
      flagCallback._id = 'abc1234';
      flagCallback._context = {
        extension: {
          extension_id: 'some-extension-id'
        }
      };
      var flag = new FlagModule.create.constructor({
        type: 'success',
        title: 'some title',
        body: 'the body'
      }, flagCallback);
      spyOn(EventActions,'broadcast');
      expect(EventActions.broadcast).not.toHaveBeenCalled();
      flag.close(flagCallback);
      expect(EventActions.broadcast).toHaveBeenCalled();
      expect(EventActions.broadcast).toHaveBeenCalledWith('flag.close', flagCallback._context.extension, { flagIdentifier: flagCallback._id });
    });
  });

});