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
    return InlineDialogComponent.render({
      extension: data.extension,
      id: data.id,
      bindTo: data.$target[0],
      // inlineDialogOptions: data.extension.options // no idea what this does.
    });
  }


  triggered(data) {
    // don't trigger on hover, when hover is not specified.
    if(data.event.type !== 'click' && !data.extension.options.onHover){
      return;
    }
    var $target = $(data.event.currentTarget);
    var webitemId = $target.data(WEBITEM_UID_KEY);

    this._createInlineDialog({
      id: webitemId,
      extension: data.extension,
      $target: $target,
      options: data.extension.options || {}
    });
  }

  opened(data){
    console.log("OPENED!!!!", data);
    var existingFrame = data.el.getElementsByTagName('iframe')[0];
    // existing iframe is already present and src is still valid (either no jwt or jwt has not expired).
    if(existingFrame){
      const src = existingFrame.src;
      const srcPresent = (src.length > 0);
      if(srcPresent) {
        const srcHasJWT = urlUtils.hasJwt(src);
        const srcHasValidJWT = srcHasJWT && !urlUtils.isJwtExpired(src);
        if(srcHasValidJWT || !srcHasJWT) {
          return false;
        }
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
        el: data.el,
        extension: content
      });
    });
    return true;
  }

  addExtension(data){
    let $addon = IframeCreate(data.extension);
    while (data.el.firstChild) {
      data.el.removeChild(data.el.firstChild);
    }
    $addon.appendTo(data.el);
  }

  createIfNotExists(data) {
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