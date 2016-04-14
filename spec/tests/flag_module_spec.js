import FlagModule from 'src/host/modules/flag';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';

describe('flag api module', () => {

  afterEach(() => {
    $('.aui-flag').remove();
  });

  it('should return the flag api the correct methods', () => {
    expect(Object.getOwnPropertyNames(FlagModule)).toEqual(['create']);
    expect(Object.getOwnPropertyNames(FlagModule.create)).toEqual(['constructor', 'on', 'close']);
  });

  describe('constructor', () => {
    it('should create a flag', (done) => {

      EventDispatcher.registerOnce('flag-open', (e) => {
        expect(e.id).toEqual('ap-flag-abc123');
        expect($('#' + e.id).hasClass('aui-flag')).toBe(true);
        expect($('#' + e.id).find('.title').text()).toEqual('some title');
        done();
      });

      var flagCallback = function(){};
      flagCallback._id = 'abc123';
      new FlagModule.create.constructor({
        type: 'success',
        title: 'some title',
        body: 'the body'
      }, flagCallback);

    });
  });

  describe('close', () => {
    it('should close the flag', () =>{
      var flagCallback = function(){};
      flagCallback._id = 'abc1234';
      var flag = new FlagModule.create.constructor({
        type: 'success',
        title: 'some title',
        body: 'the body'
      }, flagCallback);
      expect($('.aui-flag').attr('aria-hidden')).toEqual('false');
      flag.close();
      expect($('.aui-flag').attr('aria-hidden')).toEqual('true');
    });
  });

  describe('on close', () => {
    it('should set an event hanler', () => {
      var flagCallback = function(){};
      flagCallback._id = 'abc1234';
      var flag = new FlagModule.create.constructor({
        type: 'success',
        title: 'some title',
        body: 'the body'
      }, flagCallback);
      var spy = jasmine.createSpy('spy');
      flag.on('close', spy);
      expect(spy).not.toHaveBeenCalled();
      flag.close();
      expect(spy).toHaveBeenCalled();
    });
  });

});