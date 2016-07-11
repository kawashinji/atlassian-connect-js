import DialogComponent from 'components/dialog';
import IframeContainerComponent from 'components/iframe_container';
import EventDispatcher from 'dispatchers/event_dispatcher';

class DialogExtension {

  render(extension, dialogOptions){
    extension.options = extension.options || {};
    dialogOptions = dialogOptions || {};
    extension.options.isDialog = true;
    extension.options.preventDialogCloseOnEscape = dialogOptions.closeOnEscape === false;
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
      buttons:    dialogOptions.buttons
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
  DialogExtensionComponent.render(data.extension, data.options);
});

export default DialogExtensionComponent;
