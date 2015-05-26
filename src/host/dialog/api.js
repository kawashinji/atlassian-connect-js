import create from '../create';
import dialogButton from './button';
import statusHelper from '../status-helper';
import $ from '../dollar';

var $global = $(window);
var idSeq = 0;
var $nexus;
var dialog;
var dialogId;

var buttons = {
    submit: dialogButton.submit({
        done: closeDialog
    }),
    cancel: dialogButton.cancel({
        done: closeDialog
    })
};

function keyPressListener(e) {
    if (e.keyCode === 27 && dialog && dialog.hide) {
        dialog.hide();
        $(document).unbind('keydown', keyPressListener);
    }
};

function createDialogElement(options, $nexus, chromeless) {
    var $el;
    var extraClasses = ['ap-aui-dialog2'];

    if (chromeless) {
        extraClasses.push('ap-aui-dialog2-chromeless');
    }

    $el = $(aui.dialog.dialog2({
        id: options.id,
        titleText: options.header,
        titleId: options.titleId,
        size: options.size,
        extraClasses: extraClasses,
        removeOnHide: true,
        footerActionContent: true,
        modal: true
    }));

    if (chromeless) {
        $el.find('header, footer').remove();
    } else {
        buttons.submit.setText(options.submitText);
        buttons.cancel.setText(options.cancelText);
        //soy templates don't support sending objects, so make the template and bind them.
        $el.find('.aui-dialog2-footer-actions').empty().append(buttons.submit.$el, buttons.cancel.$el);
    }

    $el.find('.aui-dialog2-content').append($nexus);
    $nexus.data('ra.dialog.buttons', buttons);

    return $el;
}

function displayDialogContent($container, options) {
    $container.append('<div id="embedded-' + options.ns + '" class="ap-dialog-container ap-content"/>');
}


function parseDimension(value, viewport) {
    if (typeof value === 'string') {
        var percent = value.indexOf('%') === value.length - 1;
        value = parseInt(value, 10);
        if (percent) {
          value = value / 100 * viewport;
        }
    }
    return value;
}

function closeDialog() {
    if ($nexus) {
        // Signal the XdmRpc for the dialog's iframe to clean up
        $nexus
            .trigger('ra.iframe.destroy')
            .removeData('ra.dialog.buttons')
            .unbind();
        // Clear the nexus handle to allow subsequent dialogs to open
        $nexus = null;
    }
    dialog.hide();
}

export default {
    id: dialogId,

    getButton(name) {
        var buttons = $nexus ? $nexus.data('ra.dialog.buttons') : null;
        return (name) && (buttons) ? buttons[name] : buttons;
    },

    /**
    * Constructs a new AUI dialog. The dialog has a single content panel containing a single iframe.
    * The iframe's content is either created by loading [options.src] as the iframe url. Or fetching the content from the server by add-on key + module key.
    *
    * @param {Object} options Options to configure the behaviour and appearance of the dialog.
    * @param {String} [options.header='Remotable Plugins Dialog Title']  Dialog header.
    * @param {String} [options.headerClass='ap-dialog-header'] CSS class to apply to dialog header.
    * @param {String|Number} [options.width='50%'] width of the dialog, expressed as either absolute pixels (eg 800) or percent (eg 50%)
    * @param {String|Number} [options.height='50%'] height of the dialog, expressed as either absolute pixels (eg 600) or percent (eg 50%)
    * @param {String} [options.id] ID attribute to assign to the dialog. Default to 'ap-dialog-n' where n is an autoincrementing id.
    */
    create(options, showLoadingIndicator) {
        var defaultOptions = {
            // These options really _should_ be provided by the caller, or else the dialog is pretty pointless
            width: '50%',
            height: '50%'
        };
        var dialogId = options.id || 'ap-dialog-' + (idSeq += 1);
        var mergedOptions = $.extend({id: dialogId}, defaultOptions, options, {dlg: 1});
        var dialogElement;

        // patch for an old workaround where people would make 100% height / width dialogs.
        if (mergedOptions.width === '100%' && mergedOptions.height === '100%') {
            mergedOptions.size = 'maximum';
        }

        mergedOptions.w = parseDimension(mergedOptions.width, $global.width());
        mergedOptions.h = parseDimension(mergedOptions.height, $global.height());

        $nexus = $('<div />')
            .addClass('ap-servlet-placeholder ap-container')
            .attr('id', 'ap-' + options.ns)
            .bind('ra.dialog.close', closeDialog);

        if (options.chrome) {
            dialogElement = createDialogElement(mergedOptions, $nexus);
        } else {
            dialogElement = createDialogElement(mergedOptions, $nexus, true);
        }

        if (options.size) {
            mergedOptions.w = '100%';
            mergedOptions.h = '100%';
        } else {
            AJS.layer(dialogElement).changeSize(mergedOptions.w, mergedOptions.h);
            dialogElement.removeClass('aui-dialog2-medium'); // this class has a min-height so must be removed.
        }

        dialog = AJS.dialog2(dialogElement);
        dialog.on('hide', closeDialog);
        // ESC key closes the dialog
        $(document).on('keydown', keyPressListener);

        displayDialogContent($nexus, mergedOptions);

        if (showLoadingIndicator !== false) {
            $nexus.append(statusHelper.createStatusMessages());
        }

        //difference between a webitem and opening from js.
        if (options.src) {
            create(mergedOptions);
        }

        // give the dialog iframe focus so it can capture keypress events, etc.
        // the 'iframe' selector needs to be specified, otherwise Firefox won't focus the iframe
        dialogElement.on('ra.iframe.create', 'iframe', function () {
            this.focus();
        });

        dialog.show();

    },

    close: closeDialog
}