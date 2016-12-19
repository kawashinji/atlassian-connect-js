import messages from 'src/host/modules/messages';
import analytics from 'src/host/modules/analytics';
import events from 'src/host/modules/events';
import flag from 'src/host/modules/flag';
import scrollPosition from 'src/host/modules/scroll-position';

var modules = {
  'messages': messages,
  'analytics': analytics,
  'events': events,
  'flag': flag,
  'scroll-position': scrollPosition
};

describe('Module methods with variable args', () => {
  Object.getOwnPropertyNames(modules).forEach((moduleName) => {
    describe(moduleName + ' module', () => {
      Object.getOwnPropertyNames(modules[moduleName]).forEach((methodName) => {
        it(methodName + ' should work', () => {
          var fn = modules[moduleName][methodName];
          var isClass = false;
          // class proxy
          if(typeof fn === 'object') {
            fn = fn.constructor;
            isClass = true;
          }

          var fakeCallback = jasmine.createSpy('spy');
          fakeCallback._id = 'abc123';
          fakeCallback._context = {
            extension: {}
          };

          // -1 because last arg is always callback
          for(var i=0; i<fn.length-1; i++) {
            var args = [];
            args.fill(undefined, 0, i);
            args.push(fakeCallback);
            expect(function(){
              if(isClass) {
                new modules[moduleName][methodName].constructor(...args);
              } else {
                fn.apply(null, args);
              }
            }).not.toThrow();
          }
        });
      });
    });
  }, this);

});