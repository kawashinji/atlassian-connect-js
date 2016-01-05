import $ from './dollar';
import rpc from './rpc';

export default function () {
  var debounce = AJS.debounce || $.debounce;
  return {
    init(config, xdm) {
      xdm.resize = debounce(function resize($, width, height) {
        $(this.iframe).css({
          width: width,
          height: height
        });
        var nexus = $(this.iframe).closest('.ap-container');
        nexus.trigger('resized', {
          width: width,
          height: height
        });
      });
    },

    internals: {
      'env': {
        resize(width, height) {
          this.resize($, width, height);
        },

        sizeToParent: debounce(function () {
          function resizeHandler(iframe) {
            var height = $(document).height() - $('#header > nav').outerHeight() - $('#footer').outerHeight() - 20;
            $(iframe).css({
              width: '100%',
              height: height + 'px'
            });
          }
          // sizeToParent is only available for general-pages
          if (this.uiParams.isGeneral) {
            // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
            $(this.iframe).addClass('full-size-general-page');
            $(window).on('resize', function () {
              resizeHandler(this.iframe);
            });
            resizeHandler(this.iframe);
          } else {
            // This is only here to support integration testing
            // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
            $(this.iframe).addClass('full-size-general-page-fail');
          }
        })
      }
    }
  };
}