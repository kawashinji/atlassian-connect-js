// import request from 'atlassian-connect-js-request';
var x = function(){
    console.log(arguments);
};
var addonDomain = 'http://localhost:8080';
var jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmZjgwODE4MTQwYjcwNDhkMDE0MGJkOTNkMWYwMDAwNyIsInFzaCI6IjhkMDQ0M2U2MTBjNjc0MGEwYzFmMmJmNmRjOTVkYTk2MTYzM2I4ZjE5MThjMGE1NDQxOWFhNTI3NWUwZWJjYWMiLCJpc3MiOiJDb25mbHVlbmNlOjA3MDcyMzcyMzYiLCJjb250ZXh0Ijp7InVzZXIiOnsidXNlcktleSI6ImZmODA4MTgxNDBiNzA0OGQwMTQwYmQ5M2QxZjAwMDA3IiwidXNlcm5hbWUiOiJjd2hpdHRpbmd0b24iLCJkaXNwbGF5TmFtZSI6IkNocmlzIFdoaXR0aW5ndG9uIn19LCJleHAiOjE0NTI4NzY2OTIsImlhdCI6MTQ1Mjg3NjUxMn0.IvdJT900hCLegrC6Kka1LnSQLRZ8kyOf-Q6JaP26e3I';
require([
    '/dist/connect-host.js'
    ], function(host){
    host.registerContentResolver.resolveByExtension(function(){
        console.log(arguments);
        var promise = jQuery.Deferred(function(defer){
            defer.resolve({url: addonDomain + '/iframe-content.html'});
        }).promise();
        return promise;
    });

    var x = {
        addon_key: 'addon-key',
        key: 'module-key',
        width: '300px',
        height: '400px',
        url: addonDomain + '/iframe-content.html?jwt=' + jwt,
        options: {
            isGeneral: true
        }, //options to send to the iframe
        data: { //data to stay on the host side
            pageType: 'general',
            productCtx: '{}',
            uid: 'someUserId'
        }
    };
    // setTimeout(function(){
        host.create(x).appendTo("body");
    // }, 1000);

});
