//INSERT AMD STUBBER HERE!
// import amd from './amd';
import util from './util';
import $ from './dollar';
import consumerOptions from './consumer-options';

//map AP.env.getUser to AP.user.getUser for compatibility.
if(AP._hostModules.user) {
  AP._hostModules.env.getUser = AP._hostModules.user.getUser;  
}
AP._hostModules._dollar = $;

$(function(){
  console.log('sizetoparent?', consumerOptions.get('sizeToParent'));
  if(consumerOptions.get('sizeToParent') === true) {
    AP.env.sizeToParent();
  }
});
