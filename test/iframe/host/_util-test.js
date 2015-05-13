import util from '../../../src/host/util'

QUnit.module("Host Utils", {
    setup: function() {
        this.container = $("<div>container</div>").attr("id", "qunit-container").appendTo("body");
    },
    teardown: function() {
        this.container.remove();
    }
});

QUnit.test("escapeSelector enables selection of ids with funny characters", function(assert){
    var id = "com.blarhmee.hsometh-in4_5gan[ot43]458@he$rThing",
    text = "hello world";

    this.container.append('<div id="' + id + '">' + text + '</div>');
    assert.equal($('#' + util.escapeSelector(id)).text(), text);
});

QUnit.test("all reserved characters are escaped", function(assert) {
    var reserved = "!\"#$%&'()*+,.\/:;<=>?@[\\]^`{|}~";
    assert.equal(util.escapeSelector(reserved), "\\!\\\"\\#\\$\\%\\&\\'\\(\\)\\*\\+\\,\\.\\/\\:\\;\\<\\=\\>\\?\\@\\[\\\\\\]\\^\\`\\{\\|\\}\\~");
});
