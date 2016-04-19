import DialogComponent from 'components/dialog';
import IframeContainerComponent from 'components/iframe_container';
import EventDispatcher from 'dispatchers/event_dispatcher';

class DialogExtension {

  render(extension, dialogOptions){
    extension.options = extension.options || {};
    dialogOptions = dialogOptions || {};
    extension.options.isDialog = true;
    var $iframeContainer = IframeContainerComponent.createExtension(extension);
    var $dialog = DialogComponent.render({
      extension:  extension,
      $content:   $iframeContainer,
      chrome:     dialogOptions.chrome,
      width:      dialogOptions.width,
      height:     dialogOptions.height,
      size:       dialogOptions.size,
      header:     dialogOptions.header,
      hint:       dialogOptions.hint
    });
    return $dialog;
  }

}

var DialogExtensionComponent = new DialogExtension();
EventDispatcher.register('dialog-extension-open', function(data){
  DialogExtensionComponent.render(data.extension, data.options);
});

export default DialogExtensionComponent;
