(function(){
    require(["host/content"], function(contentUtilities) {

        var pluginKey = "foo-plugin-key",
        capability = {
            key: "bar-capability-key"
        },
        productContextJson = "",
        contentPath = "/plugins/servlet/ac/" + pluginKey + "/" + capability.key;

        module("Content Utilities", {
            setup: function() {
                AJS.contextPath = function(){ return "https://www.example.com"; };
                this.container = $("<div />").attr("id", "qunit-container").appendTo("body");
                this.server = sinon.fakeServer.create();
                this.server.respondWith("GET", new RegExp(".*" + contentPath + ".*"),
                    [200, { "Content-Type": "text/html" }, 'This is the <span id="my-span">content</span>']);

                $('<a id="qunit-fixture" href="http://foo.com/?width=101&height=200&cp=%2Fconfluence" class="ap-plugin-key-my-plugin ap-module-key-my-module" />').appendTo('body');
            },
            teardown: function() {
                this.container.remove();
                delete AJS.contextPath;
                this.server.restore();
                $('#qunit-fixture').remove();
            },
        });

        test("eventHandler assigns an event handler to the dom node", function(){
            var spy = sinon.spy();

            contentUtilities.eventHandler("click", '#qunit-fixture', spy);
            $('#qunit-fixture').trigger('click');

            ok(spy.calledOnce);
        });

        test("eventHandler callback includes the width", function(){
            var spy = sinon.spy();

            contentUtilities.eventHandler("click", '#qunit-fixture', spy);
            $('#qunit-fixture').trigger('click');

            equal(spy.firstCall.args[1]['width'], '101');
        });

        test("eventHandler callback includes the height", function(){
            var spy = sinon.spy();

            contentUtilities.eventHandler("click", '#qunit-fixture', spy);
            $('#qunit-fixture').trigger('click');

            equal(spy.firstCall.args[1]['height'], '200');
        });

        test("eventHandler callback includes the context path", function(){
            var spy = sinon.spy();

            contentUtilities.eventHandler("click", '#qunit-fixture', spy);
            $('#qunit-fixture').trigger('click');

            equal(spy.firstCall.args[1]['cp'], '/confluence');

        });

        module("Content Utilities class extraction");

        test("getWebItemPluginKey returns the plugin key", function(){
            var $target = $('<div class="ap-plugin-key-the-plugin-key">');
            var key = contentUtilities.getWebItemPluginKey($target);

            equal(key, 'the-plugin-key');
        });

        test("getWebItemModuleKey returns the module key", function(){
            var $target = $('<div class="ap-module-key-the-module-key">');
            var key = contentUtilities.getWebItemModuleKey($target);

            equal(key, 'the-module-key');
        });

        test("getWebItemTargetKey returns the target key if present", function(){
            var $target = $('<div class="ap-target-key-the-target-key">');
            var key = contentUtilities.getWebItemTargetKey($target);

            equal(key, 'the-target-key');
        });

        test("getWebItemTargetKey returns false if target not present", function(){
            var $target = $('<div>');
            var key = contentUtilities.getWebItemTargetKey($target);

            equal(key, false);
        });
    });

})();
