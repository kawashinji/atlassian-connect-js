import WebItemActions from 'actions/webitem_actions';
import EventDispatcher from 'dispatchers/event_dispatcher';
import WebItemUtils from 'utils/webitem';
import dialogUtils from 'utils/dialog';
import DialogExtensionActions from 'actions/dialog_extension_actions';
import _ from '../underscore';

const ITEM_NAME = 'dialog';
const SELECTOR = '.ap-dialog';
const TRIGGERS = ['click'];
const WEBITEM_UID_KEY = 'dialog-target-uid';
const DEFAULT_WEBITEM_OPTIONS = {
  chrome: true
};

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

  _dialogOptions(data){
    var options = data.options;
    if(!options) {
      options = dialogUtils.getOptionsForModule(data.extension.addon_key, data.extension.key);
    }
   return _.extend({}, DEFAULT_WEBITEM_OPTIONS, options);
  }

  triggered(data) {
    var $target = $(data.event.target);
    if(!$target.hasClass('ap-dialog')){
      $target = $target.closest('.ap-dialog');
    }
    var webitemId = $target.data(WEBITEM_UID_KEY);
    var dialogOptions = this._dialogOptions(data);
    dialogOptions.id = webitemId;
    DialogExtensionActions.open(data.extension, dialogOptions);
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

let dialogInstance = new DialogWebItem();
let webitem = dialogInstance.getWebItem();
EventDispatcher.register('webitem-invoked:' + webitem.name, function(data){
  dialogInstance.triggered(data);
});
EventDispatcher.register('before:webitem-invoked:' + webitem.name, dialogInstance.createIfNotExists);

WebItemActions.addWebItem(webitem);
export default dialogInstance;