import WebItemActions from 'actions/webitem_actions';
import EventDispatcher from 'dispatchers/event_dispatcher';
import WebItemUtils from 'utils/webitem';
import IframeContainer from 'components/iframe_container';
import DialogComponent from 'components/dialog';
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

  _dialogOptions($target){
    var webitemOptions = WebItemUtils.getOptionsForWebItem($target);
    return _.extend({}, DEFAULT_WEBITEM_OPTIONS, webitemOptions);
  }

  triggered(data) {
    var $target = $(data.event.target);
    if(!$target.hasClass('ap-dialog')){
      $target = $target.closest('.ap-dialog');
    }
    var webitemId = $target.data(WEBITEM_UID_KEY);
    var dialogOptions = this._dialogOptions($target);
    var $dialog = this._createDialog({
      id: webitemId,
      extension: data.extension,
      $target: $target,
      options: dialogOptions
    });
  }

  _createDialog(data) {
    var $iframeContainer = IframeContainer.createExtension(data.extension);
    var $dialog = DialogComponent.render({
      extension: data.extension,
      id: data.id,
      $content: $iframeContainer,
      chrome: data.options.chrome,
      width: data.options.width,
      height: data.options.height,
      size: data.options.size
    });
    return $dialog;
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