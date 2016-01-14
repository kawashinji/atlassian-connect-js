import WebItemActions from 'actions/webitem_actions';
import EventDispatcher from 'dispatchers/event_dispatcher';
import InlineDialogComponent from 'components/inline_dialog';
import WebItemUtils from 'utils/webitem';

const ITEM_NAME = 'inline-dialog';
const SELECTOR = ".ap-inline-dialog";
const TRIGGERS = ["click", "hover"];
const WEBITEM_UID_KEY = "inline-dialog-target-uid";

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

  triggered(data) {
    var $target = $(data.event.target),
      attr = {id: $target.data(WEBITEM_UID_KEY)};

    var inlineDialog = InlineDialogComponent.render(attr);
    inlineDialog.attr('open', '');
    inlineDialog.insertAfter($target);
    WebItemActions.createIframe(inlineDialog.find(".aui-inline-dialog-contents"));
  }

  createIfNotExists(data) {
      var $target = $(data.event.target),
      uid = $target.data(WEBITEM_UID_KEY);

    if(!uid) {
      uid = WebItemUtils.uniqueId();
      $target.data(WEBITEM_UID_KEY, uid);
    }
  }

  createIframe(data) {
    debugger;
  }

}

let inlineDialogInstance = new InlineDialogWebItem();
let webitem = inlineDialogInstance.getWebItem();
EventDispatcher.register("before:webitem-invoked:" + webitem.name, inlineDialogInstance.createIfNotExists);
EventDispatcher.register("webitem-invoked:" + webitem.name, inlineDialogInstance.triggered);
EventDispatcher.register("after:webitem-invoked:" + webitem.name, inlineDialogInstance.createIframe);
WebItemActions.addWebItem(webitem);

export default inlineDialogInstance;