import InlineDialogComponent from 'src/host/components/inline_dialog';

import EventDispatcher from 'src/host/dispatchers/event_dispatcher';


describe('Inline Dialog Component', () => {

  beforeEach(() => {
    $('.aui-inline-dialog').remove();
  });

  afterEach(() => {
  });

  describe('rendering', () => {
    var $content = $('<div />').attr('id', 'inline-dialog-content');

    it('renders an inline dialog', () => {
      var $inlineDialog = InlineDialogComponent.render({
        id: 'some-id',
        $content: $content
      });
      expect($inlineDialog.hasClass('aui-inline-dialog')).toBe(true);
      expect($inlineDialog.attr('id')).toEqual('inline-dialog-some-id');
      expect($inlineDialog.hide).toEqual(jasmine.any(Function));
      expect($inlineDialog.show).toEqual(jasmine.any(Function));
      expect($inlineDialog.refresh).toEqual(jasmine.any(Function));
    });

    it('contains the inline dialog content', () => {
      var $inlineDialog = InlineDialogComponent.render({
        id: 'some-id',
        bindTo: $('body'),
        $content: $content
      });
      $inlineDialog.show();
      expect($inlineDialog.find('#inline-dialog-content').length).toEqual(1);
    });
  });

});
