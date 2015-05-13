import dialogButton from '../../src/host/dialog/button'

QUnit.module("Dialog Button", {
});

QUnit.test("Submit Button is set to a primary button", function(assert) {
    var button = dialogButton.submit();
    assert.ok(button.$el.hasClass("aui-button-primary"));
});

QUnit.test("Submit Button has text set to submit", function(assert) {
    var button = dialogButton.submit();
    assert.equal(button.$el.text(), "Submit");
});

QUnit.test("Submit Button done callback is executed on click", function(assert) {
    var spy = sinon.spy();
    var button = dialogButton.submit({
        done: spy
    });
    button.click();
    assert.ok(spy.calledOnce);
});

QUnit.test("Submit Button done callback doesn't execute if custom callback is registered", function(assert) {
    var spy = sinon.spy();
    var customCallback = sinon.spy();

    var button = dialogButton.submit({
        done: spy
    });
    button.click(customCallback);
    assert.ok(spy.notCalled);
    assert.ok(customCallback.notCalled);

    button.$el.trigger('ra.dialog.click');
    assert.ok(customCallback.calledOnce);
    assert.ok(spy.notCalled);
});


QUnit.test("Submit Button can be disabled", function(assert) {
    var button = dialogButton.submit();
    button.setEnabled(false);
    assert.ok(!button.isEnabled());
});

QUnit.test("Cancel Button is set to a link button", function(assert) {
    var button = dialogButton.cancel();
    assert.ok(button.$el.hasClass("aui-button-link"));
});

QUnit.test("Cancel Button has text set to cancel", function(assert) {
    var button = dialogButton.cancel();
    assert.equal(button.$el.text(), "Cancel");
});

QUnit.test("Cancel Button done callback is executed on click", function(assert) {
    var spy = sinon.spy();
    var button = dialogButton.cancel({
        done: spy
    });
    button.click();
    assert.ok(spy.calledOnce);
});

QUnit.test("Cancel Button cannot be disabled", function(assert) {
    var button = dialogButton.cancel();
    button.setEnabled(false);
    assert.ok(button.isEnabled());
});

QUnit.test("setEnabled(true) enables a button", function(assert) {
    var button = dialogButton.submit();
    button.$el.attr('aria-disabled', "true");
    button.setEnabled(true);
    assert.ok(button.isEnabled());
});

QUnit.test("setEnabled(false) disables a button", function(assert) {
    var button = dialogButton.submit();
    button.setEnabled(false);
    assert.ok(!button.isEnabled());
});

QUnit.test("Buttons are enabled by default", function(assert) {
    var button = dialogButton.submit();
    assert.ok(button.isEnabled());
});

QUnit.test("click binds an event to ra.dialog.click if passed a function", function(assert) {
    var spy = sinon.spy();
    var button = dialogButton.submit();
    button.click(spy);
    assert.ok(spy.notCalled);
    button.$el.trigger('ra.dialog.click');
    assert.ok(spy.calledOnce);
});

QUnit.test("setText changes the button text", function(assert) {
    var button = dialogButton.submit();
    button.setText('abc123');
    assert.equal(button.$el.text(), 'abc123');
});
