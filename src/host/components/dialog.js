import EventDispatcher from '../dispatchers/event_dispatcher';
import DomEventActions from '../actions/dom_event_actions';
import DialogActions from '../actions/dialog_actions';
import dialogUtils from '../utils/dialog';
import IframeComponent from './iframe';
import Button from './button';
import ButtonActions from '../actions/button_actions';

import $ from '../dollar';
import _ from '../underscore';

const DLGID_PREFIX = 'ap-dialog-';
const DIALOG_CLASS = 'ap-aui-dialog2';
const DLGID_REGEXP = new RegExp(`^${DLGID_PREFIX}[0-9A-Za-z]+$`);
const DIALOG_SIZES = ['small', 'medium', 'large', 'xlarge', 'fullscreen', 'maximum'];
const DIALOG_BUTTON_CLASS = 'ap-aui-dialog-button';
const DIALOG_BUTTON_CUSTOM_CLASS = 'ap-dialog-custom-button';
const DIALOG_FOOTER_CLASS = 'aui-dialog2-footer';
const DIALOG_FOOTER_ACTIONS_CLASS = 'aui-dialog2-footer-actions';
const DIALOG_HEADER_ACTIONS_CLASS = 'header-control-panel';

var debounce = AJS.debounce || $.debounce;

function getActiveDialog() {
  const $el = AJS.LayerManager.global.getTopLayer();
  if ($el && DLGID_REGEXP.test($el.attr('id'))) {
    const dialog = AJS.dialog2($el);
    dialog._id = dialog.$el.attr('id').replace(DLGID_PREFIX, '');
    return dialog;
  }
}

function getActionBar($dialog) {
  var $actionBar = $dialog.find('.' + DIALOG_HEADER_ACTIONS_CLASS);
  if(!$actionBar.length) {
    $actionBar = $dialog.find('.' + DIALOG_FOOTER_ACTIONS_CLASS);
  }
  return $actionBar;
}

function getButtonByIdentifier(id, $dialog) {
  const $actionBar = getActionBar($dialog);
  return $actionBar.find('.aui-button').filter(function () {
    return Button.getIdentifier(this) === id;
  });
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
  //v3 ask DT about this DOM.
  _renderFullScreenHeader($header, options) {
    var $titleContainer = $('<div />').addClass('header-title-container aui-item expanded');
    var $title = $('<div />').append($('<span />').addClass('header-title').text(options.header || ''));
    $titleContainer.append($title);
    $header.append($titleContainer).append(this._renderHeaderActions(options.actions, options.extension));
    return $header;
  }

  _renderHeader(options){
    const $header = $('<header />').addClass('aui-dialog2-header');
    if(options.size === 'fullscreen') {
      return this._renderFullScreenHeader($header, options);
    }
    if(options.header) {
      const $title = $('<h2 />').addClass('aui-dialog2-header-main').text(options.header);
      $header.append($title);
    }
    $header.append(this._renderHeaderCloseBtn());
    return $header;
  }

  _renderHeaderActions(actions, extension) {
    const $headerControls = $('<div />').addClass('aui-item ' + DIALOG_HEADER_ACTIONS_CLASS);
    actions[0].additionalClasses = ['aui-icon', 'aui-icon-small', 'aui-iconfont-success'];
    actions[1].additionalClasses = ['aui-icon', 'aui-icon-small', 'aui-iconfont-close-dialog'];
    const $actions = this._renderActionButtons(actions, extension);
    $actions.forEach(($action) => {
      $headerControls.append($action);
    });
    return $headerControls;
  }

  _renderContent($content){
    const $el = $('<div />').addClass('aui-dialog2-content');
    if($content) {
      $el.append($content);
    }
    return $el;
  }

  _renderFooter(options) {
    const $footer = $('<footer />').addClass(DIALOG_FOOTER_CLASS);
    if(options.size !== 'fullscreen') {
      const $actions = this._renderFooterActions(options.actions, options.extension);
      $footer.append($actions);
    }
    if(options.hint) {
      const $hint = $('<div />').addClass('aui-dialog2-footer-hint').text(options.hint);
      $footer.append($hint);
    }
    return $footer;
  }

  _renderActionButtons(actions, extension) {
    var actionButtons = [];
    [...actions].forEach(action => {
      actionButtons.push(
        this._renderDialogButton({
          text: action.text,
          name: action.name,
          type: action.type,
          additionalClasses: action.additionalClasses,
          custom: action.custom || false,
          identifier: action.identifier,
          immutable: action.immutable
        }, extension)
      );
    });
    return actionButtons;
  }

  _renderFooterActions(actions, extension) {
    const $actions = $('<div />').addClass(DIALOG_FOOTER_ACTIONS_CLASS);
    const $buttons = this._renderActionButtons(actions, extension);
    $buttons.forEach(($button) => {
      $actions.append($button);
    });
    return $actions;
  }

  _renderDialogButton(options, extension) {
    options.additionalClasses = options.additionalClasses || [];
    options.additionalClasses.push(DIALOG_BUTTON_CLASS);
    if(options.custom) {
      options.additionalClasses.push(DIALOG_BUTTON_CUSTOM_CLASS);
    }
    const $button = Button.render(options);
    $button.extension = extension;
    return $button;
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
    $dialog.data({
      'aui-remove-on-hide': true,
      'extension': sanitizedOptions.extension
    });
    $dialog.addClass('aui-layer aui-dialog2 ' + DIALOG_CLASS);

    if (_.contains(DIALOG_SIZES, sanitizedOptions.size)) {
      $dialog.addClass('aui-dialog2-' + sanitizedOptions.size);
    }

    if(sanitizedOptions.size === 'fullscreen' || sanitizedOptions.size === 'maximum') {
      if(sanitizedOptions.chrome) {
        $dialog.addClass('ap-header-controls');
      }
      $dialog.addClass('aui-dialog2-maximum');
    }

    $dialog.append(this._renderContent(sanitizedOptions.$content));

    if (sanitizedOptions.chrome) {
      $dialog.prepend(this._renderHeader({
        header: sanitizedOptions.header,
        actions: sanitizedOptions.actions,
        size: sanitizedOptions.size
      }));

      $dialog.append(this._renderFooter({
        extension: sanitizedOptions.extension,
        actions: sanitizedOptions.actions,
        hint: sanitizedOptions.hint,
        size: sanitizedOptions.size
      }));
    } else {
      $dialog.addClass('aui-dialog2-chromeless');
    }

    const dialog = AJS.dialog2($dialog);
    dialog._id = sanitizedOptions.id;
    if(sanitizedOptions.size === 'fullscreen'){
      sanitizedOptions.height = sanitizedOptions.width = '100%';
    }
    if (!sanitizedOptions.size || sanitizedOptions.size === 'fullscreen') {
      AJS.layer($dialog).changeSize(sanitizedOptions.width, sanitizedOptions.height);
    }
    dialog.show();
    dialog.$el.data('extension', sanitizedOptions.extension);
    dialog.$el.data('originalOptions', options);
    return $dialog;
  }

  setIframeDimensions($iframe){
    IframeComponent.resize('100%', '100%', $iframe);
  }

  getActive(){
    return getActiveDialog();
  }

  buttonIsEnabled(identifier) {
    const dialog = getActiveDialog();
    if (dialog) {
      const $button = getButtonByIdentifier(identifier, dialog.$el);
      return Button.isEnabled($button);
    }
  }

  buttonIsVisible(identifier) {
    const dialog = getActiveDialog();
    if (dialog) {
      const $button = getButtonByIdentifier(identifier, dialog.$el);
      return Button.isVisible($button);
    }
  }

  /**
  * takes either a target spec or a filter function
  * returns all matching dialogs
  */
  getByExtension(extension) {
    var filterFunction;
    if(typeof extension === 'function') {
      filterFunction = extension;
    } else {
      var keys = Object.getOwnPropertyNames(extension);
      filterFunction = function(dialog) {
        var dialogData = $(dialog).data('extension');
        return keys.every((key) => {
          return dialogData[key] === extension[key];
        });
      };
    }

    return $('.' + DIALOG_CLASS).toArray().filter(filterFunction).map(($el) => {
      return AJS.dialog2($el);
    });
  }

  // add user defined button to an existing dialog
  addButton(extension, options) {
    options.custom = true;
    var $button = this._renderDialogButton(options, extension);
    var $dialog = this.getByExtension({
      addon_key: extension.addon_key,
      key: extension.key
    })[0].$el;
    var $actionBar = getActionBar($dialog);
    $actionBar.append($button);
    return $dialog;
  }
}

const DialogComponent = new Dialog();

EventDispatcher.register('iframe-bridge-established', (data) => {
  if(data.extension.options.isDialog && !data.extension.options.preventDialogCloseOnEscape){
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

    EventDispatcher.registerOnce('dialog-close', (d) => {
      DomEventActions.unregisterKeyEvent({
        extension_id: data.extension.id,
        key: 27
      });
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
});

EventDispatcher.register('dialog-button-toggle', (data) => {
  const dialog = getActiveDialog();
  if (dialog) {
    const $button = getButtonByIdentifier(data.identifier, dialog.$el);
    ButtonActions.toggle($button, !data.enabled);
  }
});

EventDispatcher.register('dialog-button-toggle-visibility', (data) => {
  const dialog = getActiveDialog();
  if (dialog) {
    const $button = getButtonByIdentifier(data.identifier, dialog.$el);
    ButtonActions.toggleVisibility($button, data.hidden);
  }
});

EventDispatcher.register('button-clicked', (data) => {
  var $button = data.$el;
  if($button.hasClass(DIALOG_BUTTON_CLASS)) {
    var $dialog = $button.parents('.' + DIALOG_CLASS);
    var $iframe = $dialog.find('iframe');
    if ($iframe.length && $iframe[0].bridgeEstablished) {
      DialogActions.clickButton(Button.getIdentifier($button), $button, $dialog.data('extension'));
    } else {
      DialogActions.close({
        dialog: getActiveDialog(),
        extension: $button.extension
      });
    }
  }
});

EventDispatcher.register('iframe-create', (data) => {
  if(data.extension.options && data.extension.options.isDialog){
    DialogComponent.setIframeDimensions(data.extension.$el);
  }
});

EventDispatcher.register('dialog-button-add', (data) => {
  DialogComponent.addButton(data.extension, data.button);
});

EventDispatcher.register('host-window-resize', debounce(() => {
  $('.' + DIALOG_CLASS).each((i, dialog) => {
    var $dialog = $(dialog);
    var sanitizedOptions = dialogUtils.sanitizeOptions($dialog.data('originalOptions'));
    dialog.style.width = sanitizedOptions.width;
    dialog.style.height = sanitizedOptions.height;
  });
}, 100));

DomEventActions.registerWindowKeyEvent({
  keyCode: 27,
  callback: () => {
    DialogActions.closeActive({
      customData: {},
      extension: null
    });
  }
});

export default DialogComponent;
