import events from 'src/common/dom-events';

var getMouseEvent = function() {
  var event;
    //This is true only for IE,firefox
  if(document.createEvent){
        // To create a mouse event , first we need to create an event and then initialize it.
    event = document.createEvent('MouseEvent');
    event.initMouseEvent('click',true,true,window,0,0,0,0,0,false,false,false,false,0,null);
  } else {
    event = new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': true
    });
  }
  return event;
};

QUnit.module('Propagate', {
  setup: function () {
  },
  teardown: function () {
    events.unbindListeners();
  }
});

QUnit.test('keyboard event modifier string with no flags set', function (assert) {
  var eventData = {};
  var result = events.constructLegacyModifierString(eventData);
  assert.equal(result, '');
});

QUnit.test('keyboard event modifier string with all flags set', function (assert) {
  var eventData = {
    ctrlKey: true,
    shiftKey: true,
    metaKey: true,
    altKey: true
  };
  var result = events.constructLegacyModifierString(eventData);
  assert.equal(result, 'Shift,Ctrl,Meta,Alt');
});

QUnit.test('only ESC is allowed as key press', function (assert) {
  assert.ok(events.isAllowedKeyCode(AJS.keyCode.ESCAPE));

  for (var i = 0; i < 222; i++) {
    if (i !== AJS.keyCode.ESCAPE) {
      assert.notOk(events.isAllowedKeyCode(i));
    }
  }
});

QUnit.test('bound listeners only propagate supported events', function (assert) {
  var done = assert.async();
  events.bindListeners('test-channel', function (key, name, data) {
    assert.ok(name, 'click');
  });
  document.dispatchEvent(getMouseEvent());
  done();
});

QUnit.test('bound listeners only propagate events to other channels', function (assert) {
  var done = assert.async();
  events.bindListeners('test-channel', function (key, name, data) {
    assert.ok(name, 'click');
  });

  var event = getMouseEvent();

    // Same channel - expect no propagation (+0)
  event.channelKey = 'test-channel';
  document.dispatchEvent(event);

    // Different channel - expect propagation (+1)
  event.channelKey = 'another-channel';
  document.dispatchEvent(event);

    // No channel (native event) - expect propagation (+1)
  delete event.channelKey;
  document.dispatchEvent(event);

  assert.expect(2);
  done();
});

QUnit.test('bound listeners with multiple channels', function (assert) {
  var done = assert.async();
  var totalAssertions = 5;
  var callbackCounter = 0;
  var tester = function (key, name, data) {
    assert.ok(name, 'click');
    callbackCounter++;
    if(callbackCounter === totalAssertions) {
      done();
    }
  };

  events.bindListeners('test-channel-1', tester);
  events.bindListeners('test-channel-2', tester);

  var event = getMouseEvent();

    // No match - expect propagation to all channels (+2)
  event.channelKey = 'test-channel';
  document.dispatchEvent(event);

    // Matched channel - expect propagation to other channels (+1)
  event.channelKey = 'test-channel-1';
  document.dispatchEvent(event);

    // No channel (native event) - expect propagation to all channels (+2)
  delete event.channelKey;
  document.dispatchEvent(event);

  assert.expect(totalAssertions);
});

QUnit.test('create event with supported mouse event type', function (assert) {
  var result = events.createEvent('key', 'click', {
    button: 1
  });

  assert.ok(typeof result !== 'undefined');
  assert.strictEqual(result.button, 1);
  assert.strictEqual(result.type, 'click');
  assert.strictEqual(result.channelKey, 'key');
});

QUnit.test('create event with unsupported mouse event type', function (assert) {
  var result = events.createEvent('key', 'mousedown', {
    button: 1
  });

  assert.ok(typeof result === 'undefined');
});

QUnit.test('create event with supported keyboard event type', function (assert) {
  var result = events.createEvent('key', 'keydown', {
    keyCode: 27
  });

  assert.ok(typeof result !== 'undefined');
  assert.strictEqual(result.type, 'keydown');
});

QUnit.test('create event with unsupported keyboard event type', function (assert) {
  var result = events.createEvent('key', 'keypress', {
    keyCode: 27
  });

  assert.ok(typeof result === 'undefined');
});