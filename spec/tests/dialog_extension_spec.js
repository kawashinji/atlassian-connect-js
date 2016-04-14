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

    it('contains an iframe', () => {
      DialogExtensionComponent.render(extension);
      expect($('.aui-dialog2 iframe').length).toEqual(1);
    });

  });
});