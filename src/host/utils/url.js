import jsuri from 'jsuri';
import jwtUtil from 'utils/jwt';

function isJwtExpired(urlStr) {
  var jwtStr = _getJwt(urlStr);
  return jwtUtil.isJwtExpired(jwtStr);
}

function _getJwt(urlStr) {
  var url = new jsuri(urlStr);
  return url.getQueryParamValue('jwt');
}

function hasJwt(url) {
  return (_getJwt(url).length !== 0);
  
}

module.exports = {
  hasJwt,
  isJwtExpired
}