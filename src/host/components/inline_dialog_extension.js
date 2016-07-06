import InlineDialogComponent from 'components/inline_dialog';

class InlineDialogExtension {

  close(extension) {
    $(".aui-inline-dialog").filter('.ap-iframe-container').remove();
  }

}

var InlineDialogExtensionComponent = new InlineDialogExtension();

EventDispatcher.register('inline-dialog-close', function(data) {
  InlineDialogExtensionComponent.close();
});


export default InlineDialogExtensionComponent;
