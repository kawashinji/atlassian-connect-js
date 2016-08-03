import AP from 'simple-xdm/plugin';
import events from './events';
import deprecate from './deprecate';
let customButtonIncrement = 1;

const getCustomData = deprecate(() => {
  return AP._data.options.customData;
}, 'AP.dialog.customData', 'AP.dialog.getCustomData()', '5.0');


Object.defineProperty(AP._hostModules.dialog, 'customData', {
  get: getCustomData
});
Object.defineProperty(AP.dialog, 'customData', {
  get: getCustomData
});

const dialogHandlers = {};

events.onAny(eventDelegator);
function eventDelegator(name, args) {
  let dialogEventMatch = name.match(/^dialog\.(\w+)/);
  if(!dialogEventMatch) {
    return;
  }
  if(name === 'dialog.button.click') {
    customButtonEvent(args.button.identifier, args);
  } else {
    submitOrCancelEvent(dialogEventMatch[1], args);
  }
}

function customButtonEvent(buttonIdentifier, args) {
  var callbacks = dialogHandlers[buttonIdentifier];
  if(callbacks && callbacks.length !== 0){
    try{
      callbacks.forEach((callback) => {
        callback.call(null, args);
      });
    } catch (err) {
      console.error(err);
    }
  }
}

function submitOrCancelEvent(name, args) {
  let handlers = dialogHandlers[name];
  let shouldClose = name !== 'close';

  // ignore events that are triggered by button clicks
  // allow dialog.close through for close on ESC
  if (shouldClose && typeof args.button === 'undefined') {
    return;
  }

  try {
    if (handlers) {
      shouldClose = handlers.reduce((result, cb) => cb(args) && result, shouldClose);
    }
  } catch (err) {
    console.error(err);
  } finally {
    delete dialogHandlers[name];
  }
  if (shouldClose) {
    AP.dialog.close();
  }
}

function registerHandler(event, callback) {
  if (typeof callback === 'function') {
    if (!dialogHandlers[event]) {
      dialogHandlers[event] = [];
    }
    dialogHandlers[event].push(callback);
  }
}

const original_dialogCreate = AP.dialog.create.prototype.constructor.bind({});

AP.dialog.create = AP._hostModules.dialog.create = (...args) => {
  const dialog = original_dialogCreate(...args);
  /**
   * Allows the add-on to register a callback function for the given event. The listener is only called once and must be re-registered if needed.
   * @deprecated Please use `AP.events.on("dialog.close", callback)` instead.
   * @memberOf Dialog~Dialog
   * @method on
   * @param {String} event name of the event to listen for, such as 'close'.
   * @param {Function} callback function to receive the event callback.
   * @noDemo
   * @example
   * AP.require('dialog', function(dialog){
   *   dialog.create(opts).on("close", callbackFunc);
   * });
   */
  dialog.on = deprecate(registerHandler,
    'AP.dialog.on("close", callback)', 'AP.events.on("dialog.close", callback)', '5.0');
  return dialog;
};

let original_dialogGetButton = AP.dialog.getButton.prototype.constructor.bind({});

AP.dialog.getButton = AP._hostModules.dialog.getButton = function(name) {
  try {
    const button = original_dialogGetButton(name);
    /**
     * Registers a function to be called when the button is clicked.
     * @deprecated Please use `AP.events.on("dialog.message", callback)` instead.
     * @method bind
     * @memberOf Dialog~DialogButton
     * @param {Function} callback function to be triggered on click or programatically.
     * @noDemo
     * @example
     * AP.require('dialog', function(dialog){
     *   dialog.getButton('submit').bind(function(){
     *     alert('clicked!');
     *   });
     * });
     */
    button.bind = deprecate((callback) => registerHandler(name, callback),
      'AP.dialog.getDialogButton().bind()', 'AP.events.on("dialog.message", callback)', '5.0');

    return button;
  } catch (e) {
    return {};
  }
};

let original_dialogCreateButton = AP.dialog.createButton.prototype.constructor.bind({});

AP.dialog.createButton = AP._hostModules.dialog.createButton = function(options) {
  let buttonProperties = {};
  if(typeof options !== 'object') {
    buttonProperties.text = options;
    buttonProperties.identifier = options;
  } else {
    buttonProperties = options;
  }
  if(!buttonProperties.identifier) {
    buttonProperties.identifier = 'user.button.' + customButtonIncrement++;
  }
  let createButton = original_dialogCreateButton(buttonProperties);
  return AP.dialog.getButton(buttonProperties.identifier);
};

/**
 * Register callbacks responding to messages from the host dialog, such as "submit" or "cancel"
 * @deprecated Please use `AP.events.on("dialog.message", callback)` instead.
 * @memberOf module:Dialog
 * @method onDialogMessage
 * @param {String} buttonName - button either "cancel" or "submit"
 * @param {Function} listener - callback function invoked when the requested button is pressed
 */
AP.dialog.onDialogMessage = AP._hostModules.dialog.onDialogMessage = deprecate(registerHandler,
  'AP.dialog.onDialogMessage()', 'AP.events.on("dialog.message", callback)', '5.0');

if(!AP.Dialog){
  AP.Dialog = AP._hostModules.Dialog = AP.dialog;
}