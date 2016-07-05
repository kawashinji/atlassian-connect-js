/**
 * The inline dialog is a wrapper for secondary content/controls to be displayed on user request. Consider this component as displayed in context to the triggering control with the dialog overlaying the page content.
 * A inline dialog should be preferred over a modal dialog when a connection between the action has a clear benefit versus having a lower user focus.
 *
 * Inline dialogs can be shown via a [web item target](../modules/common/web-item.html#target).
 *
 * For more information, read about the Atlassian User Interface [inline dialog component](https://docs.atlassian.com/aui/latest/docs/inline-dialog.html).
 * @module inline-dialog
 */

import EventDispatcher from 'dispatchers/event_dispatcher';
import InlineDialogActions from 'actions/inline_dialog_actions';
import util from '../util';

function hideInlineDialog(data){
  var iframe = util.getIframeByExtensionId(data.extension_id);
  iframe.closest('.aui-inline-dialog2')[0].hide();
}

EventDispatcher.register('inline-dialog-hide', hideInlineDialog);

export default {
  /**
   * Hide the inline dialog that contains the iframe where this method is called from.
   * @memberOf module:inline-dialog
   * @method hide
   * @noDemo
   * @example
   * AP.require('inline-dialog', function(inlineDialog){
   *   inlineDialog.hide();
   * });
   */
  hide: function(callback){
    InlineDialogActions.hide(callback._context.extension_id);
  }
};