/**
 * The inline dialog is a wrapper for secondary content/controls to be displayed on user request. Consider this component as displayed in context to the triggering control with the dialog overlaying the page content.
 * An inline dialog should be preferred over a modal dialog when a connection between the action has a clear benefit versus having a lower user focus.
 *
 * Inline dialogs can be shown via a [web item target](../modules/common/web-item.html#target).
 *
 * For more information, read about the Atlassian User Interface [inline dialog component](https://docs.atlassian.com/aui/latest/docs/inline-dialog.html).
 * @module inline-dialog
 */
import { acjsFrameworkAdaptor } from '@atlassian/connect-module-core/lib/adaptors/framework/ACJSFrameworkAdaptor';
import InlineDialogActions from '../actions/inline_dialog_actions';
import util from '../util';

export default {
  /**
   * Hide the inline dialog that contains the iframe where this method is called from.
   * @memberOf module:inline-dialog
   * @method hide
   * @noDemo
   * @example
   * AP.inlineDialog.hide();
   */
  hide: function(callback) {
    callback = util.last(arguments);
    const inlineDialogProvider = acjsFrameworkAdaptor.getProviderByModuleName('inlineDialog');
    if (inlineDialogProvider) {
      inlineDialogProvider.hide(callback._context);
    } else {
      InlineDialogActions.close();
    }
  }
};