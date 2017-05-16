import { decode } from './base64';
import EventDispatcher from '../dispatchers/event_dispatcher';
var JWT_SKEW = 60; // in seconds.

function parseJwtIssuer(jwt) {
  return parseJwtClaims(jwt)['iss'];
}

function parseJwtClaims(jwt) {

  if (null === jwt || '' === jwt) {
    throw('Invalid JWT: must be neither null nor empty-string.');
  }

  var firstPeriodIndex = jwt.indexOf('.');
  var secondPeriodIndex = jwt.indexOf('.', firstPeriodIndex + 1);

  if (firstPeriodIndex < 0 || secondPeriodIndex <= firstPeriodIndex) {
    throw('Invalid JWT: must contain 2 period (".") characters.');
  }

  var encodedClaims = jwt.substring(firstPeriodIndex + 1, secondPeriodIndex);

  if (null === encodedClaims || '' === encodedClaims) {
    throw('Invalid JWT: encoded claims must be neither null nor empty-string.');
  }

  var claimsString = decode.call(window, encodedClaims);
  return JSON.parse(claimsString);
}

function isJwtExpired(jwtString, skew) {
  if (skew === undefined) {
    skew = JWT_SKEW;
  }
  var claims = parseJwtClaims(jwtString);
  var expires = 0;
  var now = Math.floor(Date.now() / 1000); // UTC timestamp now
  if (claims && claims.exp) {
    expires = claims.exp;
  }

  if ((expires - skew) < now){
    return true;
  }

  return false;

}

EventDispatcher.register('jwt-skew-set', function(data){
  JWT_SKEW = data.skew;
});


export default {
  parseJwtIssuer,
  parseJwtClaims,
  isJwtExpired
}