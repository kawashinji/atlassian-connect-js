import IframeFormUtils from './utils/iframe_form';

const MAXIMUM_RETRY = 50;

function create(attributes, data) {
  if (!data) {
    data = IframeFormUtils.dataFromUrl(attributes.url);
    attributes.url = IframeFormUtils.urlWithoutData(attributes.url);
  }

  var form = document.createElement('form');
  form.setAttribute('id', attributes.id || IframeFormUtils.randomIdentifier());
  form.setAttribute('class', 'ap-iframe-form');
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

function submitOnceContainerAppended(container) {
  var observer = new MutationObserver(function (mutations) {
    console.debug(container);
    console.debug(mutations);

    var nodeAdded = false;
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        nodeAdded = true;
        return false;
      }
    });

    if (nodeAdded) {
      var form = container.getElementsByClassName('ap-iframe-form');
      if (form.length) {
        form[0].submit();
      }
      observer.disconnect();
    }
  });
  observer.observe(container, {childList: true, subtree: true, attributes: true});
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

      container.appendChild(create({
        target: iframe.getAttribute('name'),
        url: iframe.getAttribute('src'),
        method: renderingMethod
      }));

      // Set iframe source to empty to avoid loading the page
      iframe.setAttribute('src', '');

      submitOnceContainerAppended(container);
    }
  }

};