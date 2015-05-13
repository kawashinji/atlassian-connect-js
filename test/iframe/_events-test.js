import events from '../../src/common/events'
import $ from '../../src/common/dollar'

var Events = events.Events;

QUnit.module('Events');

QUnit.test('emits basic events', function (assert) {
  var bus = new Events();
  var spy = sinon.spy();

  bus.on('foo', spy);
  bus.emit('foo');

  assert.ok(spy.calledOnce, "Spy was called");
});

QUnit.test('emits events with arbitrary arguments', function(assert) {
  var bus = new Events();
  var spy = sinon.spy();

  bus.on('foo', spy);
  bus.emit('foo', 1, 2, 3);

  assert.ok(spy.withArgs(1, 2, 3), "Args were passed to spy");
});

QUnit.test('emits events with an event object as the last argument', function(assert) {
  var bus = new Events();
  var spy = sinon.spy();

  bus.on('foo', spy);
  bus.emit('foo', 1, 2, 3);

  var event = spy.firstCall.args[3];
  assert.equal(typeof event, 'object');
  assert.equal(event.name, 'foo');
  assert.deepEqual(event.args, [1, 2, 3]);
});

QUnit.test('emits events with the key and origin that were passed to the constructor', function(assert) {
  var bus = new Events('my-key', 'my-origin');
  var spy = sinon.spy();

  bus.on('foo', spy);
  bus.emit('foo');

  var event = spy.firstCall.args[0];
  assert.equal(event.source.origin, 'my-origin');
  assert.equal(event.source.key, 'my-key');
});

QUnit.test('emits events for multiple handlers', function(assert) {
  var bus = new Events();
  var spy1 = sinon.spy();
  var spy2 = sinon.spy();

  bus.on('foo', spy1);
  bus.on('foo', spy2);
  bus.emit('foo');

  assert.ok(spy1.calledOnce);
  assert.ok(spy2.calledOnce);
});

QUnit.test('does not collide events with different names', function(assert) {
  var bus = new Events();
  var spy1 = sinon.spy();
  var spy2 = sinon.spy();

  bus.on('foo', spy1);
  bus.on('bar', spy2);
  bus.emit('bar');
  bus.emit('foo');

  assert.ok(spy1.calledOnce);
  assert.ok(spy2.calledOnce);
});

QUnit.test('only executes a "once" listener once', function(assert) {
  var bus = new Events();
  var spy = sinon.spy();

  bus.once('foo', spy);
  bus.emit('foo');
  bus.emit('foo');

  assert.ok(spy.calledOnce);
});

QUnit.test('fires an "onAny" listener on any event', function(assert) {
  var bus = new Events();
  var spy = sinon.spy();

  bus.onAny(spy);
  bus.emit('foo');
  bus.emit('bar');

  assert.equal(spy.callCount, 2);
});

QUnit.test('fires an "onAny" listener with all expected arguments', function(assert) {
  var bus = new Events('my-key', 'my-origin');
  var spy = sinon.spy();

  bus.onAny(spy);
  bus.emit('foo', 1, 2, 3);

  assert.ok(spy.withArgs(1, 2, 3), "Args were passed to spy");
  var event = spy.firstCall.args[4];
  assert.equal(typeof event, 'object');
  assert.equal(event.name, 'foo');
  assert.deepEqual(event.args, [1, 2, 3]);
  assert.equal(event.source.origin, 'my-origin');
  assert.equal(event.source.key, 'my-key');
});

QUnit.test('allows listeners to be removed', function(assert) {
  var bus = new Events();
  var spy = sinon.spy();

  bus.on('foo', spy);
  bus.emit('foo');
  bus.off('foo', spy);
  bus.emit('foo');

  assert.equal(spy.callCount, 1);
});

QUnit.test('allows all listeners to be removed by name', function (assert) {
  var bus = new Events();
  var spy1 = sinon.spy();
  var spy2 = sinon.spy();

  bus.on('foo', spy1).on('foo', spy2);
  bus.emit('foo');
  bus.offAll('foo');
  bus.emit('foo');

  assert.equal(spy1.callCount, 1);
  assert.equal(spy2.callCount, 1);
});

QUnit.test('only removes listeners by name', function (assert) {
  var bus = new Events();
  var spy = sinon.spy();

  bus.on('foo', spy);
  bus.offAll('bar');
  bus.emit('foo');

  assert.equal(spy.callCount, 1);
});

QUnit.test('allows all listeners to be removed', function (assert) {
  var bus = new Events();
  var spy1 = sinon.spy();
  var spy2 = sinon.spy();

  bus.on('foo', spy1).on('foo', spy2);
  bus.on('bar', spy1).on('bar', spy2);
  bus.emit('foo').emit('bar');
  bus.offAll();
  bus.emit('foo').emit('bar');

  assert.equal(spy1.callCount, 2);
  assert.equal(spy2.callCount, 2);
});

QUnit.test('allows an any listener to be removed', function (assert) {
  var bus = new Events();
  var spy = sinon.spy();

  bus.onAny(spy);
  bus.emit('foo');
  bus.offAny(spy);
  bus.emit('foo');

  assert.ok(spy.calledOnce);
});
