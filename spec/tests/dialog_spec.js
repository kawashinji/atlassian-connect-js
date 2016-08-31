import DialogComponent from 'src/host/components/dialog';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';
import dialogUtils from 'src/host/utils/dialog';
import DialogActions from 'src/host/actions/dialog_actions';

function renderDialogWithCustomButton() {
  DialogComponent.render({
    chrome: true,
    buttons: [{
      text: 'custom button',
      name: 'custom button',
      identifier: 'custom-button-1'
    }]
  });
}

function renderDialogWithChrome() {
  return DialogComponent.render({
    chrome: true
  });
}

describe('dialog component', () => {
  afterEach(() => {
    $('.aui-dialog2').remove();
    $('.aui-blanket').remove();
  });
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

    it('is size medium by default', () => {
      var $dialog = DialogComponent.render();
      expect($dialog.hasClass('aui-dialog2-medium')).toEqual(true);
    });

    describe('chrome', () => {

      it('renders a chromeless dialog by default', () => {
        var $dialog = DialogComponent.render();
        expect($dialog.hasClass('aui-dialog2-chromeless')).toEqual(true);
      });

      it('iframe dimensions should be the opened dimensions', () => {
        var $dialog = DialogComponent.render({
          width: '200px',
          height: '300px'
        });
        expect($dialog.width()).toEqual(200);
        expect($dialog.height()).toEqual(300);
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

        it('does not trigger event on button clicks when iframe is has not loaded', () => {
          var sanitizedOptions = dialogUtils.sanitizeOptions();
          var $footer = DialogComponent._renderFooter(sanitizedOptions);
          spyOn(DialogActions, 'clickButton');
          $footer.find('button').first().trigger('click');
          expect(DialogActions.clickButton.calls.count()).toEqual(0);
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

      describe('buttons', () => {

        describe('default', () => {
          it('gets the button visibility', () => {
            renderDialogWithChrome();
            expect(DialogComponent.buttonIsVisible('submit')).toBe(true);
            expect(DialogComponent.buttonIsVisible('cancel')).toBe(true);
          });

          it('gets the button visibility of hidden buttons', () => {
            renderDialogWithChrome();
            $('.aui-dialog2-footer-actions .ap-aui-button').hide();
            expect(DialogComponent.buttonIsVisible('submit')).toBe(false);
            expect(DialogComponent.buttonIsVisible('cancel')).toBe(false);
          });

          it('gets the button state', () => {
            renderDialogWithChrome();
            expect(DialogComponent.buttonIsEnabled('submit')).toBe(true);
            expect(DialogComponent.buttonIsEnabled('cancel')).toBe(true);
          });

          it('gets the state of disabled buttons', () => {
            renderDialogWithChrome();
            $('.aui-dialog2-footer-actions .ap-aui-button').attr('aria-disabled', true);
            expect(DialogComponent.buttonIsEnabled('submit')).toBe(false);
            expect(DialogComponent.buttonIsEnabled('cancel')).toBe(false);
          });
        });

        describe('custom', () => {
          it('gets the button visibility', () => {
            renderDialogWithCustomButton()
            expect(DialogComponent.buttonIsVisible('custom-button-1')).toBe(true);
          });

          it('gets the button visibility of hidden buttons', () => {
            renderDialogWithCustomButton()
            $('.aui-dialog2-footer-actions .ap-aui-button').hide();
            expect(DialogComponent.buttonIsVisible('custom-button-1')).toBe(false);
          });

          it('gets the button state', () => {
            renderDialogWithCustomButton()
            expect(DialogComponent.buttonIsEnabled('custom-button-1')).toBe(true);
          });

          it('gets the state of disabled buttons', () => {
            renderDialogWithCustomButton()
            $('.aui-dialog2-footer-actions .ap-aui-button').attr('aria-disabled', true);
            expect(DialogComponent.buttonIsEnabled('custom-button-1')).toBe(false);
          });
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

      it('iframe dimensions should be the opened dimensions', () => {
        var $dialog = DialogComponent.render({
          width: '200px',
          height: '300px',
          chrome: false
        });

        expect($dialog.width()).toEqual(200);
        expect($dialog.height()).toEqual(300);
      });

    });

    describe('fullscreen/maximum', () => {
      // Back compatibility support for addons like Gliffy and Balsamiq which have a special 100% height and width chromeless Dialogs.
      // This is not API or documented and should be deprecated.
      it('100% width and height takes up the entire screen', () => {
        var $dialog = DialogComponent.render({
          height: '100%',
          width: '100%'
        });
        expect($dialog.hasClass('aui-dialog2-chromeless')).toEqual(true);
        expect($dialog.hasClass('ap-header-controls')).toEqual(false);
        expect($dialog.height()).toEqual($(window).height());
        expect($dialog.width()).toEqual($(window).width());
      });

      it('maximum dialog takes up the entire screen', () => {
        var $dialog = DialogComponent.render({
          size: 'maximum'
        });
        expect($dialog.hasClass('aui-dialog2-chromeless')).toEqual(true);
        expect($dialog.hasClass('ap-header-controls')).toEqual(false);
        expect($dialog.height()).toEqual($(window).height());
        expect($dialog.width()).toEqual($(window).width());
      });

      it('combination of size and dimensions', () => {
        var $dialog = DialogComponent.render({
          height: '100%',
          width: '100%',
          size: 'maximum'
        });
        expect($dialog.hasClass('aui-dialog2-chromeless')).toEqual(true);
        expect($dialog.hasClass('ap-header-controls')).toEqual(false);
        expect($dialog.height()).toEqual($(window).height());
        expect($dialog.width()).toEqual($(window).width());
      });
    })
  });
});