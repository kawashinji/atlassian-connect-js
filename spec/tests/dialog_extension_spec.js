import DialogExtensionComponent from 'src/host/components/dialog_extension';

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

    it('renders a dialog', () => {
      expect($('.aui-dialog2').length).toEqual(0);
      DialogExtensionComponent.render(extension);
      expect($('.aui-dialog2').length).toEqual(1);
    });

    it('renders a dialog with a header', () => {
      expect($('.aui-dialog2').length).toEqual(0);
      var dialogOptions = {
        header: {
          value: 'abc123'
        }
      };

      DialogExtensionComponent.render(extension, dialogOptions);
      expect($('.aui-dialog2 .aui-dialog2-header-main').text()).toEqual(dialogOptions.header.value);
    });

    it('renders a dialog with a hint', () => {
      expect($('.aui-dialog2').length).toEqual(0);
      var dialogOptions = {
        hint: 'abc123'
      };

      DialogExtensionComponent.render(extension, dialogOptions);
      expect($('.aui-dialog2 .aui-dialog2-footer-hint').text()).toEqual(dialogOptions.hint);
    });

    it('contains an iframe', () => {
      DialogExtensionComponent.render(extension);
      expect($('.aui-dialog2 iframe').length).toEqual(1);
    });

  });
});