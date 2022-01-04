/**
* Hosts are the primary method for Connect apps to interact with the page.
* @module Host
*/
import deprecate from '../../plugin/deprecate';
import getBooleanFeatureFlag from '../utils/feature-flag';

const TEXT_NODE_TYPE = 3;

export default {

  /*
   This function could be used in Connect app for moving focus to Host app.
   As Connect App - iframe app, it can get control. When it's happen - host app events such short-cuts
   stop working. This function could help in this case.
  */
  focus: () => {
    window.document.querySelector('a').focus({preventScroll:true});
    window.document.querySelector('a').blur();
  },

  /**
   * Gets the selected text on the page.
   * @noDemo
   * @deprecated This feature is no longer supported, for security and privacy reasons.
   * @name getSelectedText
   * @method
   * @param {Function} callback - Callback method to be executed with the selected text.
   * @example
   * AP.host.getSelectedText(function (selection) {
   *   console.log(selection);
   * });
   *
   */
  getSelectedText: deprecate(function(callback) {
    if (getBooleanFeatureFlag('com.atlassian.connect.acjs-vuln-610109-deprecate-getselectedtext')) {
      callback('');
      return;
    }
    let text = '';
    const selection = window.document.getSelection();
    if (selection && selection.anchorNode && selection.anchorNode.nodeType === TEXT_NODE_TYPE) {
      text = selection.toString();
    }
    callback(text);
  }, 'AP.host.getSelectedText()')
};
