import $ from './dollar';

function getMeta(name) {
  return $(`meta[name='ap-${name}']`).attr('content');
}

export default {
  getMeta: getMeta,

  container: function() {
    const container = $('.ac-content, #content');
    return container.length > 0 ? container[0]: document.body;
  },

  localUrl: function(path) {
    const url = getMeta('local-base-url');
    return typeof url === 'undefined' || typeof path === 'undefined' ? url : `${url}${path}`;
  }
}