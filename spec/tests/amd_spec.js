import amd from 'src/plugin/amd';

var AP = {
  _hostModules: {
    existingModule: {
      testFunction: () => {
        return 1337;
      }
    },
    otherThing: (test) => {
      return test;
    }
  }
};

describe('AMD', () => {
  beforeEach(() => {
    const AMD = amd(AP);
    AP.define = AMD.define;
    AP.require = AMD.require;
  });

  describe('define', () => {
    it('creates a module', () => {
      AP.define('myObject', () => {
        return {
          bonusFunction: () => '+1'
        }
      });
      AP.require('myObject', function(myObject) {
        expect(myObject).not.toBeUndefined();
        expect(myObject.hasOwnProperty('bonusFunction')).toBe(true);
        expect(myObject.bonusFunction()).toEqual('+1');
      });
    });

    it('create module with a dependency', () => {
      AP.define('newThing', ['existingModule'], (existingModule) => {
        expect(existingModule).not.toBeUndefined();
        expect(existingModule.hasOwnProperty('testFunction')).toBe(true);
        expect(existingModule.testFunction()).toEqual(1337);
      });
    });

    it('create module with multiple dependencies', () => {
      AP.define('newThing', ['existingModule', 'otherThing'], (existingModule, otherThing) => {
        expect(existingModule).not.toBeUndefined();
        expect(existingModule.hasOwnProperty('testFunction')).toBe(true);
        expect(existingModule.testFunction()).toEqual(1337);
        expect(otherThing).not.toBeUndefined();
        expect(otherThing('test')).toEqual('test');
      });
    });

    it('overwrite an existing module', () => {
      AP.define('existingModule', () => {
        return {
          bonusFunction: () => '+1'
        }
      });

      AP.require('existingModule', (existingModule) => {
        expect(existingModule.hasOwnProperty('bonusFunction')).toBe(true);
        expect(existingModule.bonusFunction()).toEqual('+1');
      });
    });
  });

  describe('require', () => {
    it('existing host modules', () => {
      AP.require('existingModule', (existingModule) => {
        expect(existingModule).not.toBeUndefined();
        expect(existingModule.hasOwnProperty('testFunction')).toBe(true);
        expect(existingModule.testFunction()).toEqual(1337);
      });
    });

    it('multiple modules', () => {
      AP.require(['existingModule', 'otherThing'], (existingModule, otherThing) => {
        expect(existingModule).not.toBeUndefined();
        expect(existingModule.hasOwnProperty('testFunction')).toBe(true);
        expect(existingModule.testFunction()).toEqual(1337);
        expect(otherThing).not.toBeUndefined();
        expect(otherThing('test')).toEqual('test');
      });
    });

    it('undefined module', () => {
      AP.require('nonExistentModule', (notAThing) => {
        expect(notAThing()).toBeUndefined();
      });
    });
  });
});
