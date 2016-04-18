import $ from '../dollar';
import util from '../util';

class DialogUtils {
  _size (options){
    var size;
    if (options.size === 'x-large') {
      size = 'xlarge';
    } else if (options.width === '100%' && options.height === '100%') {
      size = 'fullscreen';
    } else if (!options.width && !options.height) {
      size = 'medium';
    }
    return size;
  }

  _header(text){
    if(typeof text === 'string'){
      return text;
    }
    return '';
  }

  _hint(text){
    if(typeof text === 'string'){
      return text;
    }
    return '';
  }

  _chrome(chrome){
    var returnval = true;
    if (typeof chrome === 'boolean') {
      returnval = chrome;
    }
    return returnval;
  }

  _width(dimension){
    return util.stringToDimension(dimension);
  }

  _height(dimension){
    return util.stringToDimension(dimension);
  }

  _actions(options){
    var sanitizedActions = [];
    options = options || {};
    if (!options.actions) {
      sanitizedActions = [
        {
          name: 'submit',
          text: options.submitText || 'submit',
          type: 'primary'
        },
        {
          name: 'cancel',
          text: options.cancelText || 'cancel',
          type: 'link'
        }
      ];
    }
    return sanitizedActions;

  }

  _id(str){
    if(typeof str !== 'string'){
      str = Math.random().toString(36).substring(2, 8);
    }
    return str;
  }

  sanitizeOptions(options){
    options = options || {};
    var sanitized = {
      chrome: this._chrome(options.chrome),
      header: this._header(options.header),
      hint: this._hint(options.hint),
      width: this._width(options.width),
      height: this._height(options.height),
      $content: options.$content,
      extension: options.extension,
      actions: this._actions(options),
      id: this._id(options.id),
      size: options.size
    };
    sanitized.size = this._size(sanitized);

    return sanitized;
  }

}

var dialogUtilsInstance = new DialogUtils();

export default dialogUtilsInstance;