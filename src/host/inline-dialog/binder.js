import content from '../content';
import simpleInlineDialog from './simple';

export default function () {
    var inlineDialogTrigger = '.ap-inline-dialog';
    var action = 'click mouseover mouseout';

    function callback(href, options, eventType) {
        var webItemOptions = content.getOptionsForWebItem(options.bindTo);
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

    content.eventHandler(action, inlineDialogTrigger, callback);
}