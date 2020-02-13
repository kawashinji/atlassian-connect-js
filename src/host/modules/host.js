import util from '../util';

const TEXT_NODE_TYPE = 3;

export default {

  /**
   This function could be used in Connect app for moving focus to Host app.
   As Connect App - iframe app, it can get control. When it's happen - host app events such short-cuts
   stop working. This function could help in this case.
   **/
  focus: () => {
    window.document.querySelector('a').focus({preventScroll:true});
    window.document.querySelector('a').blur();
  },

  getSelectedText:function(callback) {
    let text = '';
    const selection = window.document.getSelection();
    if (selection && selection.anchorNode.nodeType === TEXT_NODE_TYPE) {
      text = selection.toString();
    }
    callback = util.last(arguments);
    callback(text);
  }
};
