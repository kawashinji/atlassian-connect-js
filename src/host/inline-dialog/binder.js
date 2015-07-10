import webitemHelper from '../content';
import simpleInlineDialog from './simple';
import $ from '../dollar';

export default function () {
    var inlineDialogTrigger = '.ap-inline-dialog';
    var action = 'click mouseover mouseout';

    function callback(href, options, eventType) {
        var webItemOptions = webitemHelper.getOptionsForWebItem(options.bindTo);
        $.extend(options, webItemOptions);
        if (options.onHover !== 'true' && eventType !== 'click') {
            return;
        }

        // don't repeatedly open if already visible as dozens of mouse-over events are fired in quick succession
        if (options.onHover === true && options.bindTo.hasClass('active')) {
            return;
        }
        simpleInlineDialog(href, options).show();
    }

    webitemHelper.eventHandler(action, inlineDialogTrigger, callback);
}