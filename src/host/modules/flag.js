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
import Providers from '../providers';

const _flags = {};

/**
* @class Flag~Flag
* @description A flag object created by the [AP.flag]{@link module:Flag} module.
* @example
* // complete flag API example:
* var outFlagId;
* var flag = AP.flag.create({
*   title: 'Successfully created a flag.',
*   body: 'This is a flag.',
*   type: 'info',
*   actions: {
*     'actionOne': 'action name'
*   }
* }, function(identifier) {
* // Each flag will have a unique id. Save it for later.
*   ourFlagId = identifier;
* });
*
* // listen to flag events
* AP.events.on('flag.close', function(data) {
* // a flag was closed. data.flagIdentifier should match ourFlagId
*   console.log('flag id: ', data.flagIdentifier);
* });
* AP.events.on('flag.action', function(data) {
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
    const flagId = callback._id;
    this.flagProvider = Providers.getProvider('flag');
    if (this.flagProvider) {
      let actions = [];
      if (typeof options.actions === 'object') {
        actions = _.map(options.actions, (value, key) => ({
          content: value,
          onClick: FlagActions.actionInvoked.bind(null, key, flagId)
        }));
      }
      let type = options.type || 'info';
      let flagOptions = {
        id: flagId,
        key: flagId,
        title: options.title,
        description: options.body,
        actions: actions,
        onClose: FlagActions.closed,
        type: type.toLowerCase()
      };
      this.flagProvider.create(flagOptions);
    } else {
      this.flag = FlagComponent.render({
        type: options.type,
        title: options.title,
        body: AJS.escapeHtml(options.body),
        actions: options.actions,
        close: options.close,
        id: flagId
      });
    }

    FlagActions.open(this.flag.attr('id'));

    this.onTriggers= {};
    this.extension = callback._context.extension;
    _flags[callback._id] = this;
    callback.call(null, callback._id);
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
    const callback = _.last(arguments);
    const flagId = callback._id;
    if (this.flagProvider) {
      this.flagProvider.close(flagId);
    } else {
      this.flag.close();
    }
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
  invokeTrigger(data.id, 'flag.close');
  if (_flags[data.id]) {
    delete _flags[data.id];
  }
});

EventDispatcher.register('flag-action-invoked', (data) => {
  invokeTrigger(data.id, 'flag.action', {actionIdentifier: data.actionId});
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
  * @param {Object} options.actions           Map of {actionIdentifier: 'Action link text'} to add to the flag. The actionIdentifier will be passed to a 'flag.action' event if the link is clicked.
  * @returns {Flag~Flag}
  * @example
  * // Display a nice green flag using the Flags JavaScript API.
  * var flag = AP.flag.create({
  *   title: 'Successfully created a flag.',
  *   body: 'This is a flag.',
  *   type: 'success',
  *   actions: {
  *     'actionkey': 'Click me'
  *   }
  * });
  */
  create: {
    constructor: Flag,
    close: Flag.prototype.close
  }
}
