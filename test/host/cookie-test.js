import cookie from 'src/host/cookie/api'

function clearCookies(){
  document.cookie.split(';').forEach(function(c) {
    document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
  });
}

QUnit.module('Cookie', {
  setup: function() {
    clearCookies();
  },
  teardown: function() {
    clearCookies();
  },
});

QUnit.test('saveCookie saves a cookie with the add-on key prefix', function(assert){
  var cookieValue = 'some value';
  cookie.saveCookie('addonKey', 'name', cookieValue);
  assert.ok(document.cookie.search(/addonKey\$\$name/) > 0);
});

QUnit.test('readCookie reads the cookie', function(assert){
  var done = assert.async();
  var cookieName = 'myCookie';
  var cookieValue = 'some value';

  cookie.saveCookie('addonKey', cookieName, cookieValue);
  cookie.readCookie('addonKey', cookieName, (value) => {
    assert.equal(cookieValue, value);
    done();
  });
});

QUnit.test('eraseCookie erases the cookie', function(assert){
  var cookieName = 'myCookie';
  var cookieValue = 'some value';
  cookie.saveCookie('addonKey', cookieName, cookieValue);
  assert.ok(document.cookie.search(/addonKey\$\$myCookie/) > 0);
  cookie.eraseCookie('addonKey', cookieName);
  assert.ok(document.cookie.search(/addonKey\$\$myCookie/) < 0);

});
