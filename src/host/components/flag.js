import $ from '../dollar';
import FlagActions from 'actions/flag_actions';
import EventDispatcher from 'dispatchers/event_dispatcher';
const FLAGID_PREFIX = 'ap-flag-';

class Flag {

  _toHtmlString(str) {
    if($.type(str) === 'string'){
      return str;
    } else if($.type(str) === 'object' && (str instanceof $) ){
      return str.html();
    }
  }

  render (options) {
    var _id = FLAGID_PREFIX + options.id;
    var auiFlag = AJS.flag({
      type: options.type,
      title: options.title,
      body: this._toHtmlString(options.body),
      close: options.close
    });
    auiFlag.setAttribute('id', _id);
    var $auiFlag = $(auiFlag);
    $auiFlag.close = auiFlag.close;

    return $auiFlag;
  }

  close (id) {
    var f = document.getElementById(id);
    f.close();
  }

}

var FlagComponent = new Flag();

$(document).on('aui-flag-close', (e) => {
  const _id = e.target.id;
  FlagActions.closed(_id);
});

EventDispatcher.register('flag-close', (data) => {
  FlagComponent.close(data.id);
});

export default FlagComponent;