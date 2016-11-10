import IframeForm from 'src/common/iframe_form';

describe('Iframe form component', () => {

  describe('createExtension', () => {

    it('should convert all query parameters to form inputs', () => {
      var $iframe = $('<iframe/>');
      $iframe.attr({
        'name': 'iframe-name',
        'src': 'https://www.example.com?key1=val1&key2=val2&key3=%F0%9F%98%8A'
      });

      var $container = $('<div/>');
      $container.append($iframe);

      IframeForm.createIfNecessary($container, 'POST');

      let $form = $container.find('form');
      var $inputs = $form.find('input');
      expect($form.attr('action')).toEqual('https://www.example.com');
      expect($inputs.length).toEqual(3);
      expect($inputs.eq(0).val()).toEqual('val1');
      expect($inputs.eq(1).val()).toEqual('val2');
      expect($inputs.eq(2).val()).toEqual('\ud83d\ude0a');
    });

  });

});
