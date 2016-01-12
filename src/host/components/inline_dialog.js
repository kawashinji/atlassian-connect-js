import WebItemActions from 'actions/webitem_actions';
import EventDispatcher from 'dispatchers/event_dispatcher';

const ITEM_NAME = 'inline-dialog';
const SELECTOR = ".ap-inline-dialog";
const TRIGGERS = ["click", "hover"];

class InlineDialogWebItem {
  constructor(){
    this._inlineDialogWebItem = {
      name: ITEM_NAME,
      selector: SELECTOR,
      triggers: TRIGGERS
    };
  }

  getWebItem(){
    return this._inlineDialogWebItem;
  }

  triggered(data) {
    debugger;
  }

}

let inlineDialogInstance = new InlineDialogWebItem();
let webitem = inlineDialogInstance.getWebItem();
EventDispatcher.register("webitem-invoked:" + webitem.name, inlineDialogInstance.triggered);
WebItemActions.addWebItem(webitem);