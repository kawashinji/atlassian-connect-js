import ButtonComponent from 'src/host/components/button';
import EventDispatcher from 'src/host/dispatchers/event_dispatcher';

describe('Button component', () => {  
  afterEach(() => {
    $('.aui-button').remove();
  });
  describe('render', () => {

    it('renders a button', () => {
      var $button = ButtonComponent.render();
      expect($button[0].nodeName).toEqual('BUTTON');
      expect($button.hasClass(ButtonComponent.AP_BUTTON_CLASS)).toBe(true);
      expect($button.attr('id')).toMatch(/ap\-button\-[0-9]{1}/);
      expect($button.attr('aria-disabled')).toEqual('false');
    });

    it('with an id', () => {
      var id = 'someid';
      var $button = ButtonComponent.render({
        id: id
      });
      expect($button.attr('id')).toEqual(id);
    });

    it('with text', () => {
      var text = 'button text';
      var $button = ButtonComponent.render({text: text});
      expect($button.text()).toEqual(text);
    });

    it('with additional class', () => {
      var className = 'aclass';
      var $button = ButtonComponent.render({additionalClasses: className});
      expect($button.hasClass(className)).toBe(true);
    });

    it('with additional classes', () => {
      var classNames = ['classa','classb'];
      var $button = ButtonComponent.render({additionalClasses: classNames});
      for(var i = 0; i < classNames.length; i++){
        expect($button.hasClass(classNames[i])).toBe(true);
      }
    });

    it('with type', () => {
      var type = 'secondary';
      var $button = ButtonComponent.render({type: type});
      expect($button.hasClass('aui-button-' + type)).toBe(true);
    });

    it('with disabled', () => {
      var $button = ButtonComponent.render({disabled: true});
      expect($button.attr('aria-disabled')).toEqual('true');
    });

  });

  describe('button click', () => {
    it('does not dispatch an event when disabled', (done) => {
      var $button = ButtonComponent.render({disabled: true});
      document.body.appendChild($button[0]);
      var spy = jasmine.createSpy('spy');
      EventDispatcher.registerOnce('button-clicked', spy);

      // jquery bug, need to wait 1 tick before triggering.
      setTimeout(function(){
        $button.trigger('click');
      }, 0);

      // wait longer than the 1 tick to make sure it's not triggered.
      setTimeout(function(){
        expect(spy).not.toHaveBeenCalled();
        done();
      }, 10);
    });

    it('disaptches an event', (done) => {
      var $button = ButtonComponent.render({disabled: false});
      document.body.appendChild($button[0]);
      EventDispatcher.registerOnce('button-clicked', (data) => {
        expect(data.$el.attr('id')).toEqual($button.attr('id'));
        done();
      });
      // jquery bug, need to wait 1 tick before triggering.
      setTimeout(function(){
        $button.trigger('click');
      }, 0);
    });

  });

  describe('button toggle', () => {
    it('state to disabled', () => {
      var $button = ButtonComponent.render();
      expect(ButtonComponent.isEnabled($button)).toBe(true);
      ButtonComponent.setDisabled($button, true);
      expect(ButtonComponent.isEnabled($button)).toBe(false);
    });

    it('state to enabled', () => {
      var $button = ButtonComponent.render({disabled: true});
      expect(ButtonComponent.isEnabled($button)).toBe(false);
      ButtonComponent.setDisabled($button, false);
      expect(ButtonComponent.isEnabled($button)).toBe(true);
    });

    it('visibility to hidden', () => {
      var $button = ButtonComponent.render();
      document.body.appendChild($button[0]);
      expect($button.is(':visible')).toBe(true);
      ButtonComponent.setHidden($button, true);
      expect($button.is(':visible')).toBe(false);
    });

    it('visibility to visible', () => {
      var $button = ButtonComponent.render();
      document.body.appendChild($button[0]);
      $button.hide();
      expect($button.is(':visible')).toBe(false);
      ButtonComponent.setHidden($button, false);
      expect($button.is(':visible')).toBe(true);
    });
  });

  describe('immutable button toggle', () => {
    it('state to disabled', () => {
      var $button = ButtonComponent.render({immutable: true});
      expect(ButtonComponent.isEnabled($button)).toBe(true);
      ButtonComponent.setDisabled($button, true);
      expect(ButtonComponent.isEnabled($button)).toBe(true);
    });

    it('visibility to hidden', () => {
      var $button = ButtonComponent.render({immutable: true});
      document.body.appendChild($button[0]);
      expect($button.is(':visible')).toBe(true);
      ButtonComponent.setHidden($button, true);
      expect($button.is(':visible')).toBe(true);
    });
  });

});
