import AP from 'simple-xdm/plugin';
AP._data.origin = '*'; // prevent AP._registerOnUnload() from failing

import events from 'src/plugin/events';

describe('Plugin events shim', function(){
  beforeEach(function(){
    events._events = {};
  });
  it('on binds an event', function(){
    var spy = jasmine.createSpy('spy');
    events.on('something', spy);
    expect(events._events['something'][0]).toEqual(spy);
  });

  it('off unbinds an event', function(){
    var spy = jasmine.createSpy('spy');
    events.on('something', spy);
    events.off('something', spy);
    expect(events._events['something']).toEqual(undefined);
  });

  it('once only emits the event once', function(){
    var spy = jasmine.createSpy('spy');
    var eventName = 'zxy';
    expect(events._events[eventName]).toEqual(undefined);
    events.once(eventName, spy);
    expect(events._events[eventName].length).toEqual(1);
    events._events[eventName][0].apply(null, {});
    expect(events._events[eventName]).toEqual(undefined);
    expect(spy).toHaveBeenCalled();
  });

  it('onAny binds on to any trigger', function(){
    var spy = jasmine.createSpy('spy');
    expect(events._events[events.ANY_PREFIX]).not.toContain(spy);
    events.onAny(spy);
    expect(events._events[events.ANY_PREFIX]).toContain(spy);
  });

  it('offAll unbinds all events with the specified name', function(){
    var eventName = 'abc123';
    expect(events._events[eventName]).toEqual(undefined);
    events.on(eventName, jasmine.createSpy('spy'));
    events.on(eventName, jasmine.createSpy('spy'));
    expect(events._events[eventName].length).toEqual(2);
    events.offAll(eventName);
    expect(events._events[eventName]).toEqual(undefined);
  });

});