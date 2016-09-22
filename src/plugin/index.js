import AP from 'simple-xdm/plugin';
import deprecate from './deprecate';
import $ from './dollar';
import consumerOptions from './consumer-options';
import EventsModule from './events';
import DialogCompat from './dialog';
import AMD from './amd';
import Meta from './meta';
import _util from './util';

AP._hostModules._dollar = $;
AP._hostModules['inline-dialog'] = AP._hostModules.inlineDialog;

if(consumerOptions.get('sizeToParent') === true) {
  AP.env.sizeToParent();
}

if(consumerOptions.get('base') === true) {
  AP.env.getLocation(loc => {
    $('head').append({tag: 'base', href: loc, target: '_parent'});
  });
}

$.each(EventsModule.methods, (i, method) => {
  AP._hostModules.events[method] = AP.events[method] = EventsModule[method];
});

AP.define = deprecate((...args) => AMD.define(...args),
  'AP.define()', null, '5.0');

AP.require = deprecate((...args) => AMD.require(...args),
  'AP.require()', null, '5.0');

var margin = AP._data.options.isDialog ? '10px 10px 0 10px'  : '0';
if (consumerOptions.get('margin') !== false) {
  $('head').append({tag: 'style', type: 'text/css', $text: 'body {margin: ' + margin + ' !important;}'});
}

AP.Meta = {
  get: Meta.getMeta
};
AP.meta = Meta.getMeta;
AP.localUrl = Meta.localUrl;

AP._hostModules._util = AP._util = {
  each: _util.each,
  log: _util.log,
  decodeQueryComponent: _util.decodeQueryComponent,
  bind: _util.bind,
  unbind: _util.unbind,
  extend: _util.extend,
  trim: _util.trim,
  debounce: _util.debounce,
  isFunction: _util.isFunction,
  handleError: _util.handleError
};

export default AP;
