import qs from 'query-string';
import jwtUtil from './jwt';

function isJwtExpired(urlStr) {
  var jwtStr = _getJwt(urlStr);
  return jwtUtil.isJwtExpired(jwtStr);
}

function _getJwt(urlStr) {
  var query = qs.parse(qs.extract(urlStr));
  return query['jwt'];
}

function hasJwt(url) {
  var jwt = _getJwt(url);
  return (jwt && _getJwt(url).length !== 0);

}

export default {
  hasJwt,
  isJwtExpired
}