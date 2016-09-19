import DialogUtils from 'src/host/utils/dialog';

describe('dialog utils', () => {
  describe('_size', () => {
    it('returns xlarge if given size is x-large', () => {
      const options = {
        size: 'x-large'
      };
      expect(DialogUtils._size(options)).toEqual('xlarge');
    });

    it('returns fullscreen if 100% height and width', () => {
      const options = {
        height: '100%',
        width: '100%'
      };
      expect(DialogUtils._size(options)).toEqual('fullscreen');
    });

    it('returns maximum even if 100% height and width', () => {
      const options = {
        size: 'maximum',
        height: '100%',
        width: '100%'
      };
      expect(DialogUtils._size(options)).toEqual('maximum');
    });

    it('defaults to medium', () => {
      const options = {};
      expect(DialogUtils._size(options)).toEqual('medium');
    });

    it('returns original size', () => {
      const options = {
        size: 'small'
      };
      expect(DialogUtils._size(options)).toEqual('small');
    });

    it('returns original dimensions', () => {
      const options = {
        width: '100px',
        height: '200px'
      };
      expect(DialogUtils._size(options)).not.toBeDefined();
    });
  });

  describe('_header', () => {
    it('handles string', () => {
      const text = 'this is my header';
      expect(DialogUtils._header(text)).toEqual(text);
    });

    it('handles object', () => {
      const text = {
        value: 'this is my header'
      };
      expect(DialogUtils._header(text)).toEqual(text.value);
    });
  });

  describe('_hint', () => {
    it('handles string', () => {
      const text = 'this is a hint';
      expect(DialogUtils._hint(text)).toEqual(text);
    });

    it('everything else returns blank', () => {
      const text = {
        value: 'this is a hint'
      };
      expect(DialogUtils._hint(text)).toEqual('');
    });
  });

  describe('_chrome', () => {
    it('defaults to false', () => {
      const options = {};
      expect(DialogUtils._chrome(options)).toBe(false);
    });

    it('returns original if defined and boolean', () => {
      const options = {
        chrome: true
      };
      expect(DialogUtils._chrome(options)).toBe(options.chrome);
    });

    it('returns false if chrome is not a boolean', () => {
      const options = {
        chrome: 'yes'
      };
      expect(DialogUtils._chrome(options)).toBe(false);
    });

    it('returns true if size is fullscreen', () => {
      const options = {
        size: 'fullscreen'
      };
      expect(DialogUtils._chrome(options)).toBe(true);
    });

    it('returns false if size is maximum', () => {
      const options = {
        size: 'maximum'
      };
      expect(DialogUtils._chrome(options)).toBe(false);
    });
  });

  describe('_width', () => {
    it('returns undefined if size is defined', () => {
      const options = {
        size: 'medium'
      };
      expect(DialogUtils._width(options)).not.toBeDefined();
    });

    it('returns formatted width', () => {
      const options = {
        width: '100'
      };
      expect(DialogUtils._width(options)).toEqual(`${options.width}px`);
    });

    it('returns formatted width width %', () => {
      const options = {
        width: '100%'
      };
      expect(DialogUtils._width(options)).toEqual(options.width);
    });
  });

  describe('_height', () => {
    it('returns undefined if size is defined', () => {
      const options = {
        size: 'medium'
      };
      expect(DialogUtils._height(options)).not.toBeDefined();
    });

    it('returns formatted height', () => {
      const options = {
        height: '100'
      };
      expect(DialogUtils._height(options)).toEqual(`${options.height}px`);
    });

    it('returns formatted height with %', () => {
      const options = {
        height: '100%'
      };
      expect(DialogUtils._height(options)).toEqual(options.height);
    });
  });

  describe('_actions', () => {
    it('default actions if no actions defined', () => {
      const options = {};
      const actions = DialogUtils._actions(options);
      expect(actions.length).toEqual(2);
      expect(actions[0].name).toEqual('submit');
      expect(actions[0].identifier).toEqual('submit');
      expect(actions[0].text).toEqual('Submit');
      expect(actions[0].type).toEqual('primary');
      expect(actions[1].name).toEqual('cancel');
      expect(actions[1].identifier).toEqual('cancel');
      expect(actions[1].text).toEqual('Cancel');
      expect(actions[1].type).toEqual('link');
      expect(actions[1].immutable).toBe(true);
    });

    it('return defined actions', () => {
      const options = {
        actions: [
          {
            name: 'someaction',
            identifier: 'someid',
            text: 'some button',
            type: 'primary'
          }
        ]
      };
      const actions = DialogUtils._actions(options);
      expect(actions.length).toEqual(0);
    });

    it('returns buttons', () => {
      const options = {
        buttons: [
          {
            identifier: 'someid',
            text: 'some button'
          }
        ]
      };
      const actions = DialogUtils._actions(options);
      expect(actions.length).toEqual(3);
      expect(actions[2].identifier).toEqual(options.buttons[0].identifier);
      expect(actions[2].text).toEqual(options.buttons[0].text);
    });
  });

  describe('_id', () => {
    it('return random id if not a string', () => {
      const str = {
        some: 'thing'
      };
      const id = DialogUtils._id(str);
      expect(id).not.toEqual(str);
      expect(typeof id === 'string').toBe(true);
    });

    it('return original string', () => {
      const str = 'somestring';
      expect(DialogUtils._id(str)).toEqual(str);
    });

  });

  describe('_buttons', () => {
    it('return empty array if given buttons is not an array', () => {
      const options = {
        buttons: 'some string'
      };
      expect(DialogUtils._buttons(options)).toEqual([]);
    });

    it('text, identifier and disabled', () => {
      const buttonText = 'some text';
      const buttonIdentifier = 'some id';
      const buttonDisabled = true;
      const options = {
        buttons: [
          {
            text: buttonText,
            identifier: buttonIdentifier,
            disabled: buttonDisabled
          }
        ]
      };
      const buttons = DialogUtils._buttons(options);
      expect(buttons.length === 1).toBe(true);
      expect(buttons[0].text).toEqual(buttonText);
      expect(buttons[0].identifier).toEqual(buttonIdentifier);
      expect(buttons[0].disabled).toEqual(buttonDisabled);
      expect(buttons[0].custom).toBe(true);
      expect(buttons[0].type).toEqual('secondary');
    });

    it('text and identifier not defined', () => {
      const options = {
        buttons: [
          {}
        ]
      };
      const buttons = DialogUtils._buttons(options);
      expect(buttons.length === 1).toBe(true);
      expect(buttons[0].text).not.toBeDefined();
      expect(buttons[0].identifier).toBeDefined();
      expect(buttons[0].disabled).toBe(false);
    });

  });

  describe('moduleOptionsFromGlobal', () => {
    const options = {
      options: {
        someKey: 'someVal'
      }
    };

    beforeEach(() => {
      window._AP = {
        dialogModules: {
          addonKey: {
            moduleKey: options
          }
        }
      }
    });

    it('returns false if not defined', () => {
      expect(DialogUtils.moduleOptionsFromGlobal('notAddonKey', 'something else')).toBe(false);
    });

    it('returns expected options', () => {
      expect(DialogUtils.moduleOptionsFromGlobal('addonKey', 'moduleKey')).toEqual(options.options);
    });
  });
});