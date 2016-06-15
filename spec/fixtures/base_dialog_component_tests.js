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
    customButtons($el, options);
    size($el, options);
}

function chromeless($el, options){
  expect($el.hasClass('aui-dialog2')).toEqual(true);
  expect($el.hasClass('ap-aui-dialog2')).toEqual(true);
  expect($el.hasClass('aui-layer')).toEqual(true);
  expect($el.hasClass('aui-dialog2-chromeless')).toEqual(true);
  size($el, options);
}

function fullscreen($el, options){
  expect($el.hasClass('aui-dialog2')).toEqual(true);
  expect($el.hasClass('ap-aui-dialog2')).toEqual(true);
  expect($el.hasClass('aui-layer')).toEqual(true);
  expect($el.hasClass('aui-dialog2-chromeless')).toEqual(false);
  expect($el.hasClass('aui-dialog2-fullscreen')).toEqual(true);
  expect($el.hasClass('ap-header-controls')).toEqual(true);
  expect($el.hasClass('aui-dialog2-maximum')).toEqual(true);
  fullscreenHeader($el, options);
  hint($el, options);
  footer($el, options);
  fullscreenButtons($el, options);
  customButtons($el, options);
}

function fullscreenHeader($el, options){
  expect($el.find('.header-title').text()).toEqual(options.header.value);
}

function fullscreenButtons($el, options){
  var $controlPanel = $el.find('.header-control-panel');
  expect($controlPanel.length).toEqual(1);
  // 4 buttons, 2 default + 2 user custom buttons
  expect($controlPanel.find('button').length).toEqual(4);
  var $primary = $controlPanel.find('.aui-button-primary');
  var $cancel = $controlPanel.find('.aui-button-link');
  expect($primary.length).toEqual(1);
  expect($primary.text()).toEqual(options.submitText);
  expect($cancel.length).toEqual(1);
  expect($cancel.text()).toEqual(options.cancelText);
}

function customButtons($el, options) {
  function buttonByIdentifier($dialog, identifier) {
    return $el.find('.aui-button-secondary').filter(function(index, button){
      return $(button).data('identifier') === identifier;
    });
  }
  options.buttons.forEach(function(button) {
    var $btn = buttonByIdentifier($el, button.identifier);
    expect($btn.length).toEqual(1);
    expect($btn.hasClass('ap-dialog-custom-button')).toEqual(true);
    expect($btn.hasClass('aui-button-secondary')).toEqual(true);
    expect($btn.text()).toEqual(button.text);
  });
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
  // 2 default + 2 custom buttons specified in the options
  expect($el.find('button').length).toEqual(4);
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
      cancelText: 'some cancel text',
      buttons: [
        {
          text: 'some button text',
          identifier: 'abc123'
        },
        {
          text: 'second button text',
          identifier: 'zxy321'
        }
      ]
    };
  },
  getChromelessOptions: function(){
    return {
      chrome: false,
      size: 'small'
    };
  },
  getFullscreenOptions: function(){
    return {
      size: 'fullscreen',
      header: {
        value: 'a fullscreen header'
      },
      submitText: 'a submit text',
      cancelText: 'a cancel text',
      hint: 'fullscreen hint',
      buttons: [
        {
          text: 'first btn text',
          identifier: 'ab12'
        },
        {
          text: 'second btn text',
          identifier: 'zx32'
        }
      ]

    };
  },
  testFullScreen: function(options, $el){
    if(!$el){
      $el = $('.aui-dialog2');
    }
    return fullscreen($el, options);
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