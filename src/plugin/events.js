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
    this.methods = ['off', 'offAll', 'offAny', 'on', 'onPublic', 'onAny', 'once'];
    if(AP._data && AP._data.origin) {
      AP.registerAny(this._anyListener.bind(this));
    }
  }

  _anyListener(data, callback){
    var isPublicEvent = callback._context.isPublicEvent;
    var eventName = callback._context.eventName;
    var any = this._events[this.ANY_PREFIX] || [];
    var byName = this._events[eventName] || [];

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

      if (isPublicEvent === handler.isPublicEvent) {
        handler.listener.apply(null, args);
      }
    });

    byName.forEach((handler) => {
      var passesFilter = (typeof handler.filterFunc === 'function') ?
        handler.filterFunc.call(null, callback._context) : true;

      if (isPublicEvent === handler.isPublicEvent && passesFilter) {
        handler.listener.apply(null, data);
      }
    });
  }

  off(name, listener){
    if (this._events[name]) {
      for (var i = 0; i < this._events[name].length; i++) {
        var registration = this._events[name][i];
        if (registration.listener === listener) {
          this._events[name].splice(i, 1);
        }
      }
      if(this._events[name].length === 0) {
        delete this._events[name];
      }
    }
  }

  offAll(name){
    delete this._events[name];
  }

  offAny(listener){
    this.off(this.ANY_PREFIX, listener);
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

  once(name, listener){
    var _that = this;
    function runOnce() {
      listener.apply(null, arguments);
      _that.off(name, runOnce);
    }
    this.on(name, runOnce);
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
   * Adds a listener for all occurrences of any event, regardless of name.
   * Listener arguments begin with the event name, followed by any arguments passed to `events.emit`, followed by an object describing the complete event information.
   * @name onAny
   * @method
   * @memberof module:Events#
   * @param {Function} listener A listener callback to subscribe for any event name
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
   * The events emitted by this method can be received by iframes that defined by other add-ons on the page.
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