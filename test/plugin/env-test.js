import env from 'src/plugin/env';
import rpc from 'src/plugin/rpc';

QUnit.module('Env', {
  setup: function() {
    this.createFixtureContainer();

    this.clock = sinon.useFakeTimers();
  },
  createMetaTag: function(name, content){
    var meta = document.createElement('meta');
    meta.setAttribute('name', name);
    meta.content = content;
    document.getElementsByTagName('head')[0].appendChild(meta);
    return meta;
  },
  createFixtureContainer: function(){
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.metaBaseUrl =  this.createMetaTag('ap-local-base-url', 'http://www.example.com/confluence');
    this.metaFixture =  this.createMetaTag('ap-fixture', 'foo bar');
  },
  createAcContainer: function(opts){
    var acContainer = document.createElement('div');
    $.extend(acContainer, opts);
    this.container.appendChild(acContainer);
    return acContainer;
  },
  teardown: function() {
    this.clock.restore();
    document.body.removeChild(this.container);
    var head = document.getElementsByTagName('head')[0];
    head.removeChild(this.metaBaseUrl);
    head.removeChild(this.metaFixture);
  },
});

QUnit.test('meta tag is found', function(assert) {
  assert.equal(env.meta('fixture'), 'foo bar');
});

QUnit.test('non existant meta tag is not found', function(assert) {
  assert.ok(!env.meta('fdsjnfks'));
});

QUnit.test('#content container found', function(assert) {
  var acContainer = this.createAcContainer({
    'id': 'content',
    'innerHTML': '<span>foo bar</span>'
  });
  assert.equal(env.container().innerHTML, acContainer.innerHTML);
});

QUnit.test('.ac-content container found', function(assert) {
  var acContainer = this.createAcContainer({
    'className': 'ac-content',
    'innerHTML': '<span>foo bar</span>'
  });

  assert.equal(env.container().innerHTML, acContainer.innerHTML);
});

QUnit.test('container not found', function(assert) {
  assert.equal(env.container().nodeName, 'BODY');
});

QUnit.test('localUrl', function(assert) {
  assert.equal(env.localUrl(), 'http://www.example.com/confluence');
});

QUnit.test('localUrl appends the path', function(assert) {
  assert.equal(env.localUrl('/abc'), 'http://www.example.com/confluence/abc');
});

QUnit.test('size gets correct height', function(assert) {
  var dim;
  var height = 50;
  var acContainer = this.createAcContainer({
    'className': 'ac-content',
    'innerHTML': '<span>foo bar</span>',
  });
  acContainer.style.height = height + 'px';
  dim = env.size(null, null, acContainer);

  assert.equal(dim.h, height);
});

QUnit.test('size gets 100% width by default', function(assert) {
  var dim;
  var width = 50;
  var acContainer = this.createAcContainer({
    'className': 'ac-content',
    'innerHTML': '<span>foo bar</span>',
  });
  acContainer.style.width = width + 'px';
  dim = env.size(null, null, acContainer);

  assert.equal(dim.w, '100%');
});

QUnit.test('size returns passed width', function(assert) {
  var dim;
  var width = 50;
  var acContainer = this.createAcContainer({
    'className': 'ac-content',
    'innerHTML': '<span>foo bar</span>',
  });
  dim = env.size(width, null, acContainer);
  assert.equal(dim.w, width);
});

QUnit.test('size returns passed height', function(assert) {
  var dim;
  var height = 50;
  var acContainer = this.createAcContainer({
    'className': 'ac-content',
    'innerHTML': '<span>foo bar</span>',
  });
  dim = env.size(null, height, acContainer);
  assert.equal(dim.h, height);
});

//xdm bridge methods.
QUnit.skip('getLocation calls remote getLocation', function(assert) {
  env.getLocation();
  assert.ok(xdmMockEnv.getLocation.calledOnce);
});


QUnit.skip('getLocation passes callback to remote method', function(assert) {
  var spy = sinon.spy();
  env.getLocation(spy);
  assert.equal(xdmMockEnv.getLocation.args[0][0], spy);
});

QUnit.skip('resize calls remote resize', function(assert) {
  env.resize();
    //resize runs every 50ms.
  this.clock.tick(50);
  assert.ok(xdmMockEnv.resize.calledOnce);
});

QUnit.skip('resize calls remote resize with width', function(assert) {
  var width = 20;
  env.resize(width);
    //resize runs every 50ms.
  this.clock.tick(50);
  assert.equal(xdmMockEnv.resize.args[0][0], width);
});

QUnit.skip('resize calls remote resize with height', function(assert) {
  var height = 23;
  env.resize(null, height);
    //resize runs every 50ms.
  this.clock.tick(50);
  assert.equal(xdmMockEnv.resize.args[0][1], height);
});

QUnit.skip('sizeToParent calls remote sizeToParent', function(assert) {
  env.sizeToParent();
    //sizeToParent runs every 50ms.
  this.clock.tick(50);
  assert.ok(xdmMockEnv.sizeToParent.calledOnce);
});
