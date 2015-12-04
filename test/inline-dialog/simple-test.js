import simpleInlineDialog from '../../src/host/inline-dialog/simple'
import dollar from '../../src/common/dollar'

var INLINE_DIALOG_SELECTOR = '.aui-inline-dialog';
var FIXTURE_ID = 'inline-dialog-fixture';

QUnit.module("Inline Dialog Simple", {
    setup: function() {
        var inlineDialogMock = $('<div id="ap-acmodule-foo"></div>');
        this.store = {
            contextPath: window.AJS.contextPath,
            inlineDialog: window.AJS.InlineDialog
        };
        AJS.contextPath = function() { return ""; };
        var $content = $('<div class="' + INLINE_DIALOG_SELECTOR + '"><div class="ap-content"></div></div>');
        $('<div id="' + FIXTURE_ID + '">').append($content).appendTo('body');

        this.showPopupMock = sinon.spy();

        window.AJS.InlineDialog = sinon.stub().yields(
            inlineDialogMock,
            $('<a class="ap-plugin-key-addon ap-module-key-addon__module">link</a>'),
            this.showPopupMock)
        .returns(inlineDialogMock);

        // content resolver that would usually be implemented by the product.
        var contentResolverPromise = this.contentResolverPromise =  {
            done: sinon.stub().returns($.Deferred().promise()),
            fail: sinon.stub().returns($.Deferred().promise())
        };

        window._AP = window._AP || {};
        window._AP.contentResolver = {
            resolveByParameters: sinon.stub().returns(this.contentResolverPromise)
        };

    },
    teardown: function() {
        //restore _AP.create to it's default state.
        this.showPopupMock.reset();
        window.AJS.InlineDialog = this.store.inlineDialog;

        $('#' + FIXTURE_ID).remove();
    }
});


QUnit.test("Inline dialog creates an inline dialog", function(assert) {
    var href = "someurl";
    var options = {
        bindTo: $("<div id='acmodule-foo' class='ap-inline-dialog'></div>")
    };
    simpleInlineDialog(href, options);
    assert.ok(AJS.InlineDialog.calledOnce);
});

QUnit.test("Inline dialog passes context params if specified", function(assert) {
    var href = "someurl";
    var options = {
        bindTo: $("<div id='acmodule-foo' class='ap-inline-dialog'></div>"),
        productContext: {
            'page.id': '1234'
        }
    };
    simpleInlineDialog(href, options);
    assert.ok(window._AP.contentResolver.resolveByParameters.args[0][0].productContext);
    assert.equal(window._AP.contentResolver.resolveByParameters.args[0][0].productContext["page.id"], '1234');
});

QUnit.test("Inline dialog returns the inline dialog id", function(assert) {
    var href = "someurl";
    var options = {
        bindTo: $("<div id='irrelevent_id' class='ap-inline-dialog'></div>")
    };

    var inlineDialog = simpleInlineDialog(href, options);
    assert.equal(inlineDialog.id, "ap-acmodule-foo");
});

QUnit.test("Inline dialog bails if no element to bind to", function(assert) {
    var options = {
    };
    assert.ok(!simpleInlineDialog("someurl", options));
});

QUnit.test("Inline dialog bails if bind target is not a jQuery object", function(assert) {
    var options = {
        bindTo: $("<div id='acmodule-foo' class='ap-inline-dialog'></div>")[0]
    };
    assert.ok(!simpleInlineDialog("someurl", options));
});

QUnit.test("Inline dialog bails if web-item ID is not found", function(assert) {
    var options = {
        bindTo: $("<div class='ap-inline-dialog'></div>")
    };
    assert.ok(!simpleInlineDialog("someurl", options));
});
