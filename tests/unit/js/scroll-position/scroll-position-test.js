(function(){
    require(['ac/scrollPosition'], function(scrollPosition) {
        var sandbox;
        module("scrollPosition", {
            setup: function() {
                sandbox = sinon.sandbox.create();
                sandbox.spy(window.AJS, 'log');
            },
            teardown: function() {
                sandbox.restore();
            }
        });

        test('when not a general page', function () {
            equal(scrollPosition.getPosition.call({ uiParams: { isGeneral: false }}), undefined);
            ok(window.AJS.log.calledOnce, 'Should log a message to AJS');
        });

        test('when on a general page', function () {
            var boundingClientRect = {
                top: 123,
                left: 456
            };

            var fakeThis = {
                uiParams: {
                    isGeneral: true
                },
                iframe: {
                    getBoundingClientRect: sandbox.stub().returns(boundingClientRect)
                }
            };

            deepEqual(scrollPosition.getPosition.call(fakeThis), {
                scrollY: window.scrollY - (boundingClientRect.top + document.body.scrollTop),
                scrollX: window.scrollX - (boundingClientRect.left + document.body.scrollLeft),
                width: window.innerWidth,
                height: window.innerHeight
            });
        });


    });

})();
