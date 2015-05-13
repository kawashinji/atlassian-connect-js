import XdmRpc from '../../src/common/xdm-rpc'
import $ from '../../src/common/dollar'

QUnit.module('XDM host', {
    setup: function() {
        this.container = $("<div />").attr("id", "qunit-container-xdm-host").appendTo("body");
    },
    teardown: function() {
        this.container.remove();
    },
    iframeId: function() {
        return "easyXDM_qunit-container-xdm-host_provider";
    },
    createXdm: function(fixture, local){
        local = local ? local : {};
        var f = fixture || 'xdm-emit.html';
        return new XdmRpc($, {
            remoteKey: 'myremotekey',
            remote: this.getBaseUrl() + '/base/tests/unit/fixtures/' + f + '?oauth_consumer_key=jira:12345&xdm_e=' + encodeURIComponent(this.getBaseUrl()) + '&xdm_c=testchannel',
            container: 'qunit-container-xdm-host',
            channel: 'testchannel',
            props: {}
        }, {
            local: local,
            remote: {}
        });
    },
    getBaseUrl: function(){
        if (!window.location.origin) {
            window.location.origin = window.location.protocol+"//"+window.location.host;
        }
        return window.location.origin;
    }
});

QUnit.test('isActive property is true', function (assert) {
    var xdm = this.createXdm('blank.html');
    assert.ok(xdm.isActive(), 'XDM is active');
});

QUnit.test('isHost is true', function (assert) {
    var xdm = this.createXdm('blank.html');
    assert.ok(xdm.isHost, 'XDM is host');
});

QUnit.test('remoteOrigin is resolved to the iframe baseurl', function() {
    var remoteUrl = 'http://www.example.com?oauth_consumer_key=jira:12345',
    xdm = new XdmRpc($, {
        remoteKey: 'myremotekey',
        remote: remoteUrl,
        container: 'qunit-container',
        channel: 'testchannel',
        props: {}
    }, {
        local: [],
        remote: {}
    });

    assert.equal(xdm.remoteOrigin, "http://www.example.com");
});

QUnit.test('creates an iframe', function (assert) {
    this.createXdm('blank.html');
    assert.equal($("iframe#" + this.iframeId()).length, 1, "Iframe was created");
});

QUnit.test('destroys an iframe', function (assert) {
    var xdm = this.createXdm('blank.html');
    xdm.destroy();
    assert.equal($("iframe#" + this.iframeId()).length, 0, "Iframe was destroyed");
});

QUnit.test('messages are sent and received', function (assert) {
    stop();
    var xdm = this.createXdm('xdm-emit-on.html');
    $("iframe#" + this.iframeId()).load(function(){
        xdm.events.on('clientevent', function(e){
            assert.equal(e, '9876');
            xdm.destroy();
            start();
        });
        xdm.events.emit('hostevent', '9876');
    });
});

QUnit.test('check error message on fail', function(){
    stop();
    AJS.error = sinon.spy();

    var someXdm = this.createXdm('xdm-error.html', {
        'getLocation': function(){
          throw new Exception('an exception!');
        }});

        assert.equal(AJS.error.callCount, 0);

        var testTimeout = setTimeout(function() {
            assert.ok(false, "Error was not called");
            start();
        }, 5000);

        $(window).on("message", function(e){
          var event = JSON.parse(e.originalEvent.data);
          if(event.m.n === 'getLocation'){
              assert.ok(AJS.error.calledOnce);
              start();
              clearTimeout(testTimeout);
          }
    });
});
