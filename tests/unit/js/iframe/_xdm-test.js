(function(){
    require(['_xdm', '_dollar'], function(XdmRpc, $) {
        module('XDM host', {
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

        test('isActive property is true', function () {
            var xdm = this.createXdm('blank.html');
            ok(xdm.isActive(), 'XDM is active');
        });

        test('isHost is true', function () {
            var xdm = this.createXdm('blank.html');
            ok(xdm.isHost, 'XDM is host');
        });

        test('remoteOrigin is resolved to the iframe baseurl', function() {
            var remoteUrl = 'http://www.example.com?oauth_consumer_key=jira:12345',
            xdm = new XdmRpc($, {
                remoteKey: 'myremotekey',
                remote: remoteUrl,
                container: 'qunit-container',
                channel: 'testchannel',
                props: {}
            }, {
                local: {},
                remote: {}
            });

            equal(xdm.remoteOrigin, "http://www.example.com");
        });

        test('creates an iframe', function () {
            this.createXdm('blank.html');
            equal($("iframe#" + this.iframeId()).length, 1, "Iframe was created");
        });

        test('destroys an iframe', function () {
            var xdm = this.createXdm('blank.html');
            xdm.destroy();
            equal($("iframe#" + this.iframeId()).length, 0, "Iframe was destroyed");
        });

        test('messages are sent and received', function () {
            stop();
            var xdm = this.createXdm('xdm-emit-on.html');
            $("iframe#" + this.iframeId()).load(function(){
                xdm.events.on('clientevent', function(e){
                    equal(e, '9876');
                    xdm.destroy();
                    start();
                });
                xdm.events.emit('hostevent', '9876');
            });
        });

		test('check error message on fail', function(){
			stop();
			AJS.error = sinon.spy();

	        var someXdm = this.createXdm('xdm-error.html', {
	        	'getLocation': function(){
		           	throw new Exception('an exception!');
		    }});

			equal(AJS.error.callCount, 0);
			var testTimeout = setTimeout(function() {
				ok(false, "Error was not called");
				start();
			}, 5000);

			$(window).on("message", function(e){
				var event = e.originalEvent.data;
				if(event.m.n === 'getLocation'){
					ok(AJS.error.calledOnce);
					start();
					clearTimeout(testTimeout);
				}
			});

		});

    });

})();
