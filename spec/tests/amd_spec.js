import amd from 'src/plugin/amd';

var testFunctionSpy = jasmine.createSpy('testFunction').and.callFake(() => 1337);
var otherThingSpy = jasmine.createSpy('otherThing').and.callFake((thing) => thing);

var AP = {
  _hostModules: {
    existingModule: {
      testFunction: testFunctionSpy
    },
    otherThing: otherThingSpy
  }
};

describe('AMD', () => {
  beforeEach(() => {
    var AMD = amd(AP);
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
        existingModule.testFunction();
        expect(testFunctionSpy).toHaveBeenCalled();
      });
    });

    it('create module with multiple dependencies', () => {
      AP.define('newThing', ['existingModule', 'otherThing'], (existingModule, otherThing) => {
        var testVal = Date.now();
        expect(existingModule).not.toBeUndefined();
        expect(existingModule.hasOwnProperty('testFunction')).toBe(true);
        expect(otherThing).not.toBeUndefined();
        expect(existingModule.testFunction()).toEqual(1337);
        expect(otherThing(testVal)).toEqual(testVal);
        expect(testFunctionSpy).toHaveBeenCalled();
        expect(otherThingSpy).toHaveBeenCalledWith(testVal);
      });
    });

    it('overwrite an existing module', () => {
      var bonusFunctionSpy = jasmine.createSpy('bonusFunction').and.callFake(() => '+1');
      AP.define('existingModule', () => {
        return {
          bonusFunction: bonusFunctionSpy
        }
      });

      AP.require('existingModule', (existingModule) => {
        expect(existingModule.hasOwnProperty('bonusFunction')).toBe(true);
        expect(existingModule.bonusFunction()).toEqual('+1');
        expect(bonusFunctionSpy).toHaveBeenCalled();
      });
    });
  });

  describe('require', () => {
    it('existing host modules', () => {
      AP.require('existingModule', (existingModule) => {
        expect(existingModule).not.toBeUndefined();
        expect(existingModule.hasOwnProperty('testFunction')).toBe(true);
        expect(existingModule.testFunction()).toEqual(1337);
        expect(testFunctionSpy).toHaveBeenCalled();
      });
    });

    it('multiple modules', () => {
      AP.require(['existingModule', 'otherThing'], (existingModule, otherThing) => {
        var testVal = Date.now();
        expect(existingModule).not.toBeUndefined();
        expect(existingModule.hasOwnProperty('testFunction')).toBe(true);
        expect(existingModule.testFunction()).toEqual(1337);
        expect(otherThing).not.toBeUndefined();
        expect(otherThing(testVal)).toEqual(testVal);
        expect(testFunctionSpy).toHaveBeenCalled();
        expect(otherThingSpy).toHaveBeenCalledWith(testVal);
      });
    });

    it('undefined module', () => {
      AP.require('nonExistentModule', (notAThing) => {
        expect(notAThing()).toBeUndefined();
      });
    });
  });
});
