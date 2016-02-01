import messages from 'src/host/messages/api'

QUnit.module('Messages Main', {
  setup: function() {
    AJS.contextPath = function() {
      return '';
    };
    $('<div id="qunit-fixture-messages" />').appendTo('body');
  },
  teardown: function() {
    $('#qunit-fixture-messages').remove();
    $('#ac-message-container').remove();
  }
});

QUnit.test('showMessage creates a valid AUI message', function(assert) {
  var title = 'my title';
  var type = 'info';
  var body = 'some body';
  var messageId = 'ap-message-2';
  messages.showMessage(type, title, body, {id: messageId});
  var message = AJS.$('.aui-message');
  assert.ok(message.hasClass(type));
  assert.equal(message.find('.title').text(), title);
  assert.equal(AJS.$('.aui-message:contains(' + body + ')').length, 1);
  assert.equal(AJS.$('.aui-message:contains(' + body + ')').length, 1);
  assert.equal(AJS.$('.aui-message#' + messageId).length, 1);
});

QUnit.test('clearMessage removes valid elements from the dom', function (assert) {
  var title = 'my title';
  var type = 'info';
  var body = 'some body';
  var messageId = 'ap-message-222';
  messages.showMessage(type, title, body, {id: messageId});
  assert.equal(AJS.$('.aui-message').length, 1);
  messages.clearMessage(messageId);
  assert.equal(AJS.$('.aui-message').length, 0);
});

QUnit.test('clearMessage only removes valid messages', function (assert) {
  var fakeMessageId = 'somethinginvalid';
  var title = 'my title';
  var type = 'info';
  var body = 'some body';
  var messageId = 'ap-message-222';
  messages.showMessage(type, title, body, {id: messageId});
  assert.equal(AJS.$('.aui-message').length, 1);
  messages.clearMessage(fakeMessageId);
  assert.equal(AJS.$('.aui-message').length, 1);
});
