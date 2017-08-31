import util from '../util';
import buttonUtils from './button';
import $ from '../dollar';
import AnalyticsDispatcher from '../dispatchers/analytics_dispatcher';

class DialogUtils {
  _maxDimension(val, maxPxVal){
    var parsed = util.stringToDimension(val);
    var parsedInt = parseInt(parsed, 10);
    var parsedMaxPxVal = parseInt(maxPxVal, 10);

    if ((parsed.indexOf('%') > -1 && parsedInt >= 100) // %
      || (parsedInt > parsedMaxPxVal)) { // px
      return '100%';
    }
    return parsed;
  }

  _closeOnEscape (options){
    if (options.closeOnEscape === false) {
      return false;
    } else {
      return true;
    }
  }

  _size (options){
    var size = options.size;
    if (options.size === 'x-large') {
      size = 'xlarge';
    }
    if (options.size !== 'maximum' && options.width === '100%' && options.height === '100%') {
      size = 'fullscreen';
    }
    return size;
  }

  _header(text){
    var headerText = '';
    switch(typeof text) {
    case 'string':
      headerText = text;
      break;

    case 'object':
      headerText = text.value;
      break;
    }

    return headerText;
  }

  _hint(text){
    if(typeof text === 'string'){
      return text;
    }
    return '';
  }

  _chrome(options){
    var returnval = false;
    if (typeof options.chrome === 'boolean') {
      returnval = options.chrome;
    }
    if(options.size === 'fullscreen') {
      returnval = true;
    }
    if(options.size === 'maximum') {
      returnval = false;
    }
    return returnval;
  }

  _width(options){
    if(options.size) {
      return undefined;
    }
    if(options.width) {
      return this._maxDimension(options.width, $(window).width());
    }
    return '50%';
  }

  _height(options){
    if(options.size) {
      return undefined;
    }
    if(options.height) {
      return this._maxDimension(options.height, $(window).height());
    }
    return '50%';
  }

  _actions(options){
    var sanitizedActions = [];
    options = options || {};
    if (!options.actions) {

      sanitizedActions = [
        {
          name: 'submit',
          identifier: 'submit',
          text: options.submitText || 'Submit',
          type: 'primary',
          disabled: true // disable submit button by default (until the dialog has loaded).
        },
        {
          name: 'cancel',
          identifier: 'cancel',
          text: options.cancelText || 'Cancel',
          type: 'link',
          immutable: true
        }
      ];
    }

    if(options.buttons) {
      sanitizedActions = sanitizedActions.concat(this._buttons(options));
    }

    return sanitizedActions;

  }

  _id(str){
    if(typeof str !== 'string'){
      str = Math.random().toString(36).substring(2, 8);
    }
    return str;
  }
  // user defined action buttons
  _buttons(options) {
    var buttons = [];
    if(options.buttons && Array.isArray(options.buttons)) {
      options.buttons.forEach((button) => {
        var text;
        var identifier;
        var disabled = false;
        if(button.text && typeof button.text === 'string') {
          text = button.text;
        }
        if(button.identifier && typeof button.identifier === 'string') {
          identifier = button.identifier;
        } else {
          identifier = buttonUtils.randomIdentifier();
        }
        if(button.disabled && button.disabled === true) {
          disabled = true;
        }

        buttons.push({
          text: text,
          identifier: identifier,
          type: 'secondary',
          custom: true,
          disabled: disabled
        });
      });
    }
    return buttons;
  }

  sanitizeOptions(options){
    options = options || {};
    var sanitized = {
      chrome: this._chrome(options),
      header: this._header(options.header),
      hint: this._hint(options.hint),
      width: this._width(options),
      height: this._height(options),
      $content: options.$content,
      extension: options.extension,
      actions: this._actions(options),
      id: this._id(options.id),
      size: options.size,
      closeOnEscape: this._closeOnEscape(options)
    };
    sanitized.size = this._size(sanitized);

    return sanitized;
  }
  // such a bad idea! this entire concept needs rewriting in the p2 plugin.
  moduleOptionsFromGlobal(addon_key, key) {
    var defaultOptions = {
      chrome: true
    };

    if(window._AP
      && window._AP.dialogModules
      && window._AP.dialogModules[addon_key]
      && window._AP.dialogModules[addon_key][key]) {
      return util.extend({}, defaultOptions, window._AP.dialogModules[addon_key][key].options);
    }
    return false;
  }

  // determines information about dialogs that are about to open and are already open
  trackMultipleDialogOpening(dialogExtension, options) {
    // check for dialogs that are already open
    let trackingDescription;
    let size = this._size(options);
    if($('.ap-aui-dialog2:visible').length) {
      // am i in the confluence editor? first check for macro dialogs opened through macro browser, second is editing an existing macro
      if($('#macro-browser-dialog').length || (AJS.Confluence && AJS.Confluence.Editor && AJS.Confluence.Editor.currentEditMode)) {
        if (size === 'fullscreen') {
          trackingDescription = 'connect-macro-multiple-fullscreen';
        } else {
          trackingDescription = 'connect-macro-multiple';
        }
      } else {
        trackingDescription = 'connect-multiple';
      }
      AnalyticsDispatcher.trackMultipleDialogOpening(trackingDescription, dialogExtension);
    }
  }

  // abstracts and handles a failure to find active dialog
  isActiveDialogOrThrow(dialogProvider, addon_key) {
    if (!dialogProvider.isActiveDialog(addon_key)) {
      throw new Error('Failed to find an active dialog for: ' + addon_key);
    }
  }

}

var dialogUtilsInstance = new DialogUtils();

export default dialogUtilsInstance;