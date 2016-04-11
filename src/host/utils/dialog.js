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
    if(typeof dimension !== 'string'){
      dimension = '100%';
    } else {
      dimension = util.stringToDimension(dimension);
    }
    return dimension;
  }

  _height(dimension){
    if(typeof dimension !== 'string'){
      dimension = '400px';
    } else {
      dimension = util.stringToDimension(dimension);
    }
    return dimension;
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

  sanitizeOptions(options){
    options = options || {};
    var sanitized = {
      chrome: this._chrome(options.chrome),
      header: this._header(options.header),
      hint: this._hint(options.hint),
      size: this._size(options),
      width: this._width(options),
      height: this._height(options),
      $content: options.$content,
      extension: options.extension,
      actions: this._actions(options)
    };
    return sanitized;
  }
}

var dialogUtilsInstance = new DialogUtils();

export default dialogUtilsInstance;