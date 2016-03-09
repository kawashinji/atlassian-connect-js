//INSERT AMD STUBBER HERE!
// import amd from './amd';
import util from './util';
import $ from './dollar';
import consumerOptions from './consumer-options';

AP._hostModules._dollar = $;

if(consumerOptions.get('sizeToParent') === true) {
  AP.env.sizeToParent();
}
