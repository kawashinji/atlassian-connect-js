import WebItemActions from 'actions/webitem_actions';
import EventDispatcher from 'dispatchers/event_dispatcher';
import InlineDialogComponent from 'components/inline_dialog';
import WebItemUtils from 'utils/webitem';
import IframeContainer from 'components/iframe_container';
import $ from '../dollar';
const ITEM_NAME = 'inline-dialog';
const SELECTOR = '.ap-inline-dialog';
const TRIGGERS = ['hover', 'click'];
const WEBITEM_UID_KEY = 'inline-dialog-target-uid';

class InlineDialogWebItem {
  constructor(){
    this._inlineDialogWebItemSpec = {
      name: ITEM_NAME,
      selector: SELECTOR,
      triggers: TRIGGERS
    };
    this._inlineDialogWebItems = {};
  }

  getWebItem(){
    return this._inlineDialogWebItemSpec;
  }

  _createInlineDialog(data){
    var attr = {id: data.id};
    // attr["data-aui-responds-to"] = "toggle";
    var $iframeContainer = IframeContainer.createExtension(data.extension);
    var inlineDialog = InlineDialogComponent.render(attr);
    // AUI modifies the dom after insertion. Thus the content must be appended afterwards.
    inlineDialog.insertAfter(data.$target);
    let newlyInsertedDialog = document.getElementById(data.id);
    $(newlyInsertedDialog).one("aui-layer-show", function(e){
      $(this).find(':first-child').append($iframeContainer);
    });
    inlineDialog.attr('open', '');
  }

  triggered(data) {
    
    var $target = $(data.event.target);
    var webitemId = $target.data(WEBITEM_UID_KEY);
    console.log('triggered!', data, webitemId);
    var existingInlineDialog = document.getElementById(webitemId);
    if(!existingInlineDialog){
      this._createInlineDialog({
        id: webitemId,
        extension: data.extension,
        $target: $target
      });
    } else {
      console.log('should show');
      $(existingInlineDialog).attr('open', '');
      // $(existingInlineDialog).show();
      // $(existingInlineDialog).attr('aria-hidden', false);
    }
  }

  createIfNotExists(data) {
    var $target = $(data.event.target);
    var uid = $target.data(WEBITEM_UID_KEY);

    if(!uid) {
      uid = WebItemUtils.uniqueId();
      $target.data(WEBITEM_UID_KEY, uid);
    }
  }

}

let inlineDialogInstance = new InlineDialogWebItem();
let webitem = inlineDialogInstance.getWebItem();
EventDispatcher.register('before:webitem-invoked:' + webitem.name, function(data){
  inlineDialogInstance.createIfNotExists(data);
});
EventDispatcher.register('webitem-invoked:' + webitem.name, function(data){
  inlineDialogInstance.triggered(data);
});
WebItemActions.addWebItem(webitem);

export default inlineDialogInstance;