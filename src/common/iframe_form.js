import IframeFormUtils from './utils/iframe_form';
import InsertionDetection from './insertion_detection';

const IDENTIFIER = 'insertion-detection-iframe-form';

function create(attributes, data) {
  if (!data) {
    data = IframeFormUtils.dataFromUrl(attributes.url);
    attributes.url = IframeFormUtils.urlWithoutData(attributes.url);
  }

  var form = document.createElement('form');
  form.setAttribute('id', attributes.id || IframeFormUtils.randomIdentifier());
  form.setAttribute('class', 'ap-iframe-form ' + IDENTIFIER);
  form.setAttribute('action', attributes.url);
  form.setAttribute('target', attributes.target);
  form.setAttribute('method', attributes.method);
  Object.keys(data).forEach(key => {
    var input = document.createElement('input');
    input.setAttribute('name', key);
    input.setAttribute('type', 'hidden');
    input.setAttribute('value', data[key]);
    form.appendChild(input);
  });

  return form;
}

export default {

  createIfNecessary(container, renderingMethod) {
    if (container.length) {
      // Get raw element if it is a jquery like object
      container = container[0];
    }

    var iframe = container.getElementsByTagName('iframe');
    if(iframe.length && renderingMethod !== 'GET') {
      iframe = iframe[0];

      var form = create({
        target: iframe.getAttribute('name'),
        url: iframe.getAttribute('src'),
        method: renderingMethod
      });
      container.appendChild(form);

      // Set iframe source to empty to avoid loading the page
      iframe.setAttribute('src', '');

      InsertionDetection.onceElementInserted(container, IDENTIFIER, function() {
        form.submit();
      });
    }
  }

};