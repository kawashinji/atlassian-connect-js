import util from './util';
import events from './events';

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

events.onAny((name, args) => {
  let dialogEventMatch = name.match(/^dialog\.(\w+)$/);
  if (dialogEventMatch) {
    let dialogEvent = dialogEventMatch[1];
    let handlers = dialogHandlers[dialogEvent];
    let shouldClose = dialogEvent !== 'close';
    if (handlers) {
      shouldClose = shouldClose && handlers.every(cb => cb(args));
    }
    if (shouldClose) {
      AP.dialog.close();
    }
  }
});

function registerHandler(event, callback) {
  if (typeof callback === 'function') {
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
  try {
    const button = original_dialogGetButton(...args);
    const name = args[0];
    button.bind = util.deprecateApi((callback) => registerHandler(name, callback),
      'AP.dialog.getDialogButton().bind()', 'AP.events.on("dialog.message", callback)', '5.0');
    return button;
  } catch (e) {
    return {};
  }
};

AP.dialog.onDialogMessage = AP._hostModules.dialog.onDialogMessage = util.deprecateApi(registerHandler,
  'AP.dialog.onDialogMessage()', 'AP.events.on("dialog.message", callback)', '0.5');

if(!AP.Dialog){
  AP.Dialog = AP._hostModules.Dialog = AP.dialog;
}