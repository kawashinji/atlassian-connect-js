import _ from '../underscore';
import $ from '../dollar';
import IframeFormUtils from '../utils/iframe_form';
import EventDispatcher from '../dispatchers/event_dispatcher';

/**
 * Component for holding parameters of an iframe for rendering methods other than GET
 */
class IframeForm {

  render(attributes, data) {
    if (!data) {
      data = IframeFormUtils.dataFromUrl(attributes.url);
      attributes.url = IframeFormUtils.urlWithoutData(attributes.url);
    }

    var form = $('<form />')
      .attr({
        'id': attributes.id || IframeFormUtils.randomIdentifier(),
        'class': 'ap-iframe-form',
        'action': attributes.url,
        'target': attributes.target,
        'method': attributes.method
      });
    _.each(data, (value, key) => {
      form.append($('<input />')
        .attr({
          name: key,
          type: 'hidden',
          value: value
        }));
    });

    return form;
  }

  submit(data) {
    var $el = data.$el;
    var form = $el.find('.ap-iframe-form');
    var iframe = $el.find('.ap-iframe');

    if (form.length) {
      form.submit();
    }
  }

}

var IframeFormComponent = new IframeForm();

EventDispatcher.register('iframe-container-appended', IframeFormComponent.submit);

export default IframeFormComponent;