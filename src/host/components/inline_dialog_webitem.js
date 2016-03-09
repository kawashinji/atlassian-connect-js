import WebItemActions from 'actions/webitem_actions';
import EventDispatcher from 'dispatchers/event_dispatcher';
import InlineDialogComponent from 'components/inline_dialog';
import WebitemComponent from 'components/webitem';
import WebItemUtils from 'utils/webitem';
import IframeContainer from 'components/iframe_container';
import $ from '../dollar';
import create from '../create';

const ITEM_NAME = 'inline-dialog';
const SELECTOR = '.ap-inline-dialog';
const TRIGGERS = ['mouseover', 'click'];
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
    var $iframeContainer = IframeContainer.createExtension(data.extension);
    var $inlineDialog = InlineDialogComponent.render({
      extension: data.extension,
      id: data.id,
      bindTo: data.$target,
      $content: $iframeContainer,
      dialogOptions: {} // fill this with dialog options.
    });
    return $inlineDialog;
  }

  triggered(data) {
    var $target = $(data.event.target);
    if(!$target.hasClass('ap-inline-dialog')){
      $target = $target.closest('.ap-inline-dialog');
    }
    var webitemId = $target.data(WEBITEM_UID_KEY);

    var $inlineDialog = this._createInlineDialog({
      id: webitemId,
      extension: data.extension,
      $target: $target
    });
    $inlineDialog.show();
  }

  opened(data){
    console.log('opened!', data);
    WebitemComponent.requestContent(data.extension).then(function(content){
      console.log('request content responded', arguments);
      var contentData = JSON.parse(content);
      contentData.options = {
        autoresize: true,
        autoresizepx: true
      };
      var addon = create(contentData);
      data.$el.empty().append(addon);
    });
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
EventDispatcher.register('inline-dialog-opened', function(data){
  inlineDialogInstance.opened(data);
});
WebItemActions.addWebItem(webitem);

export default inlineDialogInstance;