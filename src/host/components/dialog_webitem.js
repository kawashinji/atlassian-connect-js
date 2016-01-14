import WebItemActions from 'actions/webitem_actions';
import EventDispatcher from 'dispatchers/event_dispatcher';

const ITEM_NAME = 'dialog';
const SELECTOR = ".ap-dialog";
const TRIGGERS = ["click"];

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
    debugger;
  }

}

let dialogInstance = new DialogWebItem();
let webitem = dialogInstance.getWebItem();
EventDispatcher.register("webitem-invoked:" + webitem.name, dialogInstance.triggered);
WebItemActions.addWebItem(webitem);