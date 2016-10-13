import _ from '../underscore';
import $ from '../dollar';
import IframeFormUtils from '../utils/iframe_form';
import EventDispatcher from '../dispatchers/event_dispatcher';

/**
 * Component for holding parameters of an iframe for rendering methods other than GET
 */
class IframeForm {

  render(attributes, data){
    if(!data) {
      data = IframeFormUtils.dataFromUrl(attributes.url);
      attributes.url = IframeFormUtils.urlWithoutData(attributes.url);
    }

    var form = $('<form />')
        .attr({
          'id': attributes.id || IframeFormUtils.randomIdentifier(),
          'class': 'ap-iframe-form',
          'action': attributes.url,
          'target': attributes.target || IframeFormUtils.randomTargetName(),
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

}

var IframeFormComponent = new IframeForm();
EventDispatcher.register('iframe-form-submit', function ($container) {
  var form = $container.find('.ap-iframe-form');
  var iframe = $container.find('.ap-iframe');

  if (form.length) {
    form.submit();

    // Check iframe name to real name
    var realName = iframe.attr('data-real-name');
    iframe.attr('name', realName);
    iframe[0].contentWindow.name = realName;
  }
});

export default IframeFormComponent;