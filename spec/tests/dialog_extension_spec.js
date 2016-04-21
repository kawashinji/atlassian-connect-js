import DialogExtensionComponent from 'src/host/components/dialog_extension';
import baseDialogComponentTests from 'fixtures/base_dialog_component_tests';

describe('dialog extension component', () => {  
  afterEach(() => {
    $('.aui-dialog2').remove();
    $('.aui-blanket').remove();
  });
  describe('render', () => {
    var extension = {
      addon_key: 'some-key',
      key: 'module-key',
      url: 'https://www.example.com'
    };

    it('renders a chromeless dialog', () => {
      var options = baseDialogComponentTests.getChromelessOptions();
      expect($('.aui-dialog2').length).toEqual(0);
      DialogExtensionComponent.render(extension, options);
      expect($('.aui-dialog2').length).toEqual(1);
      baseDialogComponentTests.testChromeless(options);      
    });

    it('renders a dialog with chrome', () => {
      var options = baseDialogComponentTests.getChromeOptions();
      expect($('.aui-dialog2').length).toEqual(0);
      DialogExtensionComponent.render(extension, options);
      expect($('.aui-dialog2').length).toEqual(1);
      baseDialogComponentTests.testChrome(options);      
    });

    it('contains an iframe', () => {
      DialogExtensionComponent.render(extension);
      expect($('.aui-dialog2 iframe').length).toEqual(1);
    });

  });
});