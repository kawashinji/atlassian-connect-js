//INSERT AMD STUBBER HERE!
import amd from './amd';
import util from './util';
import $ from './dollar';
import consumerOptions from './consumer-options';

$(function(){
  console.log('sizetoparent?', consumerOptions.get('sizeToParent'));
  if(consumerOptions.get('sizeToParent') === true) {
    AP.env.sizeToParent();
  }
});