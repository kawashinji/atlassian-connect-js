export default {
  /**
   This function could be used in Connect app for moving focus to Host app.
   As Connect App - iframe app, it can get control. When it's happen - host app events such short-cuts
   stop working. This function could help in this case.
   **/
  focus: () => {
    window.focus();
    window.document.querySelector('a').focus();
    window.document.querySelector('a').blur();
  }
};
