import DialogComponent from './dialog';
import IframeContainerComponent from './iframe_container';
import EventDispatcher from '../dispatchers/event_dispatcher';
import HostApi from '../host-api';
import EventActions from '../actions/event_actions';
import dialogUtils from '../utils/dialog';

class DialogExtension {

  render(extension, dialogOptions){
    extension.options = extension.options || {};
    dialogOptions = dialogOptions || {};
    extension.options.isDialog = true;
    extension.options.dialogId = dialogOptions.id;
    extension.options.preventDialogCloseOnEscape = dialogOptions.closeOnEscape === false;
    extension.options.hostFrameOffset = dialogOptions.hostFrameOffset;
    extension.options.hideIframeUntilLoad = true;
    var $iframeContainer = IframeContainerComponent.createExtension(extension);
    var $dialog = DialogComponent.render({
      extension:  extension,
      $content:   $iframeContainer,
      chrome:     dialogOptions.chrome,
      width:      dialogOptions.width,
      height:     dialogOptions.height,
      size:       dialogOptions.size,
      header:     dialogOptions.header,
      hint:       dialogOptions.hint,
      submitText: dialogOptions.submitText,
      cancelText: dialogOptions.cancelText,
      buttons:    dialogOptions.buttons,
      onHide:     dialogOptions.onHide
    });
    return $dialog;
  }

  getActiveDialog(){
    return DialogComponent.getActive();
  }

  buttonIsEnabled(identifier) {
    return DialogComponent.buttonIsEnabled(identifier);
  }

  buttonIsVisible(identifier) {
    return DialogComponent.buttonIsVisible(identifier);
  }

  getByExtension(extension) {
    if(typeof extension === 'string'){
      extension = {
        id: extension
      };
    }
    return DialogComponent.getByExtension(extension);
  }

}

var DialogExtensionComponent = new DialogExtension();
EventDispatcher.register('dialog-extension-open', function(data){
  const dialogExtension = data.extension;
  let dialogOptions = dialogUtils.sanitizeOptions(data.options);

  const frameworkAdaptor = HostApi.getFrameworkAdaptor();
  const dialogProvider = frameworkAdaptor.getProviderByModuleName('dialog');
  if (dialogProvider) {
    // this function should move.
    const getOnClickFunction = action => {
      const key = dialogExtension.key;
      const addon_key = dialogExtension.addon_key;
      const eventData = {
        button: {
          identifier: action.identifier,
          name: action.identifier,
          text: action.text
        }
      };
      if (['submit', 'cancel'].indexOf(action.identifier) >= 0) {
        EventActions.broadcast(`dialog.${action.identifier}`, {addon_key, key}, eventData);
      }
      EventActions.broadcast('dialog.button.click', {addon_key, key}, eventData);
    }


    dialogExtension.options.preventDialogCloseOnEscape = dialogOptions.closeOnEscape === false;
    dialogOptions.actions.map(action => action.onClick = getOnClickFunction.bind(null, action));
    dialogProvider.create(dialogOptions, dialogExtension);

  } else {
    DialogExtensionComponent.render(data.extension, data.options);
  }
});

export default DialogExtensionComponent;
