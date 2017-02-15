/**
* Flags are the primary method for providing system feedback in the product user interface. Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
* @module Flag
*/

import $ from '../dollar';
import EventDispatcher from '../dispatchers/event_dispatcher';
import FlagActions from '../actions/flag_actions';
import FlagComponent from '../components/flag';
import _ from '../underscore';
import EventActions from '../actions/event_actions';

const _flags = {};

/**
* @class Flag~Flag
* @description A flag object created by the [AP.flag]{@link module:Flag} module.
*/
class Flag {
  constructor(options, callback) {
    callback = _.last(arguments);
    if(typeof options !== 'object') {
      return;
    }
    this.flag = FlagComponent.render({
      type: options.type,
      title: options.title,
      body: AJS.escapeHtml(options.body),
      actions: options.actions,
      close: options.close,
      id: callback._id
    });

    FlagActions.open(this.flag.attr('id'));

    this.onTriggers= {};
    this.extension = callback._context.extension;
    _flags[this.flag.attr('id')] = this;
  }

  /**
  * @name on
  * @memberof Flag~Flag
  * @method
  * @description Binds a callback function to an event that is triggered by the Flag.
  * @param {Event} event A flag event; currently, the only valid option is 'close'.
  * @param {Function} callback The function that runs when the event occurs.
  * @example
  * // Display a nice green flag using the Flags JavaScript API.
  * var flag = AP.flag.create({
  *   title: 'Successfully created a flag.',
  *   body: 'This is a flag.',
  *   type: 'info',
  *   actions: {'key': 'click me'}
  * });
  *
  * // Log a message to the console when the flag has closed.
  * flag.on('close', function (data) {
  *   console.log('Flag has been closed!');
  * })
  *
  */
  on(event, callback) {
    const id = this.flag.id;
    if ($.isFunction(callback)) {
      this.onTriggers[event] = callback;
    }
  }

  /**
  * @name close
  * @memberof Flag~Flag
  * @method
  * @description Closes the Flag.
  * @example
  * // Display a nice green flag using the Flags JavaScript API.
  * var flag = AP.flag.create({
  *   title: 'Successfully created a flag.',
  *   body: 'This is a flag.',
  *   type: 'info'
  * });
  *
  * // Close the flag.
  * flag.close()
  *
  */
  close() {
    this.flag.close();
  }
}

function invokeTrigger(id, eventName) {
  if (_flags[id] && $.isFunction(_flags[id].onTriggers[eventName])) {
    _flags[id].onTriggers[eventName]();
  }
}

EventDispatcher.register('flag-closed', (data) => {
  invokeTrigger(data.id, 'close');
  if (_flags[data.id]) {
    delete _flags[data.id];
  }
});
EventDispatcher.register('flag-action-invoked', (data) => {
  invokeTrigger(data.id, data.actionId);
});


// EventDispatcher.register('flag-action-invoked', (data) => {
//   console.log('module FLAG ACTION INVOKED', data, _flags[data.id], _flags);
//   if (_flags[data.id] && _flags[data.id].extension) {
//     var eventData = {
//       flag: data.cleanFlagId,
//       action: data.actionId
//     };
//     var extension = _flags[data.id].extension;

//     EventActions.broadcast('flag-action', {
//       extension_id: extension.extesion_id
//     }, eventData);
//   }
// });

export default {
  /**
  * @name create
  * @method
  * @description Creates a new flag.
  * @param {Object} options           Options of the flag.
  * @param {String} options.title     The title text of the flag.
  * @param {String} options.body      The body text of the flag.
  * @param {String} options.type=info Sets the type of the message. Valid options are "info", "success", "warning" and "error".
  * @param {String} options.close     The closing behaviour that this flag has. Valid options are "manual", "auto" and "never".
  * @returns {Flag~Flag}
  * @example
  * // Display a nice green flag using the Flags JavaScript API.
  * var flag = AP.flag.create({
  *   title: 'Successfully created a flag.',
  *   body: 'This is a flag.',
  *   type: 'success'
  * });
  */
  create: {
    constructor: Flag,
    on: Flag.prototype.on,
    close: Flag.prototype.close
  }
}
