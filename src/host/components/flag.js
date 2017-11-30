import $ from '../dollar';
import FlagActions from '../actions/flag_actions';
import EventDispatcher from '../dispatchers/event_dispatcher';
const FLAGID_PREFIX = 'ap-flag-';
const FLAG_CLASS = 'ac-aui-flag';
const FLAG_ACTION_CLASS = 'ac-flag-actions';

class Flag {

  cleanKey(dirtyKey) {
    var cleanFlagKeyRegExp = new RegExp('^' + FLAGID_PREFIX + '(.+)$');
    var matches = dirtyKey.match(cleanFlagKeyRegExp);
    if(matches && matches[1]) {
      return matches[1];
    }
    return null;
  }

  _toHtmlString(str) {
    if($.type(str) === 'string'){
      return str;
    } else if($.type(str) === 'object' && (str instanceof $) ){
      return str.html();
    }
  }

  _renderBody(body){
    var body = this._toHtmlString(body);
    var $body = $('<div />').html(body);
    $('<p />').addClass(FLAG_ACTION_CLASS).appendTo($body);
    return $body.html();
  }

  _renderActions($flag, flagId, actions) {
    var $actionContainer = $flag.find('.' + FLAG_ACTION_CLASS);
    actions = actions || {};
    var $action;

    Object.getOwnPropertyNames(actions).forEach((key) => {
      $action = $('<a />')
        .attr('href', '#')
        .data({
          'key': key,
          'flag_id': flagId
        })
        .text(actions[key]);
      $actionContainer.append($action);
    }, this);
    return $flag;
  }

  render (options) {
    bindFlagDomEvents();
    var _id = FLAGID_PREFIX + options.id;
    var auiFlag = AJS.flag({
      type: options.type,
      title: options.title,
      body: this._renderBody(options.body),
      close: options.close
    });
    auiFlag.setAttribute('id', _id);
    var $auiFlag = $(auiFlag);
    this._renderActions($auiFlag, options.id, options.actions);
    $auiFlag.addClass(FLAG_CLASS);
    $auiFlag.close = auiFlag.close;
    return $auiFlag;
  }

  close (id) {
    var f = document.getElementById(id);
    f.close();
  }

}

var FlagComponent = new Flag();
var flagDomEventsBound = false;
function bindFlagDomEvents(){
  if(flagDomEventsBound) {
    return;
  }
  $(document).on('aui-flag-close', (e) => {
    const _id = e.target.id;
    var cleanFlagId = FlagComponent.cleanKey(_id);
    FlagActions.closed(cleanFlagId);
  });

  $(document).on('click', '.' + FLAG_ACTION_CLASS, (e) => {
    var $target = $(e.target);
    var actionKey = $target.data('key');
    var flagId = $target.data('flag_id');
    FlagActions.actionInvoked(actionKey, flagId);
  });
  flagDomEventsBound = true;
}


EventDispatcher.register('flag-close', (data) => {
  FlagComponent.close(data.id);
});

export default FlagComponent;