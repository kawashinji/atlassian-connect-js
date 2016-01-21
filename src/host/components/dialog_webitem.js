import WebItemActions from 'actions/webitem_actions';
import EventDispatcher from 'dispatchers/event_dispatcher';
import WebItemUtils from 'utils/webitem';
import IframeContainer from 'components/iframe_container';
import DialogComponent from 'components/dialog';

const ITEM_NAME = 'dialog';
const SELECTOR = ".ap-dialog";
const TRIGGERS = ["click"];
const WEBITEM_UID_KEY = "dialog-target-uid";

class DialogWebItem {
  constructor(){
    this._dialogWebItem = {
      name: ITEM_NAME,
      selector: SELECTOR,
      triggers: TRIGGERS
    };
  }

  getWebItem(){
    return this._dialogWebItem;
  }

  triggered(data) {
    var $target = $(data.event.target),
      options = {
        id: $target.data(WEBITEM_UID_KEY),
        title: 'some title',
        $content: IframeContainer.createExtension(data.extension)
      };
    var dialog = DialogComponent.render(options);
    dialog.insertAfter($target);
    // AUI modifies the dom after insertion. Thus the content must be appended afterwards.
    // dialog.find(".aui-dialog-contents").append($iframeContainer);
  }

  createIfNotExists(data) {
      var $target = $(data.event.target),
      uid = $target.data(WEBITEM_UID_KEY);

    if(!uid) {
      uid = WebItemUtils.uniqueId();
      $target.data(WEBITEM_UID_KEY, uid);
    }
  }

}

let dialogInstance = new DialogWebItem();
let webitem = dialogInstance.getWebItem();
EventDispatcher.register("webitem-invoked:" + webitem.name, dialogInstance.triggered);
EventDispatcher.register("before:webitem-invoked:" + webitem.name, dialogInstance.createIfNotExists);

WebItemActions.addWebItem(webitem);
export default dialogInstance;