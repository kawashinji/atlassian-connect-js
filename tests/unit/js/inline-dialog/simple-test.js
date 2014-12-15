(function(){
    require(['inline-dialog/simple', "_dollar"], function(simpleInlineDialog, $) {
        var INLINE_DIALOG_SELECTOR = '.aui-inline-dialog';

        module("Inline Dialog Simple", {
            setup: function() {
                var inlineDialogMock = $('<div id="ap-acmodule-foo"></div>');
                AJS.contextPath = function() { return ""; };
                $content = $('<div class="' + INLINE_DIALOG_SELECTOR + '"><div class="ap-content"></div></div>');
                $('<div id="qunit-fixture">').append($content).appendTo('body');

                this.showPopupMock = sinon.spy();
                AJS.InlineDialog = sinon.stub().yields(
                    inlineDialogMock,
                    $('<a class="ap-plugin-key-addon ap-module-key-addon__module">link</a>'),
                    this.showPopupMock)
                .returns(inlineDialogMock);

                // content resolver that would usually be implemented by the product.
                var contentResolverPromise = this.contentResolverPromise =  {
                    done: sinon.stub().returns($.Deferred().promise()),
                    fail: sinon.stub().returns($.Deferred().promise())
                };
                window._AP.contentResolver = {
                    resolveByParameters: sinon.stub().returns(this.contentResolverPromise)
                };

            },
            teardown: function() {
                delete window._AP.contentResolver;
                //restore _AP.create to it's default state.
                this.showPopupMock.reset();
                AJS.InlineDialog = null;
                $('#qunit-fixture').remove();
            }
        });


        test("Inline dialog creates an inline dialog", function() {
            var href = "someurl";
            var options = {
                bindTo: $("<div id='acmodule-foo' class='ap-inline-dialog'></div>")
            };
            simpleInlineDialog(href, options);
            ok(AJS.InlineDialog.calledOnce);
        });

        test("Inline dialog passes context params if specified", function() {
            var href = "someurl";
            var options = {
                bindTo: $("<div id='acmodule-foo' class='ap-inline-dialog'></div>"),
                productContext: {
                    'page.id': '1234'
                }
            };
            simpleInlineDialog(href, options);
            ok(window._AP.contentResolver.resolveByParameters.args[0][0].productContext);
            equal(window._AP.contentResolver.resolveByParameters.args[0][0].productContext["page.id"], '1234');
        });

        test("Inline dialog returns the inline dialog id", function() {
            var href = "someurl";
            var options = {
                bindTo: $("<div id='irrelevent_id' class='ap-inline-dialog'></div>")
            };

            var inlineDialog = simpleInlineDialog(href, options);
            equal(inlineDialog.id, "ap-acmodule-foo");
        });

        test("Inline dialog bails if no element to bind to", function() {
            var options = {
            };
            ok(!simpleInlineDialog("someurl", options));
        });

        test("Inline dialog bails if bind target is not a jQuery object", function() {
            var options = {
                bindTo: $("<div id='acmodule-foo' class='ap-inline-dialog'></div>")[0]
            };
            ok(!simpleInlineDialog("someurl", options));
        });

        test("Inline dialog bails if web-item ID is not found", function() {
            var options = {
                bindTo: $("<div class='ap-inline-dialog'></div>")
            };
            ok(!simpleInlineDialog("someurl", options));
        });
    });

})();
