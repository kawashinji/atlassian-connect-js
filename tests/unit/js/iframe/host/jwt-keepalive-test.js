(function(){

    require(['host/jwt-keepalive'], function(jwtKeepAlive) {

        var contentResolver;

        module('Jwt Keep alive', {
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

        test('updateUrl calls the content resolver', function () {
            window._AP.contentResolver.resolveByParameters.reset();
            jwtKeepAlive.updateUrl(this.mockConfig);
            ok(window._AP.contentResolver.resolveByParameters.calledOnce, 'calls the content resolver');
        });

        test('updateUrl returns a promise', function (){
            var prom = jwtKeepAlive.updateUrl(this.mockConfig);
            ok(prom.done, 'updateUrl returns a promise');
        });

        test('updateUrl promise resolves to the url', function (){
            var prom = jwtKeepAlive.updateUrl(this.mockConfig);
            prom.done(function (src){
                equal(src, 'http://www.google.co.uk', 'url is returned in the promise');
            });
        });

    });

})();
