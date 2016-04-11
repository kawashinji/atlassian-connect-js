import DialogComponent from 'src/host/components/dialog';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import dialogUtils from 'src/host/utils/dialog';
import DialogActions from 'src/host/actions/dialog_actions';

describe('dialog component', () => {

  describe('render', () => {

    it('renders a dialog', () => {
      var $dialog = DialogComponent.render();
      expect($dialog.hasClass('aui-dialog2')).toEqual(true);
      expect($dialog.hasClass('ap-aui-dialog2')).toEqual(true);
    });

    it('contains content', () => {
      var content = $('<div />').text('some content');
      var $dialog = DialogComponent.render({
        $content: content
      });
      var $dialogContent = $dialog.find('.aui-dialog2-content');
      expect($dialogContent.length).toEqual(1);
      expect($dialogContent.text()).toEqual('some content');
    });

    describe('chrome', () => {

      it('renders a chromed dialog by default', () => {
        var $dialog = DialogComponent.render();
        expect($dialog.hasClass('aui-dialog2-chromeless')).toEqual(false);
      });

      describe('footer', () => {

        it('renders', () => {
          var sanitizedOptions = dialogUtils.sanitizeOptions();
          var $footer = DialogComponent._renderFooter(sanitizedOptions);
          expect($footer.hasClass('aui-dialog2-footer')).toEqual(true);
        });

        it('has a hint', () => {
          var sanitizedOptions = dialogUtils.sanitizeOptions({hint: 'abc123'});
          var $footer = DialogComponent._renderFooter(sanitizedOptions);
          var hint = $footer.find('.aui-dialog2-footer-hint');
          expect(hint.length).toEqual(1);
          expect(hint.text()).toEqual('abc123');
        });

        it('has actions', () => {
          var sanitizedOptions = dialogUtils.sanitizeOptions();
          var $footer = DialogComponent._renderFooter(sanitizedOptions);
          var $actions = $footer.find('.aui-dialog2-footer-actions');
          expect($actions.length).toEqual(1);
          expect($actions.find('button').length).toEqual(2);
        });

        it('triggers when buttons are clicked', () => {
          var sanitizedOptions = dialogUtils.sanitizeOptions();
          var $footer = DialogComponent._renderFooter(sanitizedOptions);
          spyOn(DialogActions, 'clickButton');
          $footer.find('button').first().trigger('click');
          expect(DialogActions.clickButton.calls.count()).toEqual(1);
        });
      });

      describe('header', () => {

        it('renders', () => {
          var sanitizedOptions = dialogUtils.sanitizeOptions();
          var $header = DialogComponent._renderHeader(sanitizedOptions);
          expect($header.hasClass('aui-dialog2-header')).toEqual(true);
        });

        it('adds header text', () => {
          var sanitizedOptions = dialogUtils.sanitizeOptions();
          sanitizedOptions.header = 'header text';
          var $header = DialogComponent._renderHeader(sanitizedOptions);
          expect($header.find('.aui-dialog2-header-main').text()).toEqual(sanitizedOptions.header);
        });

        it('has a close button', () => {
          var sanitizedOptions = dialogUtils.sanitizeOptions();
          var $header = DialogComponent._renderHeader(sanitizedOptions);
          expect($header.find('.aui-dialog2-header-close').length).toEqual(1);          
        });
      });
    });

    describe('chromeless', () => {

      it('does not have chrome', () => {
        var $dialog = DialogComponent.render({
          chrome: false
        });
        expect($dialog.hasClass('aui-dialog2-chromeless')).toEqual(true);
        expect($dialog.find('header').length).toEqual(0);
        expect($dialog.find('footer').length).toEqual(0);
      });
    });
  });
});