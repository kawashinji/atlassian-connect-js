define("resize", ["_dollar", "_rpc"], function ($, rpc) {
    "use strict";
    rpc.extend(function () {
        return {
            init: function (config, xdm) {
                xdm.resize = AJS.debounce(function resize ($, width, height) {
                    $(this.iframe).css({width: width, height: height});
                    var nexus = $(this.iframe).closest('.ap-container');
                    nexus.trigger('resized', {width: width, height: height});

                });
            },
            internals: {
                resize: function(width, height) {
                    if(!this.uiParams.isDialog){
                        this.resize($, width, height);
                    }
                },
                sizeToParent: AJS.debounce(function(hideFooter) {

                    var resizeHandler = function (iframe) {
                        var height;
                        if (hideFooter) {
                            $('#footer').css({display: "none"});
                            height = $(window).height() - $("#header > nav").outerHeight();
                        } else {
                            height = $(window).height() - $("#header > nav").outerHeight() - $("#footer").outerHeight() - 20;
                        }

                        $(iframe).css({width: "100%", height: height + "px"});
                    };
                    // sizeToParent is only available for general-pages
                    if (this.uiParams.isGeneral) {
                        // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
                        $(this.iframe).addClass("full-size-general-page");
                        $(window).on('resize', function(){
                            resizeHandler(this.iframe);
                        });
                        resizeHandler(this.iframe);
                    }
                    else {
                        // This is only here to support integration testing
                        // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
                        $(this.iframe).addClass("full-size-general-page-fail");
                    }
                })
            }
        };
    });

});

require("resize");