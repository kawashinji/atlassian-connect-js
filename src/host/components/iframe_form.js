import qs from 'query-string';
import _ from '../underscore';
import $ from '../dollar';

/**
 * Component for holding parameters of an iframe for rendering methods other than GET
 */
class IframeForm {

  createExtension(extension, $container) {
    var formAttribute = {
      url: extension.url,
      iframeFormId: extension.id + '-form-id',
      iframeName: extension.id + '-iframe'
    };

    extension.$payload = this.render(formAttribute, extension.options);
    this._appendExtension($container, extension);
    return $container;
  }

  _appendExtension($container, extension){
    var existingForm = $container.find('form');
    if(existingForm.length > 0) {
      existingForm.destroy();
    }
    $container.prepend(extension.$payload);
  }

  render(attributes, options = {}){
    var renderingMethod = (options.renderingMethod || 'GET').toUpperCase();

    if (renderingMethod === 'GET') {
      return $();
    }

    var url = attributes.url.split('?')[0] || '';
    var queryParams = qs.parse(qs.extract(attributes.url));

    var form = $(document.createElement('form'))
        .attr({
          'id': attributes.iframeFormId,
          'action': url,
          'target': attributes.iframeName,
          'method': renderingMethod
        });

    _.each(queryParams, (value, key) => {
      form.append($(document.createElement('input'))
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

export default IframeFormComponent;