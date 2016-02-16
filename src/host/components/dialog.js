import EventDispatcher from 'dispatchers/event_dispatcher';
import $ from '../dollar';
import _ from '../underscore';

class Dialog {
  constructor () {
  }

  _renderHeaderCloseBtn(options) {
    var $close = $('<a />').addClass('aui-dialog2-header-close');
    var $closeBtn = $('<span />').addClass('aui-icon aui-icon-small aui-iconfont-close-dialog').text('Close');
    $close.append($closeBtn);
    return $close;
  }

  _renderHeader(options){
    var $header;
    var $title;
    var $secondary;

    $header = $('<header />').addClass('aui-dialog2-header');
    if(options.title) {
      $title = $('<h2 />').addClass('aui-dialog2-header-main');
      $title.text(options.title);
      $header.append($title);
    }
    $header.append(this._renderHeaderCloseBtn());
    return $header;
  }

  _renderContent($content){
    var $el = $('<div />').addClass('aui-dialog2-content');
    if($content) {
      $el.append($content);
    }
    return $el;
  }

  _renderFooter(options) {
    var $actions;
    var $footer;
    var $hint;
    $footer = $('<footer />').addClass('aui-dialog2-footer');
    if(options.actions) {
      $actions = this._renderFooterActions(options.actions);
      $footer.append($actions);
    }
    if(options.hint) {
      $hint = $('<div />').addClass('aui-dialog2-footer-hint').text(options.hint);
      $footer.append($hint);
    }
    return $footer;
  }

  _renderFooterActions(actions) {
    //either an array or object (for 1 button)
    if (!_.isArray(actions)) {
      actions = [actions];
    }
    return actions.map(action => $('<button />').text(action));
  }

  /**
  {
    id: 'some-dialog-id',
    title: 'some header',
    hint: 'some footer hint',
    $content: $(<div />).text('my content'),
    actions: []
  }
  **/
  render(options){
    var $dialog = $('<section />').attr({
      role: 'dialog',
      id: options.id});
    $dialog.addClass('aui-layer aui-dialog2 aui-dialog2-medium');

    //header
    $dialog.append(this._renderHeader({
      title: options.title
    }));
    //content
    $dialog.append(this._renderContent(options.$content));
    //footer
    $dialog.append(this._renderFooter({
      actions: options.actions,
      hint: options.hint
    }));
    return $dialog;
  }

}

var DialogComponent = new Dialog();

export default DialogComponent;