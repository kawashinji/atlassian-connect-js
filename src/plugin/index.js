//INSERT AMD STUBBER HERE!
// import amd from './amd';
import util from './util';
import $ from './dollar';
import consumerOptions from './consumer-options';
import EventsModule from './events';

AP._hostModules._dollar = $;

if(consumerOptions.get('sizeToParent') === true) {
  AP.env.sizeToParent();
}

$.each(EventsModule, (i, method) => {
  AP._hostModules.events[i] = AP.events[i] = method;
});

function getCustomData () {
  if (typeof console !== 'undefined' && console.warn) {
    console.warn('DEPRECATED API - AP.dialog.customData has been deprecated since ACJS 5.0' +
      ' and will be removed in a future release. Use AP.dialog.getCustomData() instead.');
  }
  return AP._data.options.customData;
}
Object.defineProperty(AP._hostModules.dialog, 'customData', {
  get: getCustomData
});
Object.defineProperty(AP.dialog, 'customData', {
  get: getCustomData
});
