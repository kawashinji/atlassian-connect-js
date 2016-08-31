import AP from 'simple-xdm/plugin';
import deprecate from './deprecate';
import $ from './dollar';
import consumerOptions from './consumer-options';
import EventsModule from './events';
import DialogCompat from './dialog';
import AMD from './amd';
import Meta from './meta';

AP._hostModules._dollar = $;
AP._hostModules['inline-dialog'] = AP._hostModules.inlineDialog;

if(consumerOptions.get('sizeToParent') === true) {
  AP.env.sizeToParent();
}

$.each(EventsModule, (i, method) => {
  AP._hostModules.events[i] = AP.events[i] = method;
});

AP.define = deprecate((...args) => AMD.define(...args),
  'AP.define()', null, '5.0');

AP.require = deprecate((...args) => AMD.require(...args),
  'AP.require()', null, '5.0');

AP.Meta = {
  get: Meta.getMeta
};
AP.meta = Meta.getMeta;
AP.size = Meta.size;
AP.container = Meta.container;
AP.localUrl = Meta.localUrl;

export default AP;
