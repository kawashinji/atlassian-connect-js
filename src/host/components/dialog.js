import EventDispatcher from 'dispatchers/event_dispatcher';
import $ from '../dollar';
import _ from '../underscore';

class Dialog {
  constructor () {
  }

  _renderHeaderCloseBtn(options) {
    const $close = $('<a />').addClass('aui-dialog2-header-close');
    const $closeBtn = $('<span />').addClass('aui-icon aui-icon-small aui-iconfont-close-dialog').text('Close');
    $close.append($closeBtn);
    return $close;
  }

  _renderHeader(options){
    const $header = $('<header />').addClass('aui-dialog2-header');
    if(options.header) {
      const $title = $('<h2 />').addClass('aui-dialog2-header-main').text(options.header);
      $header.append($title);
    }
    $header.append(this._renderHeaderCloseBtn());
    return $header;
  }

  _renderContent($content){
    const $el = $('<div />').addClass('aui-dialog2-content');
    if($content) {
      $el.append($content);
    }
    return $el;
  }

  _renderFooter(options) {
    const $footer = $('<footer />').addClass('aui-dialog2-footer');
    if(options.actions) {
      const $actions = this._renderFooterActions(options.actions);
      $footer.append($actions);
    }
    if(options.hint) {
      const $hint = $('<div />').addClass('aui-dialog2-footer-hint').text(options.hint);
      $footer.append($hint);
    }
    return $footer;
  }

  _renderFooterActions(actions) {
    const $actions = $('<div />').addClass('aui-dialog2-footer-actions');
    $actions.append([...actions].map(action => {
      const $button = $('<button />').addClass('aui-button').text(action.text);
      $button.data('name', action.name);
      if (['primary', 'link'].includes(action.type)) {
        $button.addClass('aui-button-' + action.type);
      }
      return $button;
    }));
    return $actions;
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
    const $dialog = $('<section />').attr({
      role: 'dialog',
      id: options.id
    });
    $dialog.data('aui-remove-on-hide', true);
    $dialog.addClass('aui-layer aui-dialog2');
    if (['small', 'medium', 'large', 'xlarge', 'fullscreen'].includes(options.size)) {
      $dialog.addClass('aui-dialog2-' + options.size);
    }
    $dialog.append(this._renderContent(options.$content));
    if (options.chrome) {
      $dialog.prepend(this._renderHeader({
        title: options.title
      }));
      $dialog.append(this._renderFooter({
        actions: options.actions,
        hint: options.hint
      }));
    } else {
      $dialog.addClass('aui-dialog2-chromeless');
    }
    return $dialog;
  }
}

const DialogComponent = new Dialog();

export default DialogComponent;
