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
    expect(events._events['something'][0].listener).toEqual(spy);
    expect(events._events['something'][0].isPublicEvent).toEqual(false);
    expect(events._events['something'][0].filterFunc).toEqual(null);
  });

  it('onPublic binds an public event', function(){
    var spy = jasmine.createSpy('spy');
    var filterSpy = jasmine.createSpy('filter');
    events.onPublic('something', spy, filterSpy);
    expect(events._events['something'][0].listener).toEqual(spy);
    expect(events._events['something'][0].isPublicEvent).toEqual(true);
    expect(events._events['something'][0].filterFunc).toEqual(filterSpy);
  });

  it('off unbinds an event', function(){
    var spy = jasmine.createSpy('spy');
    events.on('something', spy);
    events.off('something', spy);
    expect(events._events['something']).toEqual(undefined);
  });

  it('offPublic unbinds a public event', function(){
    var spy = jasmine.createSpy('spy');
    events.onPublic('something', spy);
    events.offPublic('something', spy);
    expect(events._events['something']).toEqual(undefined);
  });

  it('once only emits the event once', function(){
    var spy = jasmine.createSpy('spy');
    var eventName = 'zxy';
    expect(events._events[eventName]).toEqual(undefined);
    events.once(eventName, spy);
    expect(events._events[eventName].length).toEqual(1);
    expect(events._events[eventName][0].isPublicEvent).toEqual(false);
    expect(events._events[eventName][0].filterFunc).toEqual(null);
    events._events[eventName][0].listener.apply(null, {});
    expect(events._events[eventName]).toEqual(undefined);
    expect(spy).toHaveBeenCalled();
  });

  it('oncePublic only emits the public event once', function(){
    var spy = jasmine.createSpy('spy');
    var filterSpy = jasmine.createSpy('filter');
    var eventName = 'zxy';
    expect(events._events[eventName]).toEqual(undefined);
    events.oncePublic(eventName, spy, filterSpy);
    expect(events._events[eventName].length).toEqual(1);
    expect(events._events[eventName][0].isPublicEvent).toEqual(true);
    expect(events._events[eventName][0].filterFunc).toEqual(filterSpy);
    events._events[eventName][0].listener.apply(null, {});

    expect(events._events[eventName]).toEqual(undefined);
    expect(spy).toHaveBeenCalled();
  });

  it('onAny binds on to any non-public trigger', function(){
    var spy = jasmine.createSpy('spy');
    expect(events._events[events.ANY_PREFIX]).toEqual(undefined);
    events.onAny(spy);
    expect(events._events[events.ANY_PREFIX][0].listener).toEqual(spy);
    expect(events._events[events.ANY_PREFIX][0].isPublicEvent).toEqual(false);
  });

  it('offAny binds on to any non-public trigger', function(){
    var spy = jasmine.createSpy('spy');
    expect(events._events[events.ANY_PREFIX]).toEqual(undefined);
    events.onAny(spy);
    events.offAny(spy);
    expect(Object.keys(events._events).length).toEqual(0);
  });

  it('onAnyPublic binds on to any public trigger', function(){
    var spy = jasmine.createSpy('spy');
    expect(events._events[events.ANY_PREFIX]).toEqual(undefined);
    events.onAnyPublic(spy);
    expect(events._events[events.ANY_PREFIX][0].listener).toEqual(spy);
    expect(events._events[events.ANY_PREFIX][0].isPublicEvent).toEqual(true);
  });

  it('offAnyPublic binds on to any public trigger', function(){
    var spy = jasmine.createSpy('spy');
    expect(events._events[events.ANY_PREFIX]).toEqual(undefined);
    events.onAnyPublic(spy);
    events.offAnyPublic(spy);
    expect(Object.keys(events._events).length).toEqual(0);
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

  it('offAll unbinds all public events with the specified name', function(){
    var eventName = 'abc123';
    expect(events._events[eventName]).toEqual(undefined);
    events.onPublic(eventName, jasmine.createSpy('spy'));
    events.onPublic(eventName, jasmine.createSpy('spy'));
    expect(events._events[eventName].length).toEqual(2);
    events.offAll(eventName);
    expect(events._events[eventName]).toEqual(undefined);
  });

});