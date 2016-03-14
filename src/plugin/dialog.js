import util from './util';

const getCustomData = util.deprecateApi(() => {
  return AP._data.options.customData;
}, 'AP.dialog.customData', 'AP.dialog.getCustomData()', '5.0');


Object.defineProperty(AP._hostModules.dialog, 'customData', {
  get: getCustomData
});
Object.defineProperty(AP.dialog, 'customData', {
  get: getCustomData
});

const dialogHandlers = {};

AP.register({
  _any: (data, callback) => {
    let dialogEventMatch = callback._context.eventName.match(/^dialog\.(\w+)$/);
    if (dialogEventMatch) {
      let handlers = dialogHandlers[dialogEventMatch[1]];
      if (handlers) {
        handlers.forEach(cb => cb(data));
      } else if (dialogEventMatch !== 'dialog.close') {
        AP.dialog.close();
      }
    }
  }
});

function registerHandler(event, callback) {
  if ($.isFunction(callback)) {
    if (!dialogHandlers[event]) {
      dialogHandlers[event] = [];
    }
    dialogHandlers[event].push(callback);
  }
}

const original_dialogCreate = AP._hostModules.dialog.create;

AP.dialog.create = AP._hostModules.dialog.create = (...args) => {
  const dialog = original_dialogCreate(...args);
  dialog.on = util.deprecateApi(registerHandler,
    'AP.dialog.on("close", callback)', 'AP.events.on("dialog.close", callback)', '5.0');
  return dialog;
};

const original_dialogGetButton = AP._hostModules.dialog.getButton;

AP.dialog.getButton = AP._hostModules.dialog.getButton = (...args) => {
  const button = original_dialogGetButton(...args);
  const name = args[0];
  button.bind = util.deprecateApi((callback) => registerHandler(name, callback),
    'AP.dialog.getDialogButton().bind()', 'AP.events.on("dialog.message", callback)', '5.0');
  return button;
};

AP.dialog.onDialogMessage = AP._hostModules.dialog.onDialogMessage = util.deprecateApi(registerHandler,
  'AP.dialog.onDialogMessage()', 'AP.events.on("dialog.message", callback)', '0.5');
