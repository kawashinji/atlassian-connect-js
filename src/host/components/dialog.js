import EventDispatcher from 'dispatchers/event_dispatcher';
import DomEventActions from 'actions/dom_event_actions';
import DialogActions from 'actions/dialog_actions';
import dialogUtils from 'utils/dialog';

import $ from '../dollar';
import _ from '../underscore';

const DLGID_PREFIX = 'ap-dialog-';
const DLGID_REGEXP = new RegExp(`^${DLGID_PREFIX}[0-9A-Za-z]+$`);
const DIALOG_SIZES = ['small', 'medium', 'large', 'xlarge', 'fullscreen'];
const BUTTON_TYPES = ['primary', 'link'];

function getActiveDialog() {
  const $el = AJS.LayerManager.global.getTopLayer();
  if ($el && DLGID_REGEXP.test($el.attr('id'))) {
    const dialog = AJS.dialog2($el);
    dialog._id = dialog.$el.attr('id').replace(DLGID_PREFIX, '');
    return dialog;
  }
}

class Dialog {
  constructor () {
  }

  _renderHeaderCloseBtn() {
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
    const $actions = this._renderFooterActions(options.actions, options.extension);
    $footer.append($actions);
    if(options.hint) {
      const $hint = $('<div />').addClass('aui-dialog2-footer-hint').text(options.hint);
      $footer.append($hint);
    }
    return $footer;
  }

  _renderFooterActions(actions, extension) {
    const $actions = $('<div />').addClass('aui-dialog2-footer-actions');
    [...actions].forEach(action => {
      const $button = $('<button />').addClass('aui-button').text(action.text);
      $button.data('name', action.name);
      if (_.contains(BUTTON_TYPES, action.type)) {
        $button.addClass('aui-button-' + action.type);
      }
      $button.click(() => {
        if ($button.attr('aria-disabled') !== 'true') {
          DialogActions.clickButton(action.name, $button, extension);
        }
      });
      $actions.append($button);
    });
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
    var sanitizedOptions = dialogUtils.sanitizeOptions(options);
    const $dialog = $('<section />').attr({
      role: 'dialog',
      id: DLGID_PREFIX + sanitizedOptions.id
    });
    $dialog.attr('data-aui-modal', 'true');
    $dialog.data('aui-remove-on-hide', true);
    $dialog.addClass('aui-layer aui-dialog2 ap-aui-dialog2');

    if (_.contains(DIALOG_SIZES, sanitizedOptions.size)) {
      $dialog.addClass('aui-dialog2-' + sanitizedOptions.size);
    }

    $dialog.append(this._renderContent(sanitizedOptions.$content));

    if (sanitizedOptions.chrome) {
      $dialog.prepend(this._renderHeader({
        header: sanitizedOptions.header
      }));
      $dialog.append(this._renderFooter({
        extension: sanitizedOptions.extension,
        actions: sanitizedOptions.actions,
        hint: sanitizedOptions.hint
      }));
    } else {
      $dialog.addClass('aui-dialog2-chromeless');
    }
    const dialog = AJS.dialog2($dialog);
    dialog._id = sanitizedOptions.id;
    if (!sanitizedOptions.size || sanitizedOptions.size === 'fullscreen') {
      AJS.layer($dialog).changeSize(sanitizedOptions.width, sanitizedOptions.height);
    }
    dialog.show();
    DialogActions.open();
    return $dialog;
  }
}

const DialogComponent = new Dialog();

EventDispatcher.register('iframe-bridge-estabilshed', (data) => {
  if(data.extension.options.isDialog){
    DomEventActions.registerKeyEvent({
      extension_id: data.extension.id,
      key: 27,
      callback: () => {
        DialogActions.close({
          dialog: getActiveDialog(),
          extension: data.extension
        });
      }
    });
  }
});

EventDispatcher.register('dialog-close-active', (data) => {
  var activeDialog = getActiveDialog();
  if(activeDialog){
    DialogActions.close({
      customData: data.customData,
      dialog: activeDialog,
      extension: data.extension
    });
  }
});

EventDispatcher.register('dialog-close', (data) => {
  data.dialog.hide();
  DomEventActions.unregisterKeyEvent({
    extension_id: data.extension.id,
    key: 27
  });
});

EventDispatcher.register('dialog-button-toggle', (data) => {
  const dialog = getActiveDialog();
  if (dialog) {
    const $button = dialog.$el.find('.aui-dialog2-footer-actions .aui-button').filter(function () {
      return $(this).data('name') === data.name;
    });
    $button.attr('aria-disabled', !data.enabled);
  }
});

export default DialogComponent;
