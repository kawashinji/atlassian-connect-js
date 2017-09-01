import AP from 'simple-xdm/combined';
import deprecate from './deprecate';
import EventsInstance from './events-instance';

let customButtonIncrement = 1;

const getCustomData = deprecate(() => {
  return AP._data.options.customData;
}, 'AP.dialog.customData', 'AP.dialog.getCustomData()', '5.0');

if(AP._hostModules && AP._hostModules.dialog) {
  /**
   * Returns the custom data Object passed to the dialog at creation.
   * @noDemo
   * @deprecated after August 2017 | Please use <code>dialog.getCustomData(callback)</code> instead.
   * @name customData
   * @memberOf module:Dialog
   * @example
   * var myDataVariable = AP.dialog.customData.myDataVariable;
   *
   * @return {Object} Data Object passed to the dialog on creation.
   */
  Object.defineProperty(AP._hostModules.dialog, 'customData', {
    get: getCustomData
  });
  Object.defineProperty(AP.dialog, 'customData', {
    get: getCustomData
  });

  AP.dialog._disableCloseOnSubmit = false;
  AP.dialog.disableCloseOnSubmit = function(){
    AP.dialog._disableCloseOnSubmit = true;
  }

}

const dialogHandlers = {};

EventsInstance.onAny(eventDelegator);
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
  var context = null;
  // ignore events that are triggered by button clicks
  // allow dialog.close through for close on ESC
  if (shouldClose && typeof args.button === 'undefined') {
    return;
  }
  if(args && args.button && args.button.name) {
    context = AP.dialog.getButton(args.button.name);
  }

  // if the submit button has been set to not close on click
  if(name === 'submit' && AP.dialog._disableCloseOnSubmit) {
    shouldClose = false;
  }

  try {
    if (handlers) {
      shouldClose = handlers.reduce((result, cb) => cb.call(context, args) && result, shouldClose);
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

if(AP.dialog && AP.dialog.create) {
  const original_dialogCreate = AP.dialog.create.prototype.constructor.bind({});

  AP.dialog.create = AP._hostModules.dialog.create = (...args) => {
    const dialog = original_dialogCreate(...args);
    /**
     * Allows the add-on to register a callback function for the given event. The listener is only called once and must be re-registered if needed.
     * @deprecated after August 2017 | Please use <code>AP.events.on("dialog.close", callback)</code> instead.
     * @memberOf Dialog~Dialog
     * @method on
     * @param {String} event name of the event to listen for, such as 'close'.
     * @param {Function} callback function to receive the event callback.
     * @noDemo
     * @example
     * AP.dialog.create(opts).on("close", callbackFunc);
     */
    dialog.on = deprecate(registerHandler,
      'AP.dialog.on("close", callback)', 'AP.events.on("dialog.close", callback)', '5.0');
    return dialog;
  };
}

if(AP.dialog && AP.dialog.getButton) {
  let original_dialogGetButton = AP.dialog.getButton.prototype.constructor.bind({});

  AP.dialog.getButton = AP._hostModules.dialog.getButton = function(name) {
    try {
      const button = original_dialogGetButton(name);
      /**
       * Registers a function to be called when the button is clicked.
       * @deprecated after August 2017 | Please use <code>AP.events.on("dialog.message", callback)</code> instead.
       * @method bind
       * @memberOf Dialog~DialogButton
       * @param {Function} callback function to be triggered on click or programatically.
       * @noDemo
       * @example
       * AP.dialog.getButton('submit').bind(function(){
       *   alert('clicked!');
       * });
       */
      button.bind = deprecate((callback) => registerHandler(name, callback),
        'AP.dialog.getDialogButton().bind()', 'AP.events.on("dialog.message", callback)', '5.0');

      return button;
    } catch (e) {
      return {};
    }
  };
}

if(AP.dialog && AP.dialog.createButton) {
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
}

/**
 * Register callbacks responding to messages from the host dialog, such as "submit" or "cancel"
 * @deprecated after August 2017 | Please use <code>AP.events.on("dialog.message", callback)</code> instead.
 * @memberOf module:Dialog
 * @method onDialogMessage
 * @param {String} buttonName - button either "cancel" or "submit"
 * @param {Function} listener - callback function invoked when the requested button is pressed
 */
if(AP.dialog) {
  AP.dialog.onDialogMessage = AP._hostModules.dialog.onDialogMessage = deprecate(registerHandler,
    'AP.dialog.onDialogMessage()', 'AP.events.on("dialog.message", callback)', '5.0');
}

if(!AP.Dialog){
  AP.Dialog = AP._hostModules.Dialog = AP.dialog;
}