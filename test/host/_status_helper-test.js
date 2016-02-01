import statusHelper from 'src/host/status-helper'

QUnit.module('Status Helper', {
  setup: function() {
    this.container = $('<div />').attr('id', 'qunit-container-status-helper').appendTo('body');
  },

  teardown: function() {
    this.container.remove();
  }
});

QUnit.test('createStatusMessages creates a loading status', function(assert) {
  var dom = statusHelper.createStatusMessages();
  assert.equal(dom.find('.ap-loading').length, 1);
});

QUnit.test('createStatusMessages creates a timeout status', function(assert) {
  var dom = statusHelper.createStatusMessages();
  assert.equal(dom.find('.ap-load-timeout').length, 1);
});

QUnit.test('createStatusMessages creates a error status', function(assert) {
  var dom = statusHelper.createStatusMessages();
  assert.equal(dom.find('.ap-load-error').length, 1);
});

QUnit.test('showLoadingStatus shows the loading status after specified delay', function(assert) {
  var dom = statusHelper.createStatusMessages();
  stop();
  statusHelper.showLoadingStatus(dom, 100);
  assert.ok(dom.find('.ap-loading').hasClass('hidden'));
  setTimeout(function() {
    assert.ok(!dom.find('.ap-loading').hasClass('hidden'));
    start();
  }, 150);
});

QUnit.test('showLoadingStatus shows the loading status immediately when required', function(assert) {
  var dom = statusHelper.createStatusMessages();
  statusHelper.showLoadingStatus(dom);
  assert.ok(!dom.find('.ap-loading').hasClass('hidden'));
});

QUnit.test('showloadTimeoutStatus shows the loading timeout status', function(assert) {
  var dom = statusHelper.createStatusMessages(this.container);
  statusHelper.showloadTimeoutStatus(dom);
  assert.ok(!dom.find('.ap-load-timeout').hasClass('hidden'));

});

QUnit.test('showLoadErrorStatus shows the loading error status', function(assert) {
  var dom = statusHelper.createStatusMessages();
  statusHelper.showLoadErrorStatus(dom);
  assert.ok(!dom.find('.ap-load-error').hasClass('hidden'));

});

QUnit.test('showLoadedStatus hides the status bar', function(assert) {
  var dom = statusHelper.createStatusMessages();
  statusHelper.showLoadedStatus(dom);
  assert.ok(!dom.find('.ap-status:not(.hidden)').length);
});
