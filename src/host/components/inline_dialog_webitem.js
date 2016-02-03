import WebItemActions from 'actions/webitem_actions';
import EventDispatcher from 'dispatchers/event_dispatcher';
import InlineDialogComponent from 'components/inline_dialog';
import WebItemUtils from 'utils/webitem';
import IframeContainer from 'components/iframe_container';

const ITEM_NAME = 'inline-dialog';
const SELECTOR = '.ap-inline-dialog';
const TRIGGERS = ['click', 'hover'];
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

  triggered(data) {
    var $target = $(data.event.target);
    var attr = {id: $target.data(WEBITEM_UID_KEY)};

    var $iframeContainer = IframeContainer.createExtension(data.extension);
    var inlineDialog = InlineDialogComponent.render(attr);
    // AUI modifies the dom after insertion. Thus the content must be appended afterwards.
    inlineDialog.find(':first-child').append($iframeContainer);
    inlineDialog.attr('open', '');
    inlineDialog.insertAfter($target);
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
EventDispatcher.register('before:webitem-invoked:' + webitem.name, inlineDialogInstance.createIfNotExists);
EventDispatcher.register('webitem-invoked:' + webitem.name, inlineDialogInstance.triggered);
WebItemActions.addWebItem(webitem);

export default inlineDialogInstance;