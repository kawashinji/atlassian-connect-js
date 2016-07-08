import AP from 'simple-xdm/plugin';
import AMD from 'src/plugin/amd';

var testFunctionSpy = jasmine.createSpy('testFunction').and.callFake(() => 1337);
var otherThingSpy = jasmine.createSpy('otherThing').and.callFake((thing) => thing);
var newThingSpy = jasmine.createSpy('newThing').and.callFake((thing) => thing);

AP._data.origin = '*'; // prevent AP._registerOnUnload() from failing

describe('AMD', () => {
  beforeEach(() => {
    AP._hostModules = {
      existingModule: {
        testFunction: testFunctionSpy
      },
      otherThing: otherThingSpy
    };

    AP.define = AMD.define;
    AP.require = AMD.require;

    AP._hostModules.newThing = {
      newHostFunction: newThingSpy
    };
  });

  afterEach(() => {
    window.AP = null;
  });

  describe('define', () => {
    it('creates a module', () => {
      var bonusFunctionSpy = jasmine.createSpy('bonusFunction').and.callFake(() => '+1');
      AP.define('myObject', () => {
        return {
          bonusFunction: bonusFunctionSpy
        }
      });
      AP.require('myObject', function(myObject) {
        expect(myObject).not.toBeUndefined();
        expect(myObject.hasOwnProperty('bonusFunction')).toBe(true);
        expect(myObject.bonusFunction()).toEqual('+1');
        expect(bonusFunctionSpy).toHaveBeenCalled();
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

    it('new host module after initialisation', () => {
      AP.require('newThing', (newThing) => {
        var testVal = Date.now();
        expect(newThing).not.toBeUndefined();
        expect(newThing.hasOwnProperty('newHostFunction')).toBe(true);
        expect(newThing.newHostFunction(testVal)).toEqual(testVal);
        expect(newThingSpy).toHaveBeenCalledWith(testVal);
      });
    })
  });
});
