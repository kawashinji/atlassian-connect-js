import AP from 'simple-xdm/combined';

/**
 * The Events module provides a mechanism for emitting and receiving events.
 * <h3>Basic example</h3>
 * ```
 * //The following will create an alert message every time the event `customEvent` is triggered.
 * AP.events.on('customEvent', function(){
 *   alert('event fired');
 * });
 * AP.events.emit('customEvent');
 * ```
 * @name Events
 * @module
 */

class Events {
  constructor(){
    this._events = {};
    this.ANY_PREFIX = '_any';
    this.methods = ['off', 'offPublic', 'offAll', 'offAny', 'offAnyPublic', 'on', 'onPublic', 'onAny', 'onAnyPublic', 'once'];
    if(AP._data && AP._data.origin) {
      AP.registerAny(this._anyListener.bind(this));
    }
  }

  _anyListener(data, callback){
    var eventName = callback._context.eventName;
    var any = this._events[this.ANY_PREFIX] || [];
    var byName = this._events[eventName] || [];
    var context = data.context;

    data = data.event;
    if(!Array.isArray(data)){
      data = [data];
    }

    any.forEach((handler) => {
      //clone data before modifying
      var args = data.slice(0);
      args.unshift(eventName);
      args.push({
        args: data,
        name: eventName
      });

      if (context.isPublicEvent === handler.isPublicEvent) {
        handler.listener.apply(null, args);
      }
    });

    byName.forEach((handler) => {
      var passesFilter = (typeof handler.filterFunc === 'function') ?
        handler.filterFunc.call(null, context) : true;

      if (context.isPublicEvent === handler.isPublicEvent && passesFilter) {
        handler.listener.apply(null, data);
      }
    });
  }

  _off(name, listener, isPublicEvent){
    if (this._events[name]) {
      for (var i = 0; i < this._events[name].length; i++) {
        var registration = this._events[name][i];
        if (registration.listener === listener && registration.isPublicEvent === isPublicEvent) {
          this._events[name].splice(i, 1);
        }
      }
      if(this._events[name].length === 0) {
        delete this._events[name];
      }
    }
  }

  off(name, listener){
    this._off(name, listener, false);
  }

  offPublic(name, listener){
    this._off(name, listener, true);
  }

  offAll(name){
    delete this._events[name];
  }

  offAny(listener){
    this.off(this.ANY_PREFIX, listener, false);
  }

  offAnyPublic(listener){
    this.off(this.ANY_PREFIX, listener, true);
  }

  on(name, listener){
    this._registerListener(name, listener, null, false);
  }

  onPublic(name, listener, filterFunc){
    this._registerListener(name, listener, filterFunc, true);
  }

  _registerListener(name, listener, filterFunc, isPublicEvent){
    if(!this._events[name]){
      this._events[name] = [];
    }
    this._events[name].push({filterFunc, listener, isPublicEvent});
  }

  onAny(listener){
    this.on(this.ANY_PREFIX, listener);
  }

  onAnyPublic(listener, filterFunc){
    this.onPublic(this.ANY_PREFIX, listener, filterFunc);
  }

  once(name, listener){
    this._once(name, listener, null, false);
  }

  oncePublic(name, listener, filterFunc) {
    this._once(name, listener, filterFunc, true);
  }

  _once(name, listener, filterFunc, isPublicEvent){
    var _that = this;
    function runOnce() {
      listener.apply(null, arguments);
      _that._off(name, runOnce, isPublicEvent);
    }
    if (isPublicEvent) {
      this.onPublic(name, runOnce, filterFunc);
    } else {
      this.on(name, runOnce);
    }
  }

  /**
   * Adds a listener for all occurrences of an event of a particular name.
   * Listener arguments include any arguments passed to `events.emit`, followed by an object describing the complete event information.
   * @name on
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to subscribe the listener to
   * @param {Function} listener A listener callback to subscribe to the event name
   */

  /**
   * Adds a listener for all occurrences of a public event of a particular name.
   * Listener arguments include any arguments passed to `events.emitPublic`, followed by an object describing the complete event information.
   * Filter function will receive one argument that contains the event publisher's information.
   * @name onPublic
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to subscribe the listener to
   * @param {Function} listener A listener callback to subscribe to the event name
   * @param {Function} filter (Optional) A function to filter the events. If it is specified, `listener`
   * will only be invoked when the function returns `true`
   */

  /**
   * Adds a listener for one occurrence of an event of a particular name.
   * Listener arguments include any argument passed to `events.emit`, followed by an object describing the complete event information.
   * @name once
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to subscribe the listener to
   * @param {Function}listener A listener callback to subscribe to the event name
   */

  /**
   * Adds a listener for one occurrence of a public event of a particular name.
   * Listener arguments include any argument passed to `events.emitPublic`, followed by an object describing the complete event information.
   * Filter function will receive one argument that contains the event publisher's information.
   * @name oncePublic
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to subscribe the listener to
   * @param {Function} listener A listener callback to subscribe to the event name
   * @param {Function} filter (Optional) A function to filter the events. If it is specified, `listener`
   * will only be invoked when the function returns `true`
   */

  /**
   * Adds a listener for all occurrences of any event, regardless of name.
   * Listener arguments begin with the event name, followed by any arguments passed to `events.emit`, followed by an object describing the complete event information.
   * @name onAny
   * @method
   * @memberof module:Events#
   * @param {Function} listener A listener callback to subscribe for any event name
   */

  /**
   * Adds a listener for all occurrences of any public event, regardless of name.
   * Listener arguments include any arguments passed to `events.emitPublic`, followed by an object describing the complete event information.
   * Filter function will receive one argument that contains the event publisher's information.
   * @name onAnyPublic
   * @method
   * @memberof module:Events#
   * @param {Function} listener A listener callback to subscribe for any event name
   * @param {Function} filter (Optional) A function to filter the events. If it is specified, `listener`
   * will only be invoked when the function returns `true`
   */

  /**
   * Removes a particular listener for an event.
   * @name off
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to unsubscribe the listener from
   * @param {Function} listener The listener callback to unsubscribe from the event name
   */

  /**
   * Removes a particular listener for a public event.
   * @name offPublic
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to unsubscribe the listener from
   * @param {Function} listener The listener callback to unsubscribe from the event name
   */

  /**
   * Removes all listeners from an event name, or unsubscribes all event-name-specific listeners
   * if no name if given.
   * @name offAll
   * @method
   * @memberof module:Events#
   * @param {String} [name] The event name to unsubscribe all listeners from
   */

  /**
   * Removes an `any` event listener.
   * @name offAny
   * @method
   * @memberof module:Events#
   * @param {Function} listener A listener callback to unsubscribe from any event name
   */

  /**
   * Removes a public `any` event listener.
   * @name offAnyPublic
   * @method
   * @memberof module:Events#
   * @param {Function} listener A listener callback to unsubscribe from any event name
   */

  /**
   * Emits an event on this bus, firing listeners by name as well as all 'any' listeners. Arguments following the
   * name parameter are captured and passed to listeners.
   * @name emit
   * @method
   * @memberof module:Events#
   * @param {String} name The name of event to emit
   * @param {String[]} args 0 or more additional data arguments to deliver with the event
   */

  /**
   * Emits a public event on this bus, firing listeners registered by `events.onPublic` by name.
   * The events emitted by this method can be received by iframes that created by other modules or add-ons on the page.
   * Arguments following the targets parameter are captured and passed to listeners.
   * @name emitPublic
   * @method
   * @memberof module:Events#
   * @param {String} name The name of event to emit
   * @param {Events~EventTarget[]} targets Array of option object that the event will be broadcast to. Empty array means
   * broadcast the event to all the add-ons on the page.
   * @param {String[]} args 0 or more additional data arguments to deliver with the event
   */

  /**
   * Event target
   *
   * @class Events~EventTarget
   * @property addonKey Key of the add-on that a event will be broadcast to
   */
}

export default new Events();