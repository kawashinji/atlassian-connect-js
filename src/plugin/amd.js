import AP from 'simple-xdm/plugin';

var modules = {};

function reqAll(deps, callback) {
  var mods = [];
  var i = 0;
  var len = deps.length;
  function addOne(mod) {
    mods.push(mod);
    if (mods.length === len) {
      var exports = [];
      var i = 0;
      for (; i < len; i += 1) {
        exports[i] = mods[i].exports;
      }
      if (callback) {
        callback.apply(window, exports);
      }
    }
  }
  if (deps && deps.length > 0) {
    for (; i < len; i += 1) {
      reqOne(deps[i], addOne);
    }
  } else {
    if (callback) {
      callback();
    }
  }
}

function reqOne(name, callback) {
  // naive impl that assumes all modules are already loaded
  callback(getOrCreate(name));
}

function getOrCreate(name) {
  if (modules[name]) {
    return modules[name] = modules[name];
  } else if (AP._hostModules[name]){
    return modules[name] = {
      name: name,
      exports: AP._hostModules[name]
    };
  } else {
    return modules[name] = {
      name: name,
      exports: function () {
        function exports() {
          var target = exports.__target__;
          if (target) {
            return target.apply(window, arguments);
          }
        }
        return exports;
      }()
    };
  }
}

// define(name, objOrFn)
// define(name, deps, fn(dep1, dep2, ...))
module.exports = {
  define: function (name, deps, exports) {
    var mod = getOrCreate(name);
    var factory;
    if (!exports) {
      exports = deps;
      deps = [];
    }
    if (exports) {
      factory = typeof exports !== 'function' ? function () {
        return exports;
      } : exports;
      reqAll(deps, function () {
        var exports = factory.apply(window, arguments);
        if (exports) {
          if (typeof exports === 'function') {
            mod.exports.__target__ = exports;
          }
          for (var k in exports) {
            if (exports.hasOwnProperty(k)) {
              mod.exports[k] = exports[k];
            }
          }
        }
      });
    }
  },
  require: function (deps, callback) {
    reqAll(typeof deps === 'string' ? [deps] : deps, callback);
  }
};
