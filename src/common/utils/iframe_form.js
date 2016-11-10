import qs from 'query-string';

function randomIdentifier() {
  return 'iframe_form_' + _random();
}

function randomTargetName() {
  return 'iframe_' + _random();
}

function _random() {
  return Math.random().toString(16).substring(7);
}

function dataFromUrl(str) {
  return qs.parse(qs.extract(str));
}

function urlWithoutData(str) {
  return str.split('?')[0];
}

export default {
  randomIdentifier,
  randomTargetName,
  dataFromUrl,
  urlWithoutData
};