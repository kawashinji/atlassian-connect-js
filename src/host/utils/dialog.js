import util from '../util';
import buttonUtils from './button';

class DialogUtils {
  _size (options){
    var size = options.size;
    if (options.size === 'x-large') {
      size = 'xlarge';
    }
    if (options.width === '100%' && options.height === '100%') {
      size = 'fullscreen';
    }
    if (!size && !options.width && !options.height) {
      size = 'medium';
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
    return returnval;
  }

  _width(options){
    if(options.size) {
      return undefined;
    }
    return util.stringToDimension(options.width);
  }

  _height(options){
    if(options.size) {
      return undefined;
    }
    return util.stringToDimension(options.height);
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
          type: 'primary'
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
          disabled === true;
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
      size: options.size
    };
    sanitized.size = this._size(sanitized);

    return sanitized;
  }
  // such a bad idea! this entire concept needs rewriting in the p2 plugin.
  moduleOptionsFromGlobal(addon_key, key) {
    if(window._AP
      && window._AP.dialogModules
      && window._AP.dialogModules[addon_key]
      && window._AP.dialogModules[addon_key][key]) {
      return window._AP.dialogModules[addon_key][key].options;
    }
    return false;
  }

}

var dialogUtilsInstance = new DialogUtils();

export default dialogUtilsInstance;