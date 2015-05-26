require(['ac/dialog/button'], function(dialogButton) {

    module("Dialog Button", {
    });

    test("Submit Button is set to a primary button", function() {
        var button = dialogButton.submit();
        ok(button.$el.hasClass("aui-button-primary"));
    });

    test("Submit Button has text set to submit", function() {
        var button = dialogButton.submit();
        equal(button.$el.text(), "Submit");
    });

    test("Submit Button done callback is executed on dispatch", function() {
        var spy = sinon.spy();
        var button = dialogButton.submit({
            done: spy
        });
        button.dispatch(true);
        ok(spy.calledOnce);
    });

    test("Submit Button can be disabled", function() {
        var button = dialogButton.submit();
        button.setEnabled(false);
        ok(!button.isEnabled());
    });

    test("Cancel Button is set to a link button", function() {
        var button = dialogButton.cancel();
        ok(button.$el.hasClass("aui-button-link"));
    });

    test("Cancel Button has text set to cancel", function() {
        var button = dialogButton.cancel();
        equal(button.$el.text(), "Cancel");
    });

    test("Cancel Button done callback is executed on dispatch", function() {
        var spy = sinon.spy();
        var button = dialogButton.cancel({
            done: spy
        });
        button.dispatch(true);
        ok(spy.calledOnce);
    });

    test("Cancel Button cannot be disabled", function() {
        var button = dialogButton.cancel();
        button.setEnabled(false);
        ok(button.isEnabled());
    });

    test("setEnabled(true) enables a button", function() {
        var button = dialogButton.submit();
        button.$el.attr('aria-disabled', "true");
        button.setEnabled(true);
        ok(button.isEnabled());
    });

    test("setEnabled(false) disables a button", function() {
        var button = dialogButton.submit();
        button.setEnabled(false);
        ok(!button.isEnabled());
    });

    test("Buttons are enabled by default", function() {
        var button = dialogButton.submit();
        ok(button.isEnabled());
    });

    test("setText changes the button text", function() {
        var button = dialogButton.submit();
        button.setText('abc123');
        equal(button.$el.text(), 'abc123');
    });

});
