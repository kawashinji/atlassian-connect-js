import $ from './dollar';
/**
 * The Events module provides a mechanism for emitting and receiving events.
 * <h3>Basic example</h3>
 * ```
 * //The following will create an alert message every time the event `customEvent` is triggered.
 * AP.require('events', function(events){
*   events.on('customEvent', function(){
*       alert('event fired');
*   });
*   events.emit('customEvent');
* });
 * ```
 * @name Events
 * @module
 */
var events = {};
const ANY_PREFIX = '_any';
if(window.AP && window.AP.register){
  window.AP.register({
    _any: function(data, callback){
      var eventName = callback._context.eventName;
      var any = events[ANY_PREFIX] || [];
      var byName = events[eventName] || [];

      any.forEach((handler) => {
        //clone data before modifying
        var args = [];
        if(data) {
          if(data.slice){
            args = data.slice(0);
          }
        }

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
  });
}

export default {
  off: function(name, listener){
    var index = events[name].indexOf(listener);
    events[name].splice(index, 1);
  },
  offAll: function(name){
    delete events[name];
  },
  offAny: function(listener){
    this.off(ANY_PREFIX, listener);
  },
  on: function(name, listener){
    if(!events[name]){
      events[name] = [];
    }
    events[name].push(listener);
  },
  onAny: function(listener){
    this.on(ANY_PREFIX, listener);
  },
  once: function(name, listener){
    this.on(name, function(){
      listener.call(null, arguments);
      this.off(name, listener);
    });
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
};

