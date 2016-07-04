import util from './util';
import $ from './dollar';
import consumerOptions from './consumer-options';
import EventsModule from './events';
import DialogCompat from './dialog';
import AMD from './amd';

AP._hostModules._dollar = $;

if(consumerOptions.get('sizeToParent') === true) {
  AP.env.sizeToParent();
}

$.each(EventsModule, (i, method) => {
  AP._hostModules.events[i] = AP.events[i] = method;
});

AP.define = util.deprecateApi((...args) => AMD.define(...args),
  'AP.define()', null, '5.0');

AP.require = util.deprecateApi((...args) => AMD.require(...args),
  'AP.require()', null, '5.0');