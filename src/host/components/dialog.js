import EventDispatcher from 'dispatchers/event_dispatcher';
import DomEventActions from 'actions/dom_event_actions';
import DialogActions from 'actions/dialog_actions';
import IframeContainer from 'components/iframe_container';

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
      const $actions = this._renderFooterActions(options.actions, options.extension);
      $footer.append($actions);
    }
    if(options.hint) {
      const $hint = $('<div />').addClass('aui-dialog2-footer-hint').text(options.hint);
      $footer.append($hint);
    }
    return $footer;
  }

  _renderFooterActions(actions, extension) {
    const $actions = $('<div />').addClass('aui-dialog2-footer-actions');
    $actions.append([...actions].map(action => {
      const $button = $('<button />').addClass('aui-button').text(action.text);
      $button.data('name', action.name);
      if (['primary', 'link'].includes(action.type)) {
        $button.addClass('aui-button-' + action.type);
      }
      $button.click(function () {
        if ($button.attr('aria-disabled') !== 'true') {
          DialogActions.buttonClick($button, extension);
        }
      });
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
    const $content = IframeContainer.createExtension({
      addon_key: options.extension.addon_key,
      key: options.key,
      url: options.url,
      options: {
        customData: options.customData
      }
    });
    $dialog.append(this._renderContent($content));
    if (options.chrome) {
      $dialog.prepend(this._renderHeader({
        title: options.title
      }));
      $dialog.append(this._renderFooter({
        extension: options.extension,
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

EventDispatcher.register('iframe-bridge-estabilshed', function(data){
  DomEventActions.registerKeyEvent({
    extension_id: data.extension.id,
    key: 27,
    callback: function () {
      DialogActions.close(null, data.extension);
    }
  });
});

EventDispatcher.register('dialog-close', function(data, extension){
  DomEventActions.unregisterKeyEvent({
    extension_id: extension.id,
    key: 27
  });
});

EventDispatcher.register('dialog-button-click', function ($el, extension) {
  DialogActions.close(null, extension);
});

export default DialogComponent;
