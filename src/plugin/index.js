//INSERT AMD STUBBER HERE!
// import amd from './amd';
import util from './util';
import $ from './dollar';
import consumerOptions from './consumer-options';

//map AP.env.getUser to AP.user.getUser for compatibility.
AP._hostModules.env.getUser = AP._hostModules.user.getUser;

$(function(){
  console.log('sizetoparent?', consumerOptions.get('sizeToParent'));
  if(consumerOptions.get('sizeToParent') === true) {
    AP.env.sizeToParent();
  }
});
