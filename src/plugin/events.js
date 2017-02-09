import AP from 'simple-xdm/combined';

/**
 * The Events module provides a mechanism for emitting and receiving events.<br>
 *
 * A event emitted by `emit` method will only be received by the modules defined in the same add-on.<br>
 * Public events that emitted by `emitPublic` are used for cross add-on communication.
 * They can be received by any add-on modules that are currently presented on the page.
 *
 * <h3>Basic example</h3>
 * Add-on A:
 * ```
 * // The following will create an alert message every time the event `customEvent` is triggered.
 * AP.events.on('customEvent', function(){
 *   alert('event fired');
 * });
 *
 *
 * AP.events.emit('customEvent');
 * AP.events.emitPublic('customPublicEvent');
 * ```
 *
 *
 * Add-on B:
 * ```
 * // The following will create an alert message every time the event `customPublicEvent` is triggered by add-on A.
 * AP.events.onPublic('customPublicEvent', function(){
 *   alert('public event fired');
 * });
 * ```
 *
 * @name Events
 * @module
 */

class Events {
  constructor(){
    this._events = {};
    this.ANY_PREFIX = '_any';
    this.methods = ['off', 'offAll', 'offAny', 'on', 'onAny', 'once'];
  }

  _anyListener(data, callback){
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
      handler.apply(null, args);
    });

    byName.forEach((handler) => {
      handler.apply(null, data);
    });
  }

  off(name, listener){
    if (this._events[name]) {
      var index = this._events[name].indexOf(listener);
      if (index > -1) {
        this._events[name].splice(index, 1);
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
    if(!this._events[name]){
      this._events[name] = [];
    }
    this._events[name].push(listener);
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
   * Adds a listener for all occurrences of an event of a particular name.<br>
   * Listener arguments include any arguments passed to `events.emit`, followed by an object describing the complete event information.
   * @name on
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to subscribe the listener to
   * @param {Function} listener A listener callback to subscribe to the event name
   */

  /**
   * Adds a listener for all occurrences of a public event of a particular name.<br>
   * Listener arguments include any arguments passed to `events.emitPublic`, followed by an object describing the complete event information.<br>
   * Event emitter's information will be passed to the first argument of the filter function. The listener callback will only be called when filter function returns `true`.
   * @name onPublic
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to subscribe the listener to
   * @param {Function} listener A listener callback to subscribe to the event name
   * @param {Function} [filter] A filter function to filter the events. Callback will always be called when a matching event occurs if the filter is unspecified
   */

  /**
   * Adds a listener for one occurrence of an event of a particular name.<br>
   * Listener arguments include any argument passed to `events.emit`, followed by an object describing the complete event information.
   * @name once
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to subscribe the listener to
   * @param {Function} listener A listener callback to subscribe to the event name
   */

  /**
   * Adds a listener for one occurrence of a public event of a particular name.<br>
   * Listener arguments include any argument passed to `events.emit`, followed by an object describing the complete event information.<br>
   * Event emitter's information will be passed to the first argument of the filter function. The listener callback will only be called when filter function returns `true`.
   * @name oncePublic
   * @method
   * @memberof module:Events#
   * @param {String} name The event name to subscribe the listener to
   * @param {Function}listener A listener callback to subscribe to the event name
   * @param {Function} [filter] A filter function to filter the events. Callback will always be called when a matching event occurs if the filter is unspecified
   */

  /**
   * Adds a listener for all occurrences of any event, regardless of name.<br>
   * Listener arguments begin with the event name, followed by any arguments passed to `events.emit`, followed by an object describing the complete event information.
   * @name onAny
   * @method
   * @memberof module:Events#
   * @param {Function} listener A listener callback to subscribe for any event name
   */

  /**
   * Adds a listener for all occurrences of any event, regardless of name.<br>
   * Listener arguments begin with the event name, followed by any arguments passed to `events.emit`, followed by an object describing the complete event information.<br>
   * Event emitter's information will be passed to the first argument of the filter function. The listener callback will only be called when filter function returns `true`.
   * @name onAnyPublic
   * @method
   * @memberof module:Events#
   * @param {Function} listener A listener callback to subscribe for any event name
   * @param {Function} [filter] A filter function to filter the events. Callback will always be called when a matching event occurs if the filter is unspecified
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
   * Removes all listeners from a public event name, or unsubscribes all event-name-specific listeners for public events
   * if no name if given.
   * @name offAllPublic
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
   * Removes an `anyPublic` event listener.
   * @name offAnyPublic
   * @method
   * @memberof module:Events#
   * @param {Function} listener A listener callback to unsubscribe from any event name
   */

  /**
   * Emits an event on this bus, firing listeners by name as well as all 'any' listeners.<br>
   * Arguments following the name parameter are captured and passed to listeners.
   * @name emit
   * @method
   * @memberof module:Events#
   * @param {String} name The name of event to emit
   * @param {String[]} args 0 or more additional data arguments to deliver with the event
   */

  /**
   * Emits a public event on this bus, firing listeners by name as well as all 'anyPublic' listeners.<br>
   * The event can be received by any add-on modules that are currently presented on the page.<br>
   * Arguments following the name parameter are captured and passed to listeners.
   * @name emitPublic
   * @method
   * @memberof module:Events#
   * @param {String} name The name of event to emit
   * @param {String[]} args 0 or more additional data arguments to deliver with the event
   */
}

export default Events;