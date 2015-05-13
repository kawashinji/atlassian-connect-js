import jwtKeepAlive from '../../../src/host/jwt-keep-alive'

var contentResolver;

QUnit.module('Jwt Keep alive', {
    setup: function(){
        // placeholder for the old contentResolver
        if(window._AP.contentResolver){
            contentResolver = window._AP.contentResolver;
        }

        // mock promise that resolves instantly.
        var promise = jQuery.Deferred(function(defer){
            defer.resolve('{"src":"http://www.google.co.uk"}');
        }).promise();

        window._AP.contentResolver = {
            resolveByParameters: sinon.stub().returns(promise)
        };

        // fake add-on configuration
        this.mockConfig = {
            addonKey: 'addon',
            moduleKey: 'module',
            productContext: {},
            uiParams: {},
            height: 10,
            width:10
        };

    },
    teardown: function(){
        //put content resolver back
        window._AP.contentResolver = contentResolver;
    }
});

QUnit.test('updateUrl calls the content resolver', function (assert) {
    window._AP.contentResolver.resolveByParameters.reset();
    jwtKeepAlive.updateUrl(this.mockConfig);
    assert.ok(window._AP.contentResolver.resolveByParameters.calledOnce, "calls the content resolver");
});

QUnit.test('updateUrl returns a promise', function (assert){
    var prom = jwtKeepAlive.updateUrl(this.mockConfig);
    assert.ok(prom.done, "updateUrl returns a promise");
});

QUnit.test('updateUrl promise resolves to the url', function (assert){
    var prom = jwtKeepAlive.updateUrl(this.mockConfig);
    prom.done(function (src){
        assert.equal(src, "http://www.google.co.uk", "url is returned in the promise");
    });
});
