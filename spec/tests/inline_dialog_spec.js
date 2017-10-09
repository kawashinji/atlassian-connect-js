import InlineDialogComponent from 'src/host/components/inline_dialog';

import EventDispatcher from 'src/host/dispatchers/event_dispatcher';


describe('Inline Dialog Component', () => {

  beforeEach(() => {
    $('aui-inline-dialog').remove();
  });

  afterEach(() => {
  });

  describe('rendering', () => {
    it('renders an inline dialog', () => {
      var inlineDialog = InlineDialogComponent.render({
        id: 'some-id'
      });
      expect(inlineDialog.nodeName.toLowerCase()).toEqual('aui-inline-dialog');
      expect(inlineDialog.id).toEqual('inline-dialog-some-id');
    });
  });

});
