import InlineDialogComponent from 'components/inline_dialog';

class InlineDialogExtension {

  close(extension) {
    $(".aui-inline-dialog").filter(function(){ return $(this).find('.ap-iframe-container').length > 0; }).hide();
  }

}

var InlineDialogExtensionComponent = new InlineDialogExtension();

EventDispatcher.register('inline-dialog-close', function(data) {
  InlineDialogExtensionComponent.close();
});


export default InlineDialogExtensionComponent;
