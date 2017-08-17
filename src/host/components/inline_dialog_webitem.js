import WebItemActions from '../actions/webitem_actions';
import InlineDialogWebItemActions from '../actions/inline_dialog_webitem_actions';
import EventDispatcher from '../dispatchers/event_dispatcher';
import InlineDialogComponent from './inline_dialog';
import WebitemComponent from './webitem';
import WebItemUtils from '../utils/webitem';
import IframeContainer from './iframe_container';
import $ from '../dollar';
import IframeCreate from '../iframe-create';
import Util from '../util';
import urlUtils from '../utils/url';

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
    var $inlineDialog = InlineDialogComponent.render({
      extension: data.extension,
      id: data.id,
      bindTo: data.$target,
      $content: $('<div />'),
      inlineDialogOptions: data.extension.options
    });

    return $inlineDialog;
  }


  // todo, don't trigger if already open
  triggered(data) {
    // don't trigger on hover, when hover is not specified.
    if(data.event.type !== 'click' && !data.extension.options.onHover){
      return;
    }
    var $target = $(data.event.currentTarget);
    var webitemId = $target.data(WEBITEM_UID_KEY);
    console.log('triggered', $target, webitemId, data);
    var $inlineDialog = this._createInlineDialog({
      id: webitemId,
      extension: data.extension,
      $target: $target,
      options: data.extension.options || {}
    });

    $inlineDialog.show();
  }

  opened(data){
    console.log('opened', data);
    var $existingFrame = data.$el.find('iframe');
    if($existingFrame && $existingFrame.length === 1){
      var src = $existingFrame.attr('src');
      // existing iframe is already present and src is still valid (either no jwt or jwt has not expired).
      if(src.length > 0 && (!urlUtils.hasJWT(src) || (urlUtils.hasJwt(src) && !urlUtils.isJwtExpired(src)))) {
        return;
      }
    }
    var contentRequest = WebitemComponent.requestContent(data.extension);
    if(!contentRequest){
      console.warn('no content resolver found');
      return false;
    }
    contentRequest.then(function(content){
      content.options = content.options || {};
      Util.extend(content.options, {
        autoresize: true,
        widthinpx: true
      });

      InlineDialogWebItemActions.addExtension({
        $el: data.$el,
        extension: content
      });
    });
  }

  addExtension(data){
    console.log('add extension', data);
    var addon = IframeCreate(data.extension);
    data.$el.empty().append(addon);
  }

  createIfNotExists(data) {
    console.log('creatifnotexist', data);
    var $target = $(data.event.currentTarget);
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
EventDispatcher.register('inline-dialog-extension', function(data){
  inlineDialogInstance.addExtension(data);
});
WebItemActions.addWebItem(webitem);

export default inlineDialogInstance;