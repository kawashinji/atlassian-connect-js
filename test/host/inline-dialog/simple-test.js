import simpleInlineDialog from 'src/host/inline-dialog/simple'
import dollar from 'src/common/dollar'

var INLINE_DIALOG_SELECTOR = '.aui-inline-dialog';
var FIXTURE_CLASS = 'inline-dialog-fixture';
function webitemPlaceholder(pluginKey, moduleKey) {
    var fullKey = pluginKey + '__' + moduleKey;
    return AJS.$('<a id="' + fullKey + '" class="' + FIXTURE_CLASS + ' ap-inline-dialog ap-plugin-key-' + pluginKey + ' ap-module-key-' + fullKey + '"></a>');

}
var webItemInstance;

QUnit.module("Inline Dialog Simple", {
    setup: function() {
        AJS.contextPath = function() { return ""; };
        webItemInstance = webitemPlaceholder('plugin-key', 'module-key');
        AJS.$("#qunit-fixture").append(webItemInstance);

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
        $('.' + FIXTURE_CLASS).remove();
        $('.aui-inline-dialog').remove();
    }
});


QUnit.test("Inline dialog creates an inline dialog", function(assert) {
    var href = "someurl";
    var options = {
        bindTo: webItemInstance
    };
    simpleInlineDialog(href, options);
    assert.equal(AJS.$(".aui-inline-dialog").length, 0);
    webItemInstance.click();
    assert.equal(AJS.$(".aui-inline-dialog").length, 1);
});

QUnit.test("Inline dialog passes context params if specified", function(assert) {
    var href = "someurl";
    var options = {
        bindTo: webItemInstance,
        productContext: {
            'page.id': '1234'
        }
    };
    simpleInlineDialog(href, options);
    webItemInstance.click();
    assert.ok(window._AP.contentResolver.resolveByParameters.args[0][0].productContext);
    assert.equal(window._AP.contentResolver.resolveByParameters.args[0][0].productContext["page.id"], '1234');
});

QUnit.test("Inline dialog returns the inline dialog id", function(assert) {
    var href = "someurl";
    var options = {
        bindTo: webItemInstance
    };

    var inlineDialog = simpleInlineDialog(href, options);
    assert.equal(inlineDialog.id, "inline-dialog-ap-inline-dialog-content-" + webItemInstance.attr('id'));
});

QUnit.test("Inline dialog bails if no element to bind to", function(assert) {
    var options = {
    };
    assert.ok(!simpleInlineDialog("someurl", options));
});

QUnit.test("Inline dialog bails if bind target is not a jQuery object", function(assert) {
    var options = {
        bindTo: webItemInstance[0]
    };
    assert.ok(!simpleInlineDialog("someurl", options));
});

QUnit.test("Inline dialog bails if web-item ID is not found", function(assert) {
    webItemInstance.attr('id', null);
    var options = {
        bindTo: webItemInstance
    };  
    assert.ok(!simpleInlineDialog("someurl", options));
});
