//INSERT AMD STUBBER HERE!
// import amd from './amd';
import util from './util';
import $ from './dollar';
import consumerOptions from './consumer-options';
import EventsModule from './events';
import DialogCompat from './dialog';

AP._hostModules._dollar = $;

if(consumerOptions.get('sizeToParent') === true) {
  AP.env.sizeToParent();
}

$.each(EventsModule, (i, method) => {
  AP._hostModules.events[i] = AP.events[i] = method;
});
