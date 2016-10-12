import IframeFormComponent from 'src/host/components/iframe_form';

describe('Iframe form component', () => {

  describe('createExtension', () => {

    it('should convert all query parameters to form inputs', () => {
      let $form = IframeFormComponent.render({
        url: 'https://www.example.com?key1=val1&key2=val2&key3=%F0%9F%98%8A',
        method: 'post'
      });
      var $inputs = $form.find('input');

      expect($form.attr('action')).toEqual('https://www.example.com');
      expect($inputs.length).toEqual(3);
      expect($inputs.eq(0).val()).toEqual('val1');
      expect($inputs.eq(1).val()).toEqual('val2');
      expect($inputs.eq(2).val()).toEqual('\ud83d\ude0a');
    });

  });

});
