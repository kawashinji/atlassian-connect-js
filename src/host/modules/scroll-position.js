function getScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function getScrollLeft() {
  return window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
}

export default {
  /**
   * Get's the scroll position relative to the browser viewport
   *
   * @param callback {Function} callback to pass the scroll position
   * @noDemo
   * @example
   * AP.scrollPosition.getPosition(function(obj) { console.log(obj); });
   */
  getPosition: function (callback) {
    var rect = this.iframe.getBoundingClientRect();
    var iframeTop = rect.top + getScrollTop();
    var iframeLeft = rect.left + getScrollLeft();

    // Todo: work out if on general page or not
    callback({
      scrollY: window.scrollY - iframeTop,
      scrollX: window.scrollX - iframeLeft,
      width: window.innerWidth,
      height: window.innerHeight
    });
  }
};
