import $ from '../dollar';
import button from './button';

function createDialogElement(content, options, chromeless) {
  var extraClasses = ['ap-aui-dialog2'];

  if (chromeless) {
    extraClasses.push('ap-aui-dialog2-chromeless');
  }

  var $el = $(aui.dialog.dialog2({
    id: options.id,
    titleText: options.header,
    titleId: options.titleId,
    size: options.size,
    extraClasses: extraClasses,
    removeOnHide: true,
    footerActionContent: '<button>a</button><button>b</button>',
    modal: true
  }));
  $el.find('.aui-dialog2-content').append(content);

  if (chromeless) {
    $el.find('header, footer').hide();
  } else {
    var submit = button.render(options.submitText || 'submit', {type: 'primary'});
    var cancel = button.render(options.cancelText || 'cancel');

    // buttons.submit.setText(options.submitText);
    // buttons.cancel.setText(options.cancelText);
    //soy templates don't support sending objects, so make the template and bind them.
    let footer = $el.find('.aui-dialog2-footer-actions');
    footer.find('button').remove();
    footer.append(submit.$el, cancel.$el);
    // $nexus.data('ra.dialog.buttons', buttons);
  }

  // function handler(button) {
  //   // ignore clicks on disabled links
  //   if (button.isEnabled()) {
  //     button.$el.trigger('ra.dialog.click', button.dispatch);
  //   }
  // }

  // $.each(buttons, function (i, button) {
  //   button.$el.click(function () {
  //     handler(button);
  //   });
  // });

  return $el;
}

module.exports = {
  render: createDialogElement
};