import util from './util';
import $ from './dollar';
import consumerOptions from './consumer-options';
import EventsModule from './events';
import DialogCompat from './dialog';
import amd from './amd';

AP._hostModules._dollar = $;

if(consumerOptions.get('sizeToParent') === true) {
  AP.env.sizeToParent();
}

$.each(EventsModule, (i, method) => {
  AP._hostModules.events[i] = AP.events[i] = method;
});

AP.define = util.deprecateApi((...args) => amd.define(...args),
  'AP.define()', null, '5.0');

AP.require = util.deprecateApi((...args) => amd.require(...args),
  'AP.require()', null, '5.0');