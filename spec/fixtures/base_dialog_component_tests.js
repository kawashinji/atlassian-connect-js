function unit(str){
  return (str.search(/px/) > 0) ? 'px' : '%';
}

function size($el, options){
  if(options.size){
    expect($el.hasClass('aui-dialog2-' + options.size), 'size is set').toEqual(true);
  } else if(options.width){
    expect($el.width() + unit(options.width)).toEqual(options.width);
    expect($el.height() + unit(options.height)).toEqual(options.height);
  }
}

function chrome($el, options){
    expect($el.hasClass('aui-dialog2')).toEqual(true);
    expect($el.hasClass('ap-aui-dialog2')).toEqual(true);
    expect($el.hasClass('aui-layer')).toEqual(true);
    header($el, options);
    hint($el, options);
    footer($el, options);
    buttons($el, options);
    size($el, options);
}

function chromeless($el, options){
  expect($el.hasClass('aui-dialog2')).toEqual(true);
  expect($el.hasClass('ap-aui-dialog2')).toEqual(true);
  expect($el.hasClass('aui-layer')).toEqual(true);
  expect($el.hasClass('aui-dialog2-chromeless')).toEqual(true);
  size($el, options);
}

function header($el, options){
  expect($el.find('.aui-dialog2-header-main').text()).toEqual(options.header.value);
}

function hint($el, options){
  expect($el.find('.aui-dialog2-footer-hint').text()).toEqual(options.hint);
}

function footer($el, options){
  expect($el.find('.aui-dialog2-footer').length).toEqual(1);
}

function buttons($el, options){
  expect($el.find('button').length).toEqual(2);
  var $primary = $el.find('.aui-dialog2-footer .aui-button-primary');
  var $cancel = $el.find('.aui-dialog2-footer .aui-button-link');
  expect($primary.length).toEqual(1);
  expect($primary.text()).toEqual(options.submitText);
  expect($cancel.length).toEqual(1);
  expect($cancel.text()).toEqual(options.cancelText);
}

module.exports = {
  getChromeOptions: function(){
    return {
      chrome: true,
      header: {
        value: 'a header'
      },
      hint: 'a hint',
      size: 'large',
      submitText: 'my submit text',
      cancelText: 'some cancel text'
    };
  },
  getChromelessOptions: function(){
    return {
      chrome: false,
      size: 'small'
    };
  },
  testChrome: function(options, $el){
    if(!$el){
      $el = $('.aui-dialog2');
    }
    return chrome($el, options);
  },
  testChromeless: function(options, $el){
    if(!$el){
      $el = $('.aui-dialog2');
    }
    return chromeless($el, options);
  },
};