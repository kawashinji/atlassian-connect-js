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
* @example
* // complete flag API example:
* var flag = AP.flag.create({
*   title: 'Successfully created a flag.',
*   body: 'This is a flag.',
*   type: 'info',
*   actions: {
*     'actionOne': 'action name'
*   }
* });
* // Each flag will have a unique id. Save it for later.
* var ourFlagId = flag._id;
* // listen to flag events
* AP.events.on('flag-closed', function(data) {
* // a flag was closed. data.flagIdentifier should match ourFlagId
*   console.log('flag id: ', data.flagIdentifier);
* });
* AP.events.on('flag-action-invoked', function(data) {
* // a flag action was clicked. data.actionIdentifier will be 'actionOne'
* // data.flagIdentifier will equal ourFlagId
*   console.log('flag id: ', data.flagIdentifier, 'flag action id', data.actionIdentifier);
* });
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
    _flags[callback._id] = this;
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

function invokeTrigger(id, eventName, data) {
  if (_flags[id]) {
    let extension = _flags[id].extension;
    data = data || {};
    data.flagIdentifier = id;
    EventActions.broadcast(eventName, {
      extension_id: extension.extension_id
    }, data);
  }
}

EventDispatcher.register('flag-closed', (data) => {
  invokeTrigger(data.id, 'flag-closed');
  if (_flags[data.id]) {
    delete _flags[data.id];
  }
});

EventDispatcher.register('flag-action-invoked', (data) => {
  invokeTrigger(data.id, 'flag-action-invoked', {actionIdentifier: data.actionId});
});

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
    close: Flag.prototype.close
  }
}
