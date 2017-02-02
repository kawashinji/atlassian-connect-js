(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('connectHost', factory) :
    (global.connectHost = factory());
}(this, (function () { 'use strict';

    /*
    object-assign
    (c) Sindre Sorhus
    @license MIT
    */

    /* eslint-disable no-unused-vars */

    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;

    function toObject(val) {
    	if (val === null || val === undefined) {
    		throw new TypeError('Object.assign cannot be called with null or undefined');
    	}

    	return Object(val);
    }

    function shouldUseNative() {
    	try {
    		if (!Object.assign) {
    			return false;
    		}

    		// Detect buggy property enumeration order in older V8 versions.

    		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
    		var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
    		test1[5] = 'de';
    		if (Object.getOwnPropertyNames(test1)[0] === '5') {
    			return false;
    		}

    		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
    		var test2 = {};
    		for (var i = 0; i < 10; i++) {
    			test2['_' + String.fromCharCode(i)] = i;
    		}
    		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
    			return test2[n];
    		});
    		if (order2.join('') !== '0123456789') {
    			return false;
    		}

    		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
    		var test3 = {};
    		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
    			test3[letter] = letter;
    		});
    		if (Object.keys(Object.assign({}, test3)).join('') !== 'abcdefghijklmnopqrst') {
    			return false;
    		}

    		return true;
    	} catch (err) {
    		// We don't expect any of the above to throw, but better to be safe.
    		return false;
    	}
    }

    var index = shouldUseNative() ? Object.assign : function (target, source) {
    	var from;
    	var to = toObject(target);
    	var symbols;

    	for (var s = 1; s < arguments.length; s++) {
    		from = Object(arguments[s]);

    		for (var key in from) {
    			if (hasOwnProperty.call(from, key)) {
    				to[key] = from[key];
    			}
    		}

    		if (getOwnPropertySymbols) {
    			symbols = getOwnPropertySymbols(from);
    			for (var i = 0; i < symbols.length; i++) {
    				if (propIsEnumerable.call(from, symbols[i])) {
    					to[symbols[i]] = from[symbols[i]];
    				}
    			}
    		}
    	}

    	return to;
    };

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */
    /**
     * WARNING: DO NOT manually require this module.
     * This is a replacement for `invariant(...)` used by the error code system
     * and will _only_ be required by the corresponding babel pass.
     * It always throws.
     */

    function reactProdInvariant(code) {
      var argCount = arguments.length - 1;

      var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

      for (var argIdx = 0; argIdx < argCount; argIdx++) {
        message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
      }

      message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

      var error = new Error(message);
      error.name = 'Invariant Violation';
      error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

      throw error;
    }

    var reactProdInvariant_1 = reactProdInvariant;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /**
     * Use invariant() to assert state which your program assumes to be true.
     *
     * Provide sprintf-style format (only %s is supported) and arguments
     * to provide information about what broke and what you were
     * expecting.
     *
     * The invariant message will be stripped in production, but the invariant
     * will remain to ensure logic does not differ in production.
     */

    var validateFormat = function validateFormat(format) {};

    if (process.env.NODE_ENV !== 'production') {
      validateFormat = function validateFormat(format) {
        if (format === undefined) {
          throw new Error('invariant requires an error message argument');
        }
      };
    }

    function invariant$1(condition, format, a, b, c, d, e, f) {
      validateFormat(format);

      if (!condition) {
        var error;
        if (format === undefined) {
          error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
        } else {
          var args = [a, b, c, d, e, f];
          var argIndex = 0;
          error = new Error(format.replace(/%s/g, function () {
            return args[argIndex++];
          }));
          error.name = 'Invariant Violation';
        }

        error.framesToPop = 1; // we don't care about invariant's own frame
        throw error;
      }
    }

    var invariant_1 = invariant$1;

    var _prodInvariant = reactProdInvariant_1;

    var invariant = invariant_1;

    /**
     * Static poolers. Several custom versions for each potential number of
     * arguments. A completely generic pooler is easy to implement, but would
     * require accessing the `arguments` object. In each of these, `this` refers to
     * the Class itself, not an instance. If any others are needed, simply add them
     * here, or in their own files.
     */
    var oneArgumentPooler = function oneArgumentPooler(copyFieldsFrom) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, copyFieldsFrom);
        return instance;
      } else {
        return new Klass(copyFieldsFrom);
      }
    };

    var twoArgumentPooler$1 = function twoArgumentPooler$1(a1, a2) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2);
        return instance;
      } else {
        return new Klass(a1, a2);
      }
    };

    var threeArgumentPooler = function threeArgumentPooler(a1, a2, a3) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2, a3);
        return instance;
      } else {
        return new Klass(a1, a2, a3);
      }
    };

    var fourArgumentPooler$1 = function fourArgumentPooler$1(a1, a2, a3, a4) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2, a3, a4);
        return instance;
      } else {
        return new Klass(a1, a2, a3, a4);
      }
    };

    var standardReleaser = function standardReleaser(instance) {
      var Klass = this;
      !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant('25') : void 0;
      instance.destructor();
      if (Klass.instancePool.length < Klass.poolSize) {
        Klass.instancePool.push(instance);
      }
    };

    var DEFAULT_POOL_SIZE = 10;
    var DEFAULT_POOLER = oneArgumentPooler;

    /**
     * Augments `CopyConstructor` to be a poolable class, augmenting only the class
     * itself (statically) not adding any prototypical fields. Any CopyConstructor
     * you give this may have a `poolSize` property, and will look for a
     * prototypical `destructor` on instances.
     *
     * @param {Function} CopyConstructor Constructor that can be used to reset.
     * @param {Function} pooler Customizable pooler.
     */
    var addPoolingTo = function addPoolingTo(CopyConstructor, pooler) {
      // Casting as any so that flow ignores the actual implementation and trusts
      // it to match the type we declared
      var NewKlass = CopyConstructor;
      NewKlass.instancePool = [];
      NewKlass.getPooled = pooler || DEFAULT_POOLER;
      if (!NewKlass.poolSize) {
        NewKlass.poolSize = DEFAULT_POOL_SIZE;
      }
      NewKlass.release = standardReleaser;
      return NewKlass;
    };

    var PooledClass$1 = {
      addPoolingTo: addPoolingTo,
      oneArgumentPooler: oneArgumentPooler,
      twoArgumentPooler: twoArgumentPooler$1,
      threeArgumentPooler: threeArgumentPooler,
      fourArgumentPooler: fourArgumentPooler$1
    };

    var PooledClass_1 = PooledClass$1;

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };





    var asyncGenerator = function () {
      function AwaitValue(value) {
        this.value = value;
      }

      function AsyncGenerator(gen) {
        var front, back;

        function send(key, arg) {
          return new Promise(function (resolve, reject) {
            var request = {
              key: key,
              arg: arg,
              resolve: resolve,
              reject: reject,
              next: null
            };

            if (back) {
              back = back.next = request;
            } else {
              front = back = request;
              resume(key, arg);
            }
          });
        }

        function resume(key, arg) {
          try {
            var result = gen[key](arg);
            var value = result.value;

            if (value instanceof AwaitValue) {
              Promise.resolve(value.value).then(function (arg) {
                resume("next", arg);
              }, function (arg) {
                resume("throw", arg);
              });
            } else {
              settle(result.done ? "return" : "normal", result.value);
            }
          } catch (err) {
            settle("throw", err);
          }
        }

        function settle(type, value) {
          switch (type) {
            case "return":
              front.resolve({
                value: value,
                done: true
              });
              break;

            case "throw":
              front.reject(value);
              break;

            default:
              front.resolve({
                value: value,
                done: false
              });
              break;
          }

          front = front.next;

          if (front) {
            resume(front.key, front.arg);
          } else {
            back = null;
          }
        }

        this._invoke = send;

        if (typeof gen.return !== "function") {
          this.return = undefined;
        }
      }

      if (typeof Symbol === "function" && Symbol.asyncIterator) {
        AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
          return this;
        };
      }

      AsyncGenerator.prototype.next = function (arg) {
        return this._invoke("next", arg);
      };

      AsyncGenerator.prototype.throw = function (arg) {
        return this._invoke("throw", arg);
      };

      AsyncGenerator.prototype.return = function (arg) {
        return this._invoke("return", arg);
      };

      return {
        wrap: function (fn) {
          return function () {
            return new AsyncGenerator(fn.apply(this, arguments));
          };
        },
        await: function (value) {
          return new AwaitValue(value);
        }
      };
    }();





    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var createClass$1 = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();





    var defineProperty = function (obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    };

    var _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    var get$1 = function get$1(object, property, receiver) {
      if (object === null) object = Function.prototype;
      var desc = Object.getOwnPropertyDescriptor(object, property);

      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);

        if (parent === null) {
          return undefined;
        } else {
          return get$1(parent, property, receiver);
        }
      } else if ("value" in desc) {
        return desc.value;
      } else {
        var getter = desc.get;

        if (getter === undefined) {
          return undefined;
        }

        return getter.call(receiver);
      }
    };

    var inherits = function (subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }

      subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
          value: subClass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    };











    var possibleConstructorReturn = function (self, call) {
      if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return call && (typeof call === "object" || typeof call === "function") ? call : self;
    };



    var set$1 = function set$1(object, property, value, receiver) {
      var desc = Object.getOwnPropertyDescriptor(object, property);

      if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);

        if (parent !== null) {
          set$1(parent, property, value, receiver);
        }
      } else if ("value" in desc && desc.writable) {
        desc.value = value;
      } else {
        var setter = desc.set;

        if (setter !== undefined) {
          setter.call(receiver, value);
        }
      }

      return value;
    };















    var toConsumableArray = function (arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
      } else {
        return Array.from(arr);
      }
    };

    /**
     * Copyright 2014-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var _assign$1 = require('object-assign');

    var ReactCurrentOwner = require('./ReactCurrentOwner');

    var warning$1 = require('fbjs/lib/warning');
    var canDefineProperty = require('./canDefineProperty');
    var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

    var REACT_ELEMENT_TYPE = require('./ReactElementSymbol');

    var RESERVED_PROPS = {
      key: true,
      ref: true,
      __self: true,
      __source: true
    };

    var specialPropKeyWarningShown;
    var specialPropRefWarningShown;

    function hasValidRef(config) {
      if (process.env.NODE_ENV !== 'production') {
        if (hasOwnProperty$1.call(config, 'ref')) {
          var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
          if (getter && getter.isReactWarning) {
            return false;
          }
        }
      }
      return config.ref !== undefined;
    }

    function hasValidKey(config) {
      if (process.env.NODE_ENV !== 'production') {
        if (hasOwnProperty$1.call(config, 'key')) {
          var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
          if (getter && getter.isReactWarning) {
            return false;
          }
        }
      }
      return config.key !== undefined;
    }

    function defineKeyPropWarningGetter(props, displayName) {
      var warnAboutAccessingKey = function warnAboutAccessingKey() {
        if (!specialPropKeyWarningShown) {
          specialPropKeyWarningShown = true;
          process.env.NODE_ENV !== 'production' ? warning$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
        }
      };
      warnAboutAccessingKey.isReactWarning = true;
      Object.defineProperty(props, 'key', {
        get: warnAboutAccessingKey,
        configurable: true
      });
    }

    function defineRefPropWarningGetter(props, displayName) {
      var warnAboutAccessingRef = function warnAboutAccessingRef() {
        if (!specialPropRefWarningShown) {
          specialPropRefWarningShown = true;
          process.env.NODE_ENV !== 'production' ? warning$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
        }
      };
      warnAboutAccessingRef.isReactWarning = true;
      Object.defineProperty(props, 'ref', {
        get: warnAboutAccessingRef,
        configurable: true
      });
    }

    /**
     * Factory method to create a new React element. This no longer adheres to
     * the class pattern, so do not use new to call it. Also, no instanceof check
     * will work. Instead test $$typeof field against Symbol.for('react.element') to check
     * if something is a React Element.
     *
     * @param {*} type
     * @param {*} key
     * @param {string|object} ref
     * @param {*} self A *temporary* helper to detect places where `this` is
     * different from the `owner` when React.createElement is called, so that we
     * can warn. We want to get rid of owner and replace string `ref`s with arrow
     * functions, and as long as `this` and owner are the same, there will be no
     * change in behavior.
     * @param {*} source An annotation object (added by a transpiler or otherwise)
     * indicating filename, line number, and/or other information.
     * @param {*} owner
     * @param {*} props
     * @internal
     */
    var ReactElement$2 = function ReactElement$2(type, key, ref, self, source, owner, props) {
      var element = {
        // This tag allow us to uniquely identify this as a React Element
        $$typeof: REACT_ELEMENT_TYPE,

        // Built-in properties that belong on the element
        type: type,
        key: key,
        ref: ref,
        props: props,

        // Record the component responsible for creating this element.
        _owner: owner
      };

      if (process.env.NODE_ENV !== 'production') {
        // The validation flag is currently mutative. We put it on
        // an external backing store so that we can freeze the whole object.
        // This can be replaced with a WeakMap once they are implemented in
        // commonly used development environments.
        element._store = {};

        // To make comparing ReactElements easier for testing purposes, we make
        // the validation flag non-enumerable (where possible, which should
        // include every environment we run tests in), so the test framework
        // ignores it.
        if (canDefineProperty) {
          Object.defineProperty(element._store, 'validated', {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false
          });
          // self and source are DEV only properties.
          Object.defineProperty(element, '_self', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self
          });
          // Two elements created in two different places should be considered
          // equal for testing purposes and therefore we hide it from enumeration.
          Object.defineProperty(element, '_source', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source
          });
        } else {
          element._store.validated = false;
          element._self = self;
          element._source = source;
        }
        if (Object.freeze) {
          Object.freeze(element.props);
          Object.freeze(element);
        }
      }

      return element;
    };

    /**
     * Create and return a new ReactElement of the given type.
     * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
     */
    ReactElement$2.createElement = function (type, config, children) {
      var propName;

      // Reserved names are extracted
      var props = {};

      var key = null;
      var ref = null;
      var self = null;
      var source = null;

      if (config != null) {
        if (hasValidRef(config)) {
          ref = config.ref;
        }
        if (hasValidKey(config)) {
          key = '' + config.key;
        }

        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source;
        // Remaining properties are added to a new props object
        for (propName in config) {
          if (hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            props[propName] = config[propName];
          }
        }
      }

      // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.
      var childrenLength = arguments.length - 2;
      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
        if (process.env.NODE_ENV !== 'production') {
          if (Object.freeze) {
            Object.freeze(childArray);
          }
        }
        props.children = childArray;
      }

      // Resolve default props
      if (type && type.defaultProps) {
        var defaultProps = type.defaultProps;
        for (propName in defaultProps) {
          if (props[propName] === undefined) {
            props[propName] = defaultProps[propName];
          }
        }
      }
      if (process.env.NODE_ENV !== 'production') {
        if (key || ref) {
          if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
            var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
            if (key) {
              defineKeyPropWarningGetter(props, displayName);
            }
            if (ref) {
              defineRefPropWarningGetter(props, displayName);
            }
          }
        }
      }
      return ReactElement$2(type, key, ref, self, source, ReactCurrentOwner.current, props);
    };

    /**
     * Return a function that produces ReactElements of a given type.
     * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
     */
    ReactElement$2.createFactory = function (type) {
      var factory = ReactElement$2.createElement.bind(null, type);
      // Expose the type on the factory and the prototype so that it can be
      // easily accessed on elements. E.g. `<Foo />.type === Foo`.
      // This should not be named `constructor` since this may not be the function
      // that created the element, and it may not even be a constructor.
      // Legacy hook TODO: Warn if this is accessed
      factory.type = type;
      return factory;
    };

    ReactElement$2.cloneAndReplaceKey = function (oldElement, newKey) {
      var newElement = ReactElement$2(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

      return newElement;
    };

    /**
     * Clone and return a new ReactElement using element as the starting point.
     * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
     */
    ReactElement$2.cloneElement = function (element, config, children) {
      var propName;

      // Original props are copied
      var props = _assign$1({}, element.props);

      // Reserved names are extracted
      var key = element.key;
      var ref = element.ref;
      // Self is preserved since the owner is preserved.
      var self = element._self;
      // Source is preserved since cloneElement is unlikely to be targeted by a
      // transpiler, and the original source is probably a better indicator of the
      // true owner.
      var source = element._source;

      // Owner will be preserved, unless ref is overridden
      var owner = element._owner;

      if (config != null) {
        if (hasValidRef(config)) {
          // Silently steal the ref from the parent.
          ref = config.ref;
          owner = ReactCurrentOwner.current;
        }
        if (hasValidKey(config)) {
          key = '' + config.key;
        }

        // Remaining properties override existing props
        var defaultProps;
        if (element.type && element.type.defaultProps) {
          defaultProps = element.type.defaultProps;
        }
        for (propName in config) {
          if (hasOwnProperty$1.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            if (config[propName] === undefined && defaultProps !== undefined) {
              // Resolve default props
              props[propName] = defaultProps[propName];
            } else {
              props[propName] = config[propName];
            }
          }
        }
      }

      // Children can be more than one argument, and those are transferred onto
      // the newly allocated props object.
      var childrenLength = arguments.length - 2;
      if (childrenLength === 1) {
        props.children = children;
      } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2];
        }
        props.children = childArray;
      }

      return ReactElement$2(element.type, key, ref, self, source, owner, props);
    };

    /**
     * Verifies the object is a ReactElement.
     * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
     * @param {?object} object
     * @return {boolean} True if `object` is a valid component.
     * @final
     */
    ReactElement$2.isValidElement = function (object) {
      return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
    };

    module.exports = ReactElement$2;



    var ReactElement$3 = Object.freeze({

    });

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    function makeEmptyFunction(arg) {
      return function () {
        return arg;
      };
    }

    /**
     * This function accepts and discards inputs; it has no side effects. This is
     * primarily useful idiomatically for overridable function endpoints which
     * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
     */
    var emptyFunction$1 = function emptyFunction$1() {};

    emptyFunction$1.thatReturns = makeEmptyFunction;
    emptyFunction$1.thatReturnsFalse = makeEmptyFunction(false);
    emptyFunction$1.thatReturnsTrue = makeEmptyFunction(true);
    emptyFunction$1.thatReturnsNull = makeEmptyFunction(null);
    emptyFunction$1.thatReturnsThis = function () {
      return this;
    };
    emptyFunction$1.thatReturnsArgument = function (arg) {
      return arg;
    };

    var emptyFunction_1 = emptyFunction$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var _prodInvariant$1 = require('./reactProdInvariant');

    var ReactCurrentOwner$1 = require('./ReactCurrentOwner');
    var REACT_ELEMENT_TYPE$1 = require('./ReactElementSymbol');

    var getIteratorFn = require('./getIteratorFn');
    var invariant$2 = require('fbjs/lib/invariant');
    var KeyEscapeUtils = require('./KeyEscapeUtils');
    var warning$2 = require('fbjs/lib/warning');

    var SEPARATOR = '.';
    var SUBSEPARATOR = ':';

    /**
     * This is inlined from ReactElement since this file is shared between
     * isomorphic and renderers. We could extract this to a
     *
     */

    /**
     * TODO: Test that a single child and an array with one item have the same key
     * pattern.
     */

    var didWarnAboutMaps = false;

    /**
     * Generate a key string that identifies a component within a set.
     *
     * @param {*} component A component that could contain a manual key.
     * @param {number} index Index that is used if a manual key is not provided.
     * @return {string}
     */
    function getComponentKey(component, index) {
      // Do some typechecking here since we call this blindly. We want to ensure
      // that we don't block potential future ES APIs.
      if (component && (typeof component === 'undefined' ? 'undefined' : _typeof(component)) === 'object' && component.key != null) {
        // Explicit key
        return KeyEscapeUtils.escape(component.key);
      }
      // Implicit key determined by the index in the set
      return index.toString(36);
    }

    /**
     * @param {?*} children Children tree container.
     * @param {!string} nameSoFar Name of the key path so far.
     * @param {!function} callback Callback to invoke with each child found.
     * @param {?*} traverseContext Used to pass information throughout the traversal
     * process.
     * @return {!number} The number of children in this subtree.
     */
    function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
      var type = typeof children === 'undefined' ? 'undefined' : _typeof(children);

      if (type === 'undefined' || type === 'boolean') {
        // All of the above are perceived as null.
        children = null;
      }

      if (children === null || type === 'string' || type === 'number' ||
      // The following is inlined from ReactElement. This means we can optimize
      // some checks. React Fiber also inlines this logic for similar purposes.
      type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE$1) {
        callback(traverseContext, children,
        // If it's the only child, treat the name as if it was wrapped in an array
        // so that it's consistent if the number of children grows.
        nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
        return 1;
      }

      var child;
      var nextName;
      var subtreeCount = 0; // Count of children found in the current subtree.
      var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
          child = children[i];
          nextName = nextNamePrefix + getComponentKey(child, i);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        var iteratorFn = getIteratorFn(children);
        if (iteratorFn) {
          var iterator = iteratorFn.call(children);
          var step;
          if (iteratorFn !== children.entries) {
            var ii = 0;
            while (!(step = iterator.next()).done) {
              child = step.value;
              nextName = nextNamePrefix + getComponentKey(child, ii++);
              subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
            }
          } else {
            if (process.env.NODE_ENV !== 'production') {
              var mapsAsChildrenAddendum = '';
              if (ReactCurrentOwner$1.current) {
                var mapsAsChildrenOwnerName = ReactCurrentOwner$1.current.getName();
                if (mapsAsChildrenOwnerName) {
                  mapsAsChildrenAddendum = ' Check the render method of `' + mapsAsChildrenOwnerName + '`.';
                }
              }
              process.env.NODE_ENV !== 'production' ? warning$2(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.%s', mapsAsChildrenAddendum) : void 0;
              didWarnAboutMaps = true;
            }
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                child = entry[1];
                nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
                subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
              }
            }
          }
        } else if (type === 'object') {
          var addendum = '';
          if (process.env.NODE_ENV !== 'production') {
            addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
            if (children._isReactElement) {
              addendum = ' It looks like you\'re using an element created by a different ' + 'version of React. Make sure to use only one copy of React.';
            }
            if (ReactCurrentOwner$1.current) {
              var name = ReactCurrentOwner$1.current.getName();
              if (name) {
                addendum += ' Check the render method of `' + name + '`.';
              }
            }
          }
          var childrenString = String(children);
          process.env.NODE_ENV !== 'production' ? invariant$2(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _prodInvariant$1('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
        }
      }

      return subtreeCount;
    }

    /**
     * Traverses children that are typically specified as `props.children`, but
     * might also be specified through attributes:
     *
     * - `traverseAllChildren(this.props.children, ...)`
     * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
     *
     * The `traverseContext` is an optional argument that is passed through the
     * entire traversal. It can be used to store accumulations or anything else that
     * the callback might find relevant.
     *
     * @param {?*} children Children tree object.
     * @param {!function} callback To invoke upon traversing each child.
     * @param {?*} traverseContext Context for traversal.
     * @return {!number} The number of children in this subtree.
     */
    function traverseAllChildren$1(children, callback, traverseContext) {
      if (children == null) {
        return 0;
      }

      return traverseAllChildrenImpl(children, '', callback, traverseContext);
    }

    module.exports = traverseAllChildren$1;



    var traverseAllChildren$2 = Object.freeze({

    });

    var require$$1 = ( ReactElement$3 && ReactElement$3['default'] ) || ReactElement$3;

    var require$$0$1 = ( traverseAllChildren$2 && traverseAllChildren$2['default'] ) || traverseAllChildren$2;

    var PooledClass = PooledClass_1;
    var ReactElement$1 = require$$1;

    var emptyFunction = emptyFunction_1;
    var traverseAllChildren = require$$0$1;

    var twoArgumentPooler = PooledClass.twoArgumentPooler;
    var fourArgumentPooler = PooledClass.fourArgumentPooler;

    var userProvidedKeyEscapeRegex = /\/+/g;
    function escapeUserProvidedKey(text) {
      return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
    }

    /**
     * PooledClass representing the bookkeeping associated with performing a child
     * traversal. Allows avoiding binding callbacks.
     *
     * @constructor ForEachBookKeeping
     * @param {!function} forEachFunction Function to perform traversal with.
     * @param {?*} forEachContext Context to perform context with.
     */
    function ForEachBookKeeping(forEachFunction, forEachContext) {
      this.func = forEachFunction;
      this.context = forEachContext;
      this.count = 0;
    }
    ForEachBookKeeping.prototype.destructor = function () {
      this.func = null;
      this.context = null;
      this.count = 0;
    };
    PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

    function forEachSingleChild(bookKeeping, child, name) {
      var func = bookKeeping.func,
          context = bookKeeping.context;

      func.call(context, child, bookKeeping.count++);
    }

    /**
     * Iterates through children that are typically specified as `props.children`.
     *
     * See https://facebook.github.io/react/docs/top-level-api.html#react.children.foreach
     *
     * The provided forEachFunc(child, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} forEachFunc
     * @param {*} forEachContext Context for forEachContext.
     */
    function forEachChildren(children, forEachFunc, forEachContext) {
      if (children == null) {
        return children;
      }
      var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
      traverseAllChildren(children, forEachSingleChild, traverseContext);
      ForEachBookKeeping.release(traverseContext);
    }

    /**
     * PooledClass representing the bookkeeping associated with performing a child
     * mapping. Allows avoiding binding callbacks.
     *
     * @constructor MapBookKeeping
     * @param {!*} mapResult Object containing the ordered map of results.
     * @param {!function} mapFunction Function to perform mapping with.
     * @param {?*} mapContext Context to perform mapping with.
     */
    function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
      this.result = mapResult;
      this.keyPrefix = keyPrefix;
      this.func = mapFunction;
      this.context = mapContext;
      this.count = 0;
    }
    MapBookKeeping.prototype.destructor = function () {
      this.result = null;
      this.keyPrefix = null;
      this.func = null;
      this.context = null;
      this.count = 0;
    };
    PooledClass.addPoolingTo(MapBookKeeping, fourArgumentPooler);

    function mapSingleChildIntoContext(bookKeeping, child, childKey) {
      var result = bookKeeping.result,
          keyPrefix = bookKeeping.keyPrefix,
          func = bookKeeping.func,
          context = bookKeeping.context;

      var mappedChild = func.call(context, child, bookKeeping.count++);
      if (Array.isArray(mappedChild)) {
        mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
      } else if (mappedChild != null) {
        if (ReactElement$1.isValidElement(mappedChild)) {
          mappedChild = ReactElement$1.cloneAndReplaceKey(mappedChild,
          // Keep both the (mapped) and old keys if they differ, just as
          // traverseAllChildren used to do for objects as children
          keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
        }
        result.push(mappedChild);
      }
    }

    function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
      var escapedPrefix = '';
      if (prefix != null) {
        escapedPrefix = escapeUserProvidedKey(prefix) + '/';
      }
      var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
      traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
      MapBookKeeping.release(traverseContext);
    }

    /**
     * Maps children that are typically specified as `props.children`.
     *
     * See https://facebook.github.io/react/docs/top-level-api.html#react.children.map
     *
     * The provided mapFunction(child, key, index) will be called for each
     * leaf child.
     *
     * @param {?*} children Children tree container.
     * @param {function(*, int)} func The map function.
     * @param {*} context Context for mapFunction.
     * @return {object} Object containing the ordered map of results.
     */
    function mapChildren(children, func, context) {
      if (children == null) {
        return children;
      }
      var result = [];
      mapIntoWithKeyPrefixInternal(children, result, null, func, context);
      return result;
    }

    function forEachSingleChildDummy(traverseContext, child, name) {
      return null;
    }

    /**
     * Count the number of children that are typically specified as
     * `props.children`.
     *
     * See https://facebook.github.io/react/docs/top-level-api.html#react.children.count
     *
     * @param {?*} children Children tree container.
     * @return {number} The number of children.
     */
    function countChildren(children, context) {
      return traverseAllChildren(children, forEachSingleChildDummy, null);
    }

    /**
     * Flatten a children object (typically specified as `props.children`) and
     * return an array with appropriately re-keyed children.
     *
     * See https://facebook.github.io/react/docs/top-level-api.html#react.children.toarray
     */
    function toArray(children) {
      var result = [];
      mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
      return result;
    }

    var ReactChildren$1 = {
      forEach: forEachChildren,
      map: mapChildren,
      mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
      count: countChildren,
      toArray: toArray
    };

    var ReactChildren_1 = ReactChildren$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var _prodInvariant$2 = require('./reactProdInvariant');

    var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

    var canDefineProperty$1 = require('./canDefineProperty');
    var emptyObject = require('fbjs/lib/emptyObject');
    var invariant$3 = require('fbjs/lib/invariant');
    var warning$3 = require('fbjs/lib/warning');

    /**
     * Base class helpers for the updating state of a component.
     */
    function ReactComponent$1(props, context, updater) {
      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      // We initialize the default updater but the real one gets injected by the
      // renderer.
      this.updater = updater || ReactNoopUpdateQueue;
    }

    ReactComponent$1.prototype.isReactComponent = {};

    /**
     * Sets a subset of the state. Always use this to mutate
     * state. You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * There is no guarantee that calls to `setState` will run synchronously,
     * as they may eventually be batched together.  You can provide an optional
     * callback that will be executed when the call to setState is actually
     * completed.
     *
     * When a function is provided to setState, it will be called at some point in
     * the future (not synchronously). It will be called with the up to date
     * component arguments (state, props, context). These values can be different
     * from this.* because your function may be called after receiveProps but before
     * shouldComponentUpdate, and this new state, props, and context will not yet be
     * assigned to this.
     *
     * @param {object|function} partialState Next partial state or function to
     *        produce next partial state to be merged with current state.
     * @param {?function} callback Called after state is updated.
     * @final
     * @protected
     */
    ReactComponent$1.prototype.setState = function (partialState, callback) {
      !((typeof partialState === 'undefined' ? 'undefined' : _typeof(partialState)) === 'object' || typeof partialState === 'function' || partialState == null) ? process.env.NODE_ENV !== 'production' ? invariant$3(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : _prodInvariant$2('85') : void 0;
      this.updater.enqueueSetState(this, partialState);
      if (callback) {
        this.updater.enqueueCallback(this, callback, 'setState');
      }
    };

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {?function} callback Called after update is complete.
     * @final
     * @protected
     */
    ReactComponent$1.prototype.forceUpdate = function (callback) {
      this.updater.enqueueForceUpdate(this);
      if (callback) {
        this.updater.enqueueCallback(this, callback, 'forceUpdate');
      }
    };

    /**
     * Deprecated APIs. These APIs used to exist on classic React classes but since
     * we would like to deprecate them, we're not going to move them over to this
     * modern base class. Instead, we define a getter that warns if it's accessed.
     */
    if (process.env.NODE_ENV !== 'production') {
      var deprecatedAPIs = {
        isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
        replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
      };
      var defineDeprecationWarning = function defineDeprecationWarning(methodName, info) {
        if (canDefineProperty$1) {
          Object.defineProperty(ReactComponent$1.prototype, methodName, {
            get: function get() {
              process.env.NODE_ENV !== 'production' ? warning$3(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]) : void 0;
              return undefined;
            }
          });
        }
      };
      for (var fnName in deprecatedAPIs) {
        if (deprecatedAPIs.hasOwnProperty(fnName)) {
          defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
        }
      }
    }

    module.exports = ReactComponent$1;



    var ReactComponent$2 = Object.freeze({

    });

    var emptyFunction$2 = emptyFunction_1;

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */

    var warning$5 = emptyFunction$2;

    if (process.env.NODE_ENV !== 'production') {
      (function () {
        var printWarning = function printWarning(format) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          var argIndex = 0;
          var message = 'Warning: ' + format.replace(/%s/g, function () {
            return args[argIndex++];
          });
          if (typeof console !== 'undefined') {
            console.error(message);
          }
          try {
            // --- Welcome to debugging React ---
            // This error was thrown as a convenience so that you can use this stack
            // to find the callsite that caused this warning to fire.
            throw new Error(message);
          } catch (x) {}
        };

        warning$5 = function warning$5(condition, format) {
          if (format === undefined) {
            throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
          }

          if (format.indexOf('Failed Composite propType: ') === 0) {
            return; // Ignore CompositeComponent proptype check.
          }

          if (!condition) {
            for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
              args[_key2 - 2] = arguments[_key2];
            }

            printWarning.apply(undefined, [format].concat(args));
          }
        };
      })();
    }

    var warning_1 = warning$5;

    var warning$4 = warning_1;

    function warnNoop(publicInstance, callerName) {
      if (process.env.NODE_ENV !== 'production') {
        var constructor = publicInstance.constructor;
        process.env.NODE_ENV !== 'production' ? warning$4(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass') : void 0;
      }
    }

    /**
     * This is the abstract API for an update queue.
     */
    var ReactNoopUpdateQueue$2 = {

      /**
       * Checks whether or not this composite component is mounted.
       * @param {ReactClass} publicInstance The instance we want to test.
       * @return {boolean} True if mounted, false otherwise.
       * @protected
       * @final
       */
      isMounted: function isMounted(publicInstance) {
        return false;
      },

      /**
       * Enqueue a callback that will be executed after all the pending updates
       * have processed.
       *
       * @param {ReactClass} publicInstance The instance to use as `this` context.
       * @param {?function} callback Called after state is updated.
       * @internal
       */
      enqueueCallback: function enqueueCallback(publicInstance, callback) {},

      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @internal
       */
      enqueueForceUpdate: function enqueueForceUpdate(publicInstance) {
        warnNoop(publicInstance, 'forceUpdate');
      },

      /**
       * Replaces all of the state. Always use this or `setState` to mutate state.
       * You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} completeState Next state.
       * @internal
       */
      enqueueReplaceState: function enqueueReplaceState(publicInstance, completeState) {
        warnNoop(publicInstance, 'replaceState');
      },

      /**
       * Sets a subset of the state. This only exists because _pendingState is
       * internal. This provides a merging strategy that is not available to deep
       * properties which is confusing. TODO: Expose pendingState or don't use it
       * during the merge.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} partialState Next partial state to be merged with state.
       * @internal
       */
      enqueueSetState: function enqueueSetState(publicInstance, partialState) {
        warnNoop(publicInstance, 'setState');
      }
    };

    var ReactNoopUpdateQueue_1 = ReactNoopUpdateQueue$2;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var emptyObject$2 = {};

    if (process.env.NODE_ENV !== 'production') {
      Object.freeze(emptyObject$2);
    }

    var emptyObject_1 = emptyObject$2;

    var require$$2$2 = ( ReactComponent$2 && ReactComponent$2['default'] ) || ReactComponent$2;

    var _assign$2 = index;

    var ReactComponent$3 = require$$2$2;
    var ReactNoopUpdateQueue$1 = ReactNoopUpdateQueue_1;

    var emptyObject$1 = emptyObject_1;

    /**
     * Base class helpers for the updating state of a component.
     */
    function ReactPureComponent$1(props, context, updater) {
      // Duplicated from ReactComponent.
      this.props = props;
      this.context = context;
      this.refs = emptyObject$1;
      // We initialize the default updater but the real one gets injected by the
      // renderer.
      this.updater = updater || ReactNoopUpdateQueue$1;
    }

    function ComponentDummy() {}
    ComponentDummy.prototype = ReactComponent$3.prototype;
    ReactPureComponent$1.prototype = new ComponentDummy();
    ReactPureComponent$1.prototype.constructor = ReactPureComponent$1;
    // Avoid an extra prototype jump for these methods.
    _assign$2(ReactPureComponent$1.prototype, ReactComponent$3.prototype);
    ReactPureComponent$1.prototype.isPureReactComponent = true;

    var ReactPureComponent_1 = ReactPureComponent$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var _prodInvariant$3 = require('./reactProdInvariant');
    var _assign$3 = require('object-assign');

    var ReactComponent$4 = require('./ReactComponent');
    var ReactElement$4 = require('./ReactElement');
    var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
    var ReactNoopUpdateQueue$3 = require('./ReactNoopUpdateQueue');

    var emptyObject$3 = require('fbjs/lib/emptyObject');
    var invariant$4 = require('fbjs/lib/invariant');
    var warning$6 = require('fbjs/lib/warning');

    var MIXINS_KEY = 'mixins';

    // Helper function to allow the creation of anonymous functions which do not
    // have .name set to the name of the variable being assigned to.
    function identity(fn) {
      return fn;
    }

    /**
     * Policies that describe methods in `ReactClassInterface`.
     */

    var injectedMixins = [];

    /**
     * Composite components are higher-level components that compose other composite
     * or host components.
     *
     * To create a new type of `ReactClass`, pass a specification of
     * your new class to `React.createClass`. The only requirement of your class
     * specification is that you implement a `render` method.
     *
     *   var MyComponent = React.createClass({
     *     render: function() {
     *       return <div>Hello World</div>;
     *     }
     *   });
     *
     * The class specification supports a specific protocol of methods that have
     * special meaning (e.g. `render`). See `ReactClassInterface` for
     * more the comprehensive protocol. Any other properties and methods in the
     * class specification will be available on the prototype.
     *
     * @interface ReactClassInterface
     * @internal
     */
    var ReactClassInterface = {

      /**
       * An array of Mixin objects to include when defining your component.
       *
       * @type {array}
       * @optional
       */
      mixins: 'DEFINE_MANY',

      /**
       * An object containing properties and methods that should be defined on
       * the component's constructor instead of its prototype (static methods).
       *
       * @type {object}
       * @optional
       */
      statics: 'DEFINE_MANY',

      /**
       * Definition of prop types for this component.
       *
       * @type {object}
       * @optional
       */
      propTypes: 'DEFINE_MANY',

      /**
       * Definition of context types for this component.
       *
       * @type {object}
       * @optional
       */
      contextTypes: 'DEFINE_MANY',

      /**
       * Definition of context types this component sets for its children.
       *
       * @type {object}
       * @optional
       */
      childContextTypes: 'DEFINE_MANY',

      // ==== Definition methods ====

      /**
       * Invoked when the component is mounted. Values in the mapping will be set on
       * `this.props` if that prop is not specified (i.e. using an `in` check).
       *
       * This method is invoked before `getInitialState` and therefore cannot rely
       * on `this.state` or use `this.setState`.
       *
       * @return {object}
       * @optional
       */
      getDefaultProps: 'DEFINE_MANY_MERGED',

      /**
       * Invoked once before the component is mounted. The return value will be used
       * as the initial value of `this.state`.
       *
       *   getInitialState: function() {
       *     return {
       *       isOn: false,
       *       fooBaz: new BazFoo()
       *     }
       *   }
       *
       * @return {object}
       * @optional
       */
      getInitialState: 'DEFINE_MANY_MERGED',

      /**
       * @return {object}
       * @optional
       */
      getChildContext: 'DEFINE_MANY_MERGED',

      /**
       * Uses props from `this.props` and state from `this.state` to render the
       * structure of the component.
       *
       * No guarantees are made about when or how often this method is invoked, so
       * it must not have side effects.
       *
       *   render: function() {
       *     var name = this.props.name;
       *     return <div>Hello, {name}!</div>;
       *   }
       *
       * @return {ReactComponent}
       * @nosideeffects
       * @required
       */
      render: 'DEFINE_ONCE',

      // ==== Delegate methods ====

      /**
       * Invoked when the component is initially created and about to be mounted.
       * This may have side effects, but any external subscriptions or data created
       * by this method must be cleaned up in `componentWillUnmount`.
       *
       * @optional
       */
      componentWillMount: 'DEFINE_MANY',

      /**
       * Invoked when the component has been mounted and has a DOM representation.
       * However, there is no guarantee that the DOM node is in the document.
       *
       * Use this as an opportunity to operate on the DOM when the component has
       * been mounted (initialized and rendered) for the first time.
       *
       * @param {DOMElement} rootNode DOM element representing the component.
       * @optional
       */
      componentDidMount: 'DEFINE_MANY',

      /**
       * Invoked before the component receives new props.
       *
       * Use this as an opportunity to react to a prop transition by updating the
       * state using `this.setState`. Current props are accessed via `this.props`.
       *
       *   componentWillReceiveProps: function(nextProps, nextContext) {
       *     this.setState({
       *       likesIncreasing: nextProps.likeCount > this.props.likeCount
       *     });
       *   }
       *
       * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
       * transition may cause a state change, but the opposite is not true. If you
       * need it, you are probably looking for `componentWillUpdate`.
       *
       * @param {object} nextProps
       * @optional
       */
      componentWillReceiveProps: 'DEFINE_MANY',

      /**
       * Invoked while deciding if the component should be updated as a result of
       * receiving new props, state and/or context.
       *
       * Use this as an opportunity to `return false` when you're certain that the
       * transition to the new props/state/context will not require a component
       * update.
       *
       *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
       *     return !equal(nextProps, this.props) ||
       *       !equal(nextState, this.state) ||
       *       !equal(nextContext, this.context);
       *   }
       *
       * @param {object} nextProps
       * @param {?object} nextState
       * @param {?object} nextContext
       * @return {boolean} True if the component should update.
       * @optional
       */
      shouldComponentUpdate: 'DEFINE_ONCE',

      /**
       * Invoked when the component is about to update due to a transition from
       * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
       * and `nextContext`.
       *
       * Use this as an opportunity to perform preparation before an update occurs.
       *
       * NOTE: You **cannot** use `this.setState()` in this method.
       *
       * @param {object} nextProps
       * @param {?object} nextState
       * @param {?object} nextContext
       * @param {ReactReconcileTransaction} transaction
       * @optional
       */
      componentWillUpdate: 'DEFINE_MANY',

      /**
       * Invoked when the component's DOM representation has been updated.
       *
       * Use this as an opportunity to operate on the DOM when the component has
       * been updated.
       *
       * @param {object} prevProps
       * @param {?object} prevState
       * @param {?object} prevContext
       * @param {DOMElement} rootNode DOM element representing the component.
       * @optional
       */
      componentDidUpdate: 'DEFINE_MANY',

      /**
       * Invoked when the component is about to be removed from its parent and have
       * its DOM representation destroyed.
       *
       * Use this as an opportunity to deallocate any external resources.
       *
       * NOTE: There is no `componentDidUnmount` since your component will have been
       * destroyed by that point.
       *
       * @optional
       */
      componentWillUnmount: 'DEFINE_MANY',

      // ==== Advanced methods ====

      /**
       * Updates the component's currently mounted DOM representation.
       *
       * By default, this implements React's rendering and reconciliation algorithm.
       * Sophisticated clients may wish to override this.
       *
       * @param {ReactReconcileTransaction} transaction
       * @internal
       * @overridable
       */
      updateComponent: 'OVERRIDE_BASE'

    };

    /**
     * Mapping from class specification keys to special processing functions.
     *
     * Although these are declared like instance properties in the specification
     * when defining classes using `React.createClass`, they are actually static
     * and are accessible on the constructor instead of the prototype. Despite
     * being static, they must be defined outside of the "statics" key under
     * which all other static methods are defined.
     */
    var RESERVED_SPEC_KEYS = {
      displayName: function displayName(Constructor, _displayName) {
        Constructor.displayName = _displayName;
      },
      mixins: function mixins(Constructor, _mixins) {
        if (_mixins) {
          for (var i = 0; i < _mixins.length; i++) {
            mixSpecIntoComponent(Constructor, _mixins[i]);
          }
        }
      },
      childContextTypes: function childContextTypes(Constructor, _childContextTypes) {
        if (process.env.NODE_ENV !== 'production') {
          validateTypeDef(Constructor, _childContextTypes, 'childContext');
        }
        Constructor.childContextTypes = _assign$3({}, Constructor.childContextTypes, _childContextTypes);
      },
      contextTypes: function contextTypes(Constructor, _contextTypes) {
        if (process.env.NODE_ENV !== 'production') {
          validateTypeDef(Constructor, _contextTypes, 'context');
        }
        Constructor.contextTypes = _assign$3({}, Constructor.contextTypes, _contextTypes);
      },
      /**
       * Special case getDefaultProps which should move into statics but requires
       * automatic merging.
       */
      getDefaultProps: function getDefaultProps(Constructor, _getDefaultProps) {
        if (Constructor.getDefaultProps) {
          Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, _getDefaultProps);
        } else {
          Constructor.getDefaultProps = _getDefaultProps;
        }
      },
      propTypes: function propTypes(Constructor, _propTypes) {
        if (process.env.NODE_ENV !== 'production') {
          validateTypeDef(Constructor, _propTypes, 'prop');
        }
        Constructor.propTypes = _assign$3({}, Constructor.propTypes, _propTypes);
      },
      statics: function statics(Constructor, _statics) {
        mixStaticSpecIntoComponent(Constructor, _statics);
      },
      autobind: function autobind() {} };

    function validateTypeDef(Constructor, typeDef, location) {
      for (var propName in typeDef) {
        if (typeDef.hasOwnProperty(propName)) {
          // use a warning instead of an invariant so components
          // don't show up in prod but only in __DEV__
          process.env.NODE_ENV !== 'production' ? warning$6(typeof typeDef[propName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', Constructor.displayName || 'ReactClass', ReactPropTypeLocationNames[location], propName) : void 0;
        }
      }
    }

    function validateMethodOverride(isAlreadyDefined, name) {
      var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null;

      // Disallow overriding of base class methods unless explicitly allowed.
      if (ReactClassMixin.hasOwnProperty(name)) {
        !(specPolicy === 'OVERRIDE_BASE') ? process.env.NODE_ENV !== 'production' ? invariant$4(false, 'ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.', name) : _prodInvariant$3('73', name) : void 0;
      }

      // Disallow defining methods more than once unless explicitly allowed.
      if (isAlreadyDefined) {
        !(specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED') ? process.env.NODE_ENV !== 'production' ? invariant$4(false, 'ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant$3('74', name) : void 0;
      }
    }

    /**
     * Mixin helper which handles policy validation and reserved
     * specification keys when building React classes.
     */
    function mixSpecIntoComponent(Constructor, spec) {
      if (!spec) {
        if (process.env.NODE_ENV !== 'production') {
          var typeofSpec = typeof spec === 'undefined' ? 'undefined' : _typeof(spec);
          var isMixinValid = typeofSpec === 'object' && spec !== null;

          process.env.NODE_ENV !== 'production' ? warning$6(isMixinValid, '%s: You\'re attempting to include a mixin that is either null ' + 'or not an object. Check the mixins included by the component, ' + 'as well as any mixins they include themselves. ' + 'Expected object but got %s.', Constructor.displayName || 'ReactClass', spec === null ? null : typeofSpec) : void 0;
        }

        return;
      }

      !(typeof spec !== 'function') ? process.env.NODE_ENV !== 'production' ? invariant$4(false, 'ReactClass: You\'re attempting to use a component class or function as a mixin. Instead, just use a regular object.') : _prodInvariant$3('75') : void 0;
      !!ReactElement$4.isValidElement(spec) ? process.env.NODE_ENV !== 'production' ? invariant$4(false, 'ReactClass: You\'re attempting to use a component as a mixin. Instead, just use a regular object.') : _prodInvariant$3('76') : void 0;

      var proto = Constructor.prototype;
      var autoBindPairs = proto.__reactAutoBindPairs;

      // By handling mixins before any other properties, we ensure the same
      // chaining order is applied to methods with DEFINE_MANY policy, whether
      // mixins are listed before or after these methods in the spec.
      if (spec.hasOwnProperty(MIXINS_KEY)) {
        RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
      }

      for (var name in spec) {
        if (!spec.hasOwnProperty(name)) {
          continue;
        }

        if (name === MIXINS_KEY) {
          // We have already handled mixins in a special case above.
          continue;
        }

        var property = spec[name];
        var isAlreadyDefined = proto.hasOwnProperty(name);
        validateMethodOverride(isAlreadyDefined, name);

        if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
          RESERVED_SPEC_KEYS[name](Constructor, property);
        } else {
          // Setup methods on prototype:
          // The following member methods should not be automatically bound:
          // 1. Expected ReactClass methods (in the "interface").
          // 2. Overridden methods (that were mixed in).
          var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
          var isFunction = typeof property === 'function';
          var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

          if (shouldAutoBind) {
            autoBindPairs.push(name, property);
            proto[name] = property;
          } else {
            if (isAlreadyDefined) {
              var specPolicy = ReactClassInterface[name];

              // These cases should already be caught by validateMethodOverride.
              !(isReactClassMethod && (specPolicy === 'DEFINE_MANY_MERGED' || specPolicy === 'DEFINE_MANY')) ? process.env.NODE_ENV !== 'production' ? invariant$4(false, 'ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.', specPolicy, name) : _prodInvariant$3('77', specPolicy, name) : void 0;

              // For methods which are defined more than once, call the existing
              // methods before calling the new property, merging if appropriate.
              if (specPolicy === 'DEFINE_MANY_MERGED') {
                proto[name] = createMergedResultFunction(proto[name], property);
              } else if (specPolicy === 'DEFINE_MANY') {
                proto[name] = createChainedFunction(proto[name], property);
              }
            } else {
              proto[name] = property;
              if (process.env.NODE_ENV !== 'production') {
                // Add verbose displayName to the function, which helps when looking
                // at profiling tools.
                if (typeof property === 'function' && spec.displayName) {
                  proto[name].displayName = spec.displayName + '_' + name;
                }
              }
            }
          }
        }
      }
    }

    function mixStaticSpecIntoComponent(Constructor, statics) {
      if (!statics) {
        return;
      }
      for (var name in statics) {
        var property = statics[name];
        if (!statics.hasOwnProperty(name)) {
          continue;
        }

        var isReserved = name in RESERVED_SPEC_KEYS;
        !!isReserved ? process.env.NODE_ENV !== 'production' ? invariant$4(false, 'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.', name) : _prodInvariant$3('78', name) : void 0;

        var isInherited = name in Constructor;
        !!isInherited ? process.env.NODE_ENV !== 'production' ? invariant$4(false, 'ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant$3('79', name) : void 0;
        Constructor[name] = property;
      }
    }

    /**
     * Merge two objects, but throw if both contain the same key.
     *
     * @param {object} one The first object, which is mutated.
     * @param {object} two The second object
     * @return {object} one after it has been mutated to contain everything in two.
     */
    function mergeIntoWithNoDuplicateKeys(one, two) {
      !(one && two && (typeof one === 'undefined' ? 'undefined' : _typeof(one)) === 'object' && (typeof two === 'undefined' ? 'undefined' : _typeof(two)) === 'object') ? process.env.NODE_ENV !== 'production' ? invariant$4(false, 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.') : _prodInvariant$3('80') : void 0;

      for (var key in two) {
        if (two.hasOwnProperty(key)) {
          !(one[key] === undefined) ? process.env.NODE_ENV !== 'production' ? invariant$4(false, 'mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.', key) : _prodInvariant$3('81', key) : void 0;
          one[key] = two[key];
        }
      }
      return one;
    }

    /**
     * Creates a function that invokes two functions and merges their return values.
     *
     * @param {function} one Function to invoke first.
     * @param {function} two Function to invoke second.
     * @return {function} Function that invokes the two argument functions.
     * @private
     */
    function createMergedResultFunction(one, two) {
      return function mergedResult() {
        var a = one.apply(this, arguments);
        var b = two.apply(this, arguments);
        if (a == null) {
          return b;
        } else if (b == null) {
          return a;
        }
        var c = {};
        mergeIntoWithNoDuplicateKeys(c, a);
        mergeIntoWithNoDuplicateKeys(c, b);
        return c;
      };
    }

    /**
     * Creates a function that invokes two functions and ignores their return vales.
     *
     * @param {function} one Function to invoke first.
     * @param {function} two Function to invoke second.
     * @return {function} Function that invokes the two argument functions.
     * @private
     */
    function createChainedFunction(one, two) {
      return function chainedFunction() {
        one.apply(this, arguments);
        two.apply(this, arguments);
      };
    }

    /**
     * Binds a method to the component.
     *
     * @param {object} component Component whose method is going to be bound.
     * @param {function} method Method to be bound.
     * @return {function} The bound method.
     */
    function bindAutoBindMethod(component, method) {
      var boundMethod = method.bind(component);
      if (process.env.NODE_ENV !== 'production') {
        boundMethod.__reactBoundContext = component;
        boundMethod.__reactBoundMethod = method;
        boundMethod.__reactBoundArguments = null;
        var componentName = component.constructor.displayName;
        var _bind = boundMethod.bind;
        boundMethod.bind = function (newThis) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          // User is trying to bind() an autobound method; we effectively will
          // ignore the value of "this" that the user is trying to use, so
          // let's warn.
          if (newThis !== component && newThis !== null) {
            process.env.NODE_ENV !== 'production' ? warning$6(false, 'bind(): React component methods may only be bound to the ' + 'component instance. See %s', componentName) : void 0;
          } else if (!args.length) {
            process.env.NODE_ENV !== 'production' ? warning$6(false, 'bind(): You are binding a component method to the component. ' + 'React does this for you automatically in a high-performance ' + 'way, so you can safely remove this call. See %s', componentName) : void 0;
            return boundMethod;
          }
          var reboundMethod = _bind.apply(boundMethod, arguments);
          reboundMethod.__reactBoundContext = component;
          reboundMethod.__reactBoundMethod = method;
          reboundMethod.__reactBoundArguments = args;
          return reboundMethod;
        };
      }
      return boundMethod;
    }

    /**
     * Binds all auto-bound methods in a component.
     *
     * @param {object} component Component whose method is going to be bound.
     */
    function bindAutoBindMethods(component) {
      var pairs = component.__reactAutoBindPairs;
      for (var i = 0; i < pairs.length; i += 2) {
        var autoBindKey = pairs[i];
        var method = pairs[i + 1];
        component[autoBindKey] = bindAutoBindMethod(component, method);
      }
    }

    /**
     * Add more to the ReactClass base class. These are all legacy features and
     * therefore not already part of the modern ReactComponent.
     */
    var ReactClassMixin = {

      /**
       * TODO: This will be deprecated because state should always keep a consistent
       * type signature and the only use case for this, is to avoid that.
       */
      replaceState: function replaceState(newState, callback) {
        this.updater.enqueueReplaceState(this, newState);
        if (callback) {
          this.updater.enqueueCallback(this, callback, 'replaceState');
        }
      },

      /**
       * Checks whether or not this composite component is mounted.
       * @return {boolean} True if mounted, false otherwise.
       * @protected
       * @final
       */
      isMounted: function isMounted() {
        return this.updater.isMounted(this);
      }
    };

    var ReactClassComponent = function ReactClassComponent() {};
    _assign$3(ReactClassComponent.prototype, ReactComponent$4.prototype, ReactClassMixin);

    /**
     * Module for creating composite components.
     *
     * @class ReactClass
     */
    var ReactClass$1 = {

      /**
       * Creates a composite component class given a class specification.
       * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
       *
       * @param {object} spec Class specification (which must define `render`).
       * @return {function} Component constructor function.
       * @public
       */
      createClass: function createClass(spec) {
        // To keep our warnings more understandable, we'll use a little hack here to
        // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
        // unnecessarily identify a class without displayName as 'Constructor'.
        var Constructor = identity(function (props, context, updater) {
          // This constructor gets overridden by mocks. The argument is used
          // by mocks to assert on what gets mounted.

          if (process.env.NODE_ENV !== 'production') {
            process.env.NODE_ENV !== 'production' ? warning$6(this instanceof Constructor, 'Something is calling a React component directly. Use a factory or ' + 'JSX instead. See: https://fb.me/react-legacyfactory') : void 0;
          }

          // Wire up auto-binding
          if (this.__reactAutoBindPairs.length) {
            bindAutoBindMethods(this);
          }

          this.props = props;
          this.context = context;
          this.refs = emptyObject$3;
          this.updater = updater || ReactNoopUpdateQueue$3;

          this.state = null;

          // ReactClasses doesn't have constructors. Instead, they use the
          // getInitialState and componentWillMount methods for initialization.

          var initialState = this.getInitialState ? this.getInitialState() : null;
          if (process.env.NODE_ENV !== 'production') {
            // We allow auto-mocks to proceed as if they're returning null.
            if (initialState === undefined && this.getInitialState._isMockFunction) {
              // This is probably bad practice. Consider warning here and
              // deprecating this convenience.
              initialState = null;
            }
          }
          !((typeof initialState === 'undefined' ? 'undefined' : _typeof(initialState)) === 'object' && !Array.isArray(initialState)) ? process.env.NODE_ENV !== 'production' ? invariant$4(false, '%s.getInitialState(): must return an object or null', Constructor.displayName || 'ReactCompositeComponent') : _prodInvariant$3('82', Constructor.displayName || 'ReactCompositeComponent') : void 0;

          this.state = initialState;
        });
        Constructor.prototype = new ReactClassComponent();
        Constructor.prototype.constructor = Constructor;
        Constructor.prototype.__reactAutoBindPairs = [];

        injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

        mixSpecIntoComponent(Constructor, spec);

        // Initialize the defaultProps property after all mixins have been merged.
        if (Constructor.getDefaultProps) {
          Constructor.defaultProps = Constructor.getDefaultProps();
        }

        if (process.env.NODE_ENV !== 'production') {
          // This is a tag to indicate that the use of these method names is ok,
          // since it's used with createClass. If it's not, then it's likely a
          // mistake so we'll warn you to use the static property, property
          // initializer or constructor respectively.
          if (Constructor.getDefaultProps) {
            Constructor.getDefaultProps.isReactClassApproved = {};
          }
          if (Constructor.prototype.getInitialState) {
            Constructor.prototype.getInitialState.isReactClassApproved = {};
          }
        }

        !Constructor.prototype.render ? process.env.NODE_ENV !== 'production' ? invariant$4(false, 'createClass(...): Class specification must implement a `render` method.') : _prodInvariant$3('83') : void 0;

        if (process.env.NODE_ENV !== 'production') {
          process.env.NODE_ENV !== 'production' ? warning$6(!Constructor.prototype.componentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', spec.displayName || 'A component') : void 0;
          process.env.NODE_ENV !== 'production' ? warning$6(!Constructor.prototype.componentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', spec.displayName || 'A component') : void 0;
        }

        // Reduce time spent doing lookups by setting these on the prototype.
        for (var methodName in ReactClassInterface) {
          if (!Constructor.prototype[methodName]) {
            Constructor.prototype[methodName] = null;
          }
        }

        return Constructor;
      },

      injection: {
        injectMixin: function injectMixin(mixin) {
          injectedMixins.push(mixin);
        }
      }

    };

    module.exports = ReactClass$1;



    var ReactClass$2 = Object.freeze({

    });

    /**
     * Copyright 2014-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /**
     * ReactElementValidator provides a wrapper around a element factory
     * which validates the props passed to the element. This is intended to be
     * used only in DEV and could be replaced by a static type checker for languages
     * that support it.
     */

    var ReactCurrentOwner$2 = require('./ReactCurrentOwner');
    var ReactComponentTreeHook = require('./ReactComponentTreeHook');
    var ReactElement$6 = require('./ReactElement');

    var checkReactTypeSpec = require('./checkReactTypeSpec');

    var canDefineProperty$2 = require('./canDefineProperty');
    var getIteratorFn$1 = require('./getIteratorFn');
    var warning$7 = require('fbjs/lib/warning');

    function getDeclarationErrorAddendum() {
      if (ReactCurrentOwner$2.current) {
        var name = ReactCurrentOwner$2.current.getName();
        if (name) {
          return ' Check the render method of `' + name + '`.';
        }
      }
      return '';
    }

    /**
     * Warn if there's no key explicitly set on dynamic arrays of children or
     * object keys are not valid. This allows us to keep track of children between
     * updates.
     */
    var ownerHasKeyUseWarning = {};

    function getCurrentComponentErrorInfo(parentType) {
      var info = getDeclarationErrorAddendum();

      if (!info) {
        var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
        if (parentName) {
          info = ' Check the top-level render call using <' + parentName + '>.';
        }
      }
      return info;
    }

    /**
     * Warn if the element doesn't have an explicit key assigned to it.
     * This element is in an array. The array could grow and shrink or be
     * reordered. All children that haven't already been validated are required to
     * have a "key" property assigned to it. Error statuses are cached so a warning
     * will only be shown once.
     *
     * @internal
     * @param {ReactElement} element Element that requires a key.
     * @param {*} parentType element's parent's type.
     */
    function validateExplicitKey(element, parentType) {
      if (!element._store || element._store.validated || element.key != null) {
        return;
      }
      element._store.validated = true;

      var memoizer = ownerHasKeyUseWarning.uniqueKey || (ownerHasKeyUseWarning.uniqueKey = {});

      var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
      if (memoizer[currentComponentErrorInfo]) {
        return;
      }
      memoizer[currentComponentErrorInfo] = true;

      // Usually the current owner is the offender, but if it accepts children as a
      // property, it may be the creator of the child that's responsible for
      // assigning it a key.
      var childOwner = '';
      if (element && element._owner && element._owner !== ReactCurrentOwner$2.current) {
        // Give the component that originally created this child.
        childOwner = ' It was passed a child from ' + element._owner.getName() + '.';
      }

      process.env.NODE_ENV !== 'production' ? warning$7(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, ReactComponentTreeHook.getCurrentStackAddendum(element)) : void 0;
    }

    /**
     * Ensure that every element either is passed in a static location, in an
     * array with an explicit keys property defined, or in an object literal
     * with valid key property.
     *
     * @internal
     * @param {ReactNode} node Statically passed child of any type.
     * @param {*} parentType node's parent's type.
     */
    function validateChildKeys(node, parentType) {
      if ((typeof node === 'undefined' ? 'undefined' : _typeof(node)) !== 'object') {
        return;
      }
      if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) {
          var child = node[i];
          if (ReactElement$6.isValidElement(child)) {
            validateExplicitKey(child, parentType);
          }
        }
      } else if (ReactElement$6.isValidElement(node)) {
        // This element was passed in a valid location.
        if (node._store) {
          node._store.validated = true;
        }
      } else if (node) {
        var iteratorFn = getIteratorFn$1(node);
        // Entry iterators provide implicit keys.
        if (iteratorFn) {
          if (iteratorFn !== node.entries) {
            var iterator = iteratorFn.call(node);
            var step;
            while (!(step = iterator.next()).done) {
              if (ReactElement$6.isValidElement(step.value)) {
                validateExplicitKey(step.value, parentType);
              }
            }
          }
        }
      }
    }

    /**
     * Given an element, validate that its props follow the propTypes definition,
     * provided by the type.
     *
     * @param {ReactElement} element
     */
    function validatePropTypes(element) {
      var componentClass = element.type;
      if (typeof componentClass !== 'function') {
        return;
      }
      var name = componentClass.displayName || componentClass.name;
      if (componentClass.propTypes) {
        checkReactTypeSpec(componentClass.propTypes, element.props, 'prop', name, element, null);
      }
      if (typeof componentClass.getDefaultProps === 'function') {
        process.env.NODE_ENV !== 'production' ? warning$7(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
      }
    }

    var ReactElementValidator$2 = {

      createElement: function createElement(type, props, children) {
        var validType = typeof type === 'string' || typeof type === 'function';
        // We warn in this case but don't throw. We expect the element creation to
        // succeed and there will likely be errors in render.
        if (!validType) {
          if (typeof type !== 'function' && typeof type !== 'string') {
            var info = '';
            if (type === undefined || (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object' && type !== null && Object.keys(type).length === 0) {
              info += ' You likely forgot to export your component from the file ' + 'it\'s defined in.';
            }
            info += getDeclarationErrorAddendum();
            process.env.NODE_ENV !== 'production' ? warning$7(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', type == null ? type : typeof type === 'undefined' ? 'undefined' : _typeof(type), info) : void 0;
          }
        }

        var element = ReactElement$6.createElement.apply(this, arguments);

        // The result can be nullish if a mock or a custom function is used.
        // TODO: Drop this when these are no longer allowed as the type argument.
        if (element == null) {
          return element;
        }

        // Skip key warning if the type isn't valid since our key validation logic
        // doesn't expect a non-string/function type and can throw confusing errors.
        // We don't want exception behavior to differ between dev and prod.
        // (Rendering will throw with a helpful message and as soon as the type is
        // fixed, the key warnings will appear.)
        if (validType) {
          for (var i = 2; i < arguments.length; i++) {
            validateChildKeys(arguments[i], type);
          }
        }

        validatePropTypes(element);

        return element;
      },

      createFactory: function createFactory(type) {
        var validatedFactory = ReactElementValidator$2.createElement.bind(null, type);
        // Legacy hook TODO: Warn if this is accessed
        validatedFactory.type = type;

        if (process.env.NODE_ENV !== 'production') {
          if (canDefineProperty$2) {
            Object.defineProperty(validatedFactory, 'type', {
              enumerable: false,
              get: function get() {
                process.env.NODE_ENV !== 'production' ? warning$7(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.') : void 0;
                Object.defineProperty(this, 'type', {
                  value: type
                });
                return type;
              }
            });
          }
        }

        return validatedFactory;
      },

      cloneElement: function cloneElement(element, props, children) {
        var newElement = ReactElement$6.cloneElement.apply(this, arguments);
        for (var i = 2; i < arguments.length; i++) {
          validateChildKeys(arguments[i], newElement.type);
        }
        validatePropTypes(newElement);
        return newElement;
      }

    };

    module.exports = ReactElementValidator$2;



    var ReactElementValidator$3 = Object.freeze({

    });

    var require$$0$4 = ( ReactElementValidator$3 && ReactElementValidator$3['default'] ) || ReactElementValidator$3;

    var ReactElement$5 = require$$1;

    /**
     * Create a factory that creates HTML tag elements.
     *
     * @private
     */
    var createDOMFactory = ReactElement$5.createFactory;
    if (process.env.NODE_ENV !== 'production') {
      var ReactElementValidator$1 = require$$0$4;
      createDOMFactory = ReactElementValidator$1.createFactory;
    }

    /**
     * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
     * This is also accessible via `React.DOM`.
     *
     * @public
     */
    var ReactDOMFactories$1 = {
      a: createDOMFactory('a'),
      abbr: createDOMFactory('abbr'),
      address: createDOMFactory('address'),
      area: createDOMFactory('area'),
      article: createDOMFactory('article'),
      aside: createDOMFactory('aside'),
      audio: createDOMFactory('audio'),
      b: createDOMFactory('b'),
      base: createDOMFactory('base'),
      bdi: createDOMFactory('bdi'),
      bdo: createDOMFactory('bdo'),
      big: createDOMFactory('big'),
      blockquote: createDOMFactory('blockquote'),
      body: createDOMFactory('body'),
      br: createDOMFactory('br'),
      button: createDOMFactory('button'),
      canvas: createDOMFactory('canvas'),
      caption: createDOMFactory('caption'),
      cite: createDOMFactory('cite'),
      code: createDOMFactory('code'),
      col: createDOMFactory('col'),
      colgroup: createDOMFactory('colgroup'),
      data: createDOMFactory('data'),
      datalist: createDOMFactory('datalist'),
      dd: createDOMFactory('dd'),
      del: createDOMFactory('del'),
      details: createDOMFactory('details'),
      dfn: createDOMFactory('dfn'),
      dialog: createDOMFactory('dialog'),
      div: createDOMFactory('div'),
      dl: createDOMFactory('dl'),
      dt: createDOMFactory('dt'),
      em: createDOMFactory('em'),
      embed: createDOMFactory('embed'),
      fieldset: createDOMFactory('fieldset'),
      figcaption: createDOMFactory('figcaption'),
      figure: createDOMFactory('figure'),
      footer: createDOMFactory('footer'),
      form: createDOMFactory('form'),
      h1: createDOMFactory('h1'),
      h2: createDOMFactory('h2'),
      h3: createDOMFactory('h3'),
      h4: createDOMFactory('h4'),
      h5: createDOMFactory('h5'),
      h6: createDOMFactory('h6'),
      head: createDOMFactory('head'),
      header: createDOMFactory('header'),
      hgroup: createDOMFactory('hgroup'),
      hr: createDOMFactory('hr'),
      html: createDOMFactory('html'),
      i: createDOMFactory('i'),
      iframe: createDOMFactory('iframe'),
      img: createDOMFactory('img'),
      input: createDOMFactory('input'),
      ins: createDOMFactory('ins'),
      kbd: createDOMFactory('kbd'),
      keygen: createDOMFactory('keygen'),
      label: createDOMFactory('label'),
      legend: createDOMFactory('legend'),
      li: createDOMFactory('li'),
      link: createDOMFactory('link'),
      main: createDOMFactory('main'),
      map: createDOMFactory('map'),
      mark: createDOMFactory('mark'),
      menu: createDOMFactory('menu'),
      menuitem: createDOMFactory('menuitem'),
      meta: createDOMFactory('meta'),
      meter: createDOMFactory('meter'),
      nav: createDOMFactory('nav'),
      noscript: createDOMFactory('noscript'),
      object: createDOMFactory('object'),
      ol: createDOMFactory('ol'),
      optgroup: createDOMFactory('optgroup'),
      option: createDOMFactory('option'),
      output: createDOMFactory('output'),
      p: createDOMFactory('p'),
      param: createDOMFactory('param'),
      picture: createDOMFactory('picture'),
      pre: createDOMFactory('pre'),
      progress: createDOMFactory('progress'),
      q: createDOMFactory('q'),
      rp: createDOMFactory('rp'),
      rt: createDOMFactory('rt'),
      ruby: createDOMFactory('ruby'),
      s: createDOMFactory('s'),
      samp: createDOMFactory('samp'),
      script: createDOMFactory('script'),
      section: createDOMFactory('section'),
      select: createDOMFactory('select'),
      small: createDOMFactory('small'),
      source: createDOMFactory('source'),
      span: createDOMFactory('span'),
      strong: createDOMFactory('strong'),
      style: createDOMFactory('style'),
      sub: createDOMFactory('sub'),
      summary: createDOMFactory('summary'),
      sup: createDOMFactory('sup'),
      table: createDOMFactory('table'),
      tbody: createDOMFactory('tbody'),
      td: createDOMFactory('td'),
      textarea: createDOMFactory('textarea'),
      tfoot: createDOMFactory('tfoot'),
      th: createDOMFactory('th'),
      thead: createDOMFactory('thead'),
      time: createDOMFactory('time'),
      title: createDOMFactory('title'),
      tr: createDOMFactory('tr'),
      track: createDOMFactory('track'),
      u: createDOMFactory('u'),
      ul: createDOMFactory('ul'),
      'var': createDOMFactory('var'),
      video: createDOMFactory('video'),
      wbr: createDOMFactory('wbr'),

      // SVG
      circle: createDOMFactory('circle'),
      clipPath: createDOMFactory('clipPath'),
      defs: createDOMFactory('defs'),
      ellipse: createDOMFactory('ellipse'),
      g: createDOMFactory('g'),
      image: createDOMFactory('image'),
      line: createDOMFactory('line'),
      linearGradient: createDOMFactory('linearGradient'),
      mask: createDOMFactory('mask'),
      path: createDOMFactory('path'),
      pattern: createDOMFactory('pattern'),
      polygon: createDOMFactory('polygon'),
      polyline: createDOMFactory('polyline'),
      radialGradient: createDOMFactory('radialGradient'),
      rect: createDOMFactory('rect'),
      stop: createDOMFactory('stop'),
      svg: createDOMFactory('svg'),
      text: createDOMFactory('text'),
      tspan: createDOMFactory('tspan')
    };

    var ReactDOMFactories_1 = ReactDOMFactories$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var ReactElement$7 = require('./ReactElement');
    var ReactPropTypeLocationNames$1 = require('./ReactPropTypeLocationNames');
    var ReactPropTypesSecret = require('./ReactPropTypesSecret');

    var emptyFunction$3 = require('fbjs/lib/emptyFunction');
    var getIteratorFn$2 = require('./getIteratorFn');
    var warning$8 = require('fbjs/lib/warning');

    /**
     * Collection of methods that allow declaration and validation of props that are
     * supplied to React components. Example usage:
     *
     *   var Props = require('ReactPropTypes');
     *   var MyArticle = React.createClass({
     *     propTypes: {
     *       // An optional string prop named "description".
     *       description: Props.string,
     *
     *       // A required enum prop named "category".
     *       category: Props.oneOf(['News','Photos']).isRequired,
     *
     *       // A prop named "dialog" that requires an instance of Dialog.
     *       dialog: Props.instanceOf(Dialog).isRequired
     *     },
     *     render: function() { ... }
     *   });
     *
     * A more formal specification of how these methods are used:
     *
     *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
     *   decl := ReactPropTypes.{type}(.isRequired)?
     *
     * Each and every declaration produces a function with the same signature. This
     * allows the creation of custom validation functions. For example:
     *
     *  var MyLink = React.createClass({
     *    propTypes: {
     *      // An optional string or URI prop named "href".
     *      href: function(props, propName, componentName) {
     *        var propValue = props[propName];
     *        if (propValue != null && typeof propValue !== 'string' &&
     *            !(propValue instanceof URI)) {
     *          return new Error(
     *            'Expected a string or an URI for ' + propName + ' in ' +
     *            componentName
     *          );
     *        }
     *      }
     *    },
     *    render: function() {...}
     *  });
     *
     * @internal
     */

    var ANONYMOUS = '<<anonymous>>';

    var ReactPropTypes$1 = {
      array: createPrimitiveTypeChecker('array'),
      bool: createPrimitiveTypeChecker('boolean'),
      func: createPrimitiveTypeChecker('function'),
      number: createPrimitiveTypeChecker('number'),
      object: createPrimitiveTypeChecker('object'),
      string: createPrimitiveTypeChecker('string'),
      symbol: createPrimitiveTypeChecker('symbol'),

      any: createAnyTypeChecker(),
      arrayOf: createArrayOfTypeChecker,
      element: createElementTypeChecker(),
      instanceOf: createInstanceTypeChecker,
      node: createNodeChecker(),
      objectOf: createObjectOfTypeChecker,
      oneOf: createEnumTypeChecker,
      oneOfType: createUnionTypeChecker,
      shape: createShapeTypeChecker
    };

    /**
     * inlined Object.is polyfill to avoid requiring consumers ship their own
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
    /*eslint-disable no-self-compare*/
    function is(x, y) {
      // SameValue algorithm
      if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
      } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
      }
    }
    /*eslint-enable no-self-compare*/

    /**
     * We use an Error-like object for backward compatibility as people may call
     * PropTypes directly and inspect their output. However we don't use real
     * Errors anymore. We don't inspect their stack anyway, and creating them
     * is prohibitively expensive if they are created too often, such as what
     * happens in oneOfType() for any type before the one that matched.
     */
    function PropTypeError(message) {
      this.message = message;
      this.stack = '';
    }
    // Make `instanceof Error` still work for returned errors.
    PropTypeError.prototype = Error.prototype;

    function createChainableTypeChecker(validate) {
      if (process.env.NODE_ENV !== 'production') {
        var manualPropTypeCallCache = {};
      }
      function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
        componentName = componentName || ANONYMOUS;
        propFullName = propFullName || propName;
        if (process.env.NODE_ENV !== 'production') {
          if (secret !== ReactPropTypesSecret && typeof console !== 'undefined') {
            var cacheKey = componentName + ':' + propName;
            if (!manualPropTypeCallCache[cacheKey]) {
              process.env.NODE_ENV !== 'production' ? warning$8(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will not work in production with the next major version. ' + 'You may be seeing this warning due to a third-party PropTypes ' + 'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.', propFullName, componentName) : void 0;
              manualPropTypeCallCache[cacheKey] = true;
            }
          }
        }
        if (props[propName] == null) {
          var locationName = ReactPropTypeLocationNames$1[location];
          if (isRequired) {
            if (props[propName] === null) {
              return new PropTypeError('The ' + locationName + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
            }
            return new PropTypeError('The ' + locationName + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
          }
          return null;
        } else {
          return validate(props, propName, componentName, location, propFullName);
        }
      }

      var chainedCheckType = checkType.bind(null, false);
      chainedCheckType.isRequired = checkType.bind(null, true);

      return chainedCheckType;
    }

    function createPrimitiveTypeChecker(expectedType) {
      function validate(props, propName, componentName, location, propFullName, secret) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== expectedType) {
          var locationName = ReactPropTypeLocationNames$1[location];
          // `propValue` being instance of, say, date/regexp, pass the 'object'
          // check, but we can offer a more precise error message here rather than
          // 'of type `object`'.
          var preciseType = getPreciseType(propValue);

          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createAnyTypeChecker() {
      return createChainableTypeChecker(emptyFunction$3.thatReturns(null));
    }

    function createArrayOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== 'function') {
          return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
        }
        var propValue = props[propName];
        if (!Array.isArray(propValue)) {
          var locationName = ReactPropTypeLocationNames$1[location];
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
        }
        for (var i = 0; i < propValue.length; i++) {
          var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createElementTypeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        if (!ReactElement$7.isValidElement(propValue)) {
          var locationName = ReactPropTypeLocationNames$1[location];
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createInstanceTypeChecker(expectedClass) {
      function validate(props, propName, componentName, location, propFullName) {
        if (!(props[propName] instanceof expectedClass)) {
          var locationName = ReactPropTypeLocationNames$1[location];
          var expectedClassName = expectedClass.name || ANONYMOUS;
          var actualClassName = getClassName(props[propName]);
          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createEnumTypeChecker(expectedValues) {
      if (!Array.isArray(expectedValues)) {
        process.env.NODE_ENV !== 'production' ? warning$8(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
        return emptyFunction$3.thatReturnsNull;
      }

      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        for (var i = 0; i < expectedValues.length; i++) {
          if (is(propValue, expectedValues[i])) {
            return null;
          }
        }

        var locationName = ReactPropTypeLocationNames$1[location];
        var valuesString = JSON.stringify(expectedValues);
        return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
      }
      return createChainableTypeChecker(validate);
    }

    function createObjectOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== 'function') {
          return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
        }
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          var locationName = ReactPropTypeLocationNames$1[location];
          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
        }
        for (var key in propValue) {
          if (propValue.hasOwnProperty(key)) {
            var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
            if (error instanceof Error) {
              return error;
            }
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createUnionTypeChecker(arrayOfTypeCheckers) {
      if (!Array.isArray(arrayOfTypeCheckers)) {
        process.env.NODE_ENV !== 'production' ? warning$8(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
        return emptyFunction$3.thatReturnsNull;
      }

      function validate(props, propName, componentName, location, propFullName) {
        for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
          var checker = arrayOfTypeCheckers[i];
          if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
            return null;
          }
        }

        var locationName = ReactPropTypeLocationNames$1[location];
        return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
      }
      return createChainableTypeChecker(validate);
    }

    function createNodeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        if (!isNode(props[propName])) {
          var locationName = ReactPropTypeLocationNames$1[location];
          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          var locationName = ReactPropTypeLocationNames$1[location];
          return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
        }
        for (var key in shapeTypes) {
          var checker = shapeTypes[key];
          if (!checker) {
            continue;
          }
          var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function isNode(propValue) {
      switch (typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue)) {
        case 'number':
        case 'string':
        case 'undefined':
          return true;
        case 'boolean':
          return !propValue;
        case 'object':
          if (Array.isArray(propValue)) {
            return propValue.every(isNode);
          }
          if (propValue === null || ReactElement$7.isValidElement(propValue)) {
            return true;
          }

          var iteratorFn = getIteratorFn$2(propValue);
          if (iteratorFn) {
            var iterator = iteratorFn.call(propValue);
            var step;
            if (iteratorFn !== propValue.entries) {
              while (!(step = iterator.next()).done) {
                if (!isNode(step.value)) {
                  return false;
                }
              }
            } else {
              // Iterator will provide entry [k,v] tuples rather than values.
              while (!(step = iterator.next()).done) {
                var entry = step.value;
                if (entry) {
                  if (!isNode(entry[1])) {
                    return false;
                  }
                }
              }
            }
          } else {
            return false;
          }

          return true;
        default:
          return false;
      }
    }

    function isSymbol(propType, propValue) {
      // Native Symbol.
      if (propType === 'symbol') {
        return true;
      }

      // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
      if (propValue['@@toStringTag'] === 'Symbol') {
        return true;
      }

      // Fallback for non-spec compliant Symbols which are polyfilled.
      if (typeof Symbol === 'function' && propValue instanceof Symbol) {
        return true;
      }

      return false;
    }

    // Equivalent of `typeof` but with special handling for array and regexp.
    function getPropType(propValue) {
      var propType = typeof propValue === 'undefined' ? 'undefined' : _typeof(propValue);
      if (Array.isArray(propValue)) {
        return 'array';
      }
      if (propValue instanceof RegExp) {
        // Old webkits (at least until Android 4.0) return 'function' rather than
        // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
        // passes PropTypes.object.
        return 'object';
      }
      if (isSymbol(propType, propValue)) {
        return 'symbol';
      }
      return propType;
    }

    // This handles more types than `getPropType`. Only used for error messages.
    // See `createPrimitiveTypeChecker`.
    function getPreciseType(propValue) {
      var propType = getPropType(propValue);
      if (propType === 'object') {
        if (propValue instanceof Date) {
          return 'date';
        } else if (propValue instanceof RegExp) {
          return 'regexp';
        }
      }
      return propType;
    }

    // Returns class name of the object, if any.
    function getClassName(propValue) {
      if (!propValue.constructor || !propValue.constructor.name) {
        return ANONYMOUS;
      }
      return propValue.constructor.name;
    }

    module.exports = ReactPropTypes$1;



    var ReactPropTypes$2 = Object.freeze({

    });

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var ReactVersion$1 = '15.4.2';

    var _prodInvariant$4 = reactProdInvariant_1;

    var ReactElement$8 = require$$1;

    var invariant$5 = invariant_1;

    /**
     * Returns the first child in a collection of children and verifies that there
     * is only one child in the collection.
     *
     * See https://facebook.github.io/react/docs/top-level-api.html#react.children.only
     *
     * The current implementation of this function assumes that a single child gets
     * passed without a wrapper, but the purpose of this helper function is to
     * abstract away the particular structure of children.
     *
     * @param {?object} children Child collection structure.
     * @return {ReactElement} The first and only `ReactElement` contained in the
     * structure.
     */
    function onlyChild$1(children) {
      !ReactElement$8.isValidElement(children) ? process.env.NODE_ENV !== 'production' ? invariant$5(false, 'React.Children.only expected to receive a single React element child.') : _prodInvariant$4('143') : void 0;
      return children;
    }

    var onlyChild_1 = onlyChild$1;

    var require$$7 = ( ReactClass$2 && ReactClass$2['default'] ) || ReactClass$2;

    var require$$4 = ( ReactPropTypes$2 && ReactPropTypes$2['default'] ) || ReactPropTypes$2;

    var _assign = index;

    var ReactChildren = ReactChildren_1;
    var ReactComponent = require$$2$2;
    var ReactPureComponent = ReactPureComponent_1;
    var ReactClass = require$$7;
    var ReactDOMFactories = ReactDOMFactories_1;
    var ReactElement = require$$1;
    var ReactPropTypes = require$$4;
    var ReactVersion = ReactVersion$1;

    var onlyChild = onlyChild_1;
    var warning = warning_1;

    var createElement$1 = ReactElement.createElement;
    var createFactory$1 = ReactElement.createFactory;
    var cloneElement$1 = ReactElement.cloneElement;

    if (process.env.NODE_ENV !== 'production') {
      var ReactElementValidator = require$$0$4;
      createElement$1 = ReactElementValidator.createElement;
      createFactory$1 = ReactElementValidator.createFactory;
      cloneElement$1 = ReactElementValidator.cloneElement;
    }

    var __spread = _assign;

    if (process.env.NODE_ENV !== 'production') {
      var warned = false;
      __spread = function __spread() {
        process.env.NODE_ENV !== 'production' ? warning(warned, 'React.__spread is deprecated and should not be used. Use ' + 'Object.assign directly or another helper function with similar ' + 'semantics. You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.') : void 0;
        warned = true;
        return _assign.apply(null, arguments);
      };
    }

    var React$2 = {

      // Modern

      Children: {
        map: ReactChildren.map,
        forEach: ReactChildren.forEach,
        count: ReactChildren.count,
        toArray: ReactChildren.toArray,
        only: onlyChild
      },

      Component: ReactComponent,
      PureComponent: ReactPureComponent,

      createElement: createElement$1,
      cloneElement: cloneElement$1,
      isValidElement: ReactElement.isValidElement,

      // Classic

      PropTypes: ReactPropTypes,
      createClass: ReactClass.createClass,
      createFactory: createFactory$1,
      createMixin: function createMixin(mixin) {
        // Currently a noop. Will be used to validate and trace mixins.
        return mixin;
      },

      // This looks DOM specific but these are actually isomorphic helpers
      // since they are just generating DOM strings.
      DOM: ReactDOMFactories,

      version: ReactVersion,

      // Deprecated hook for JSX spread, don't use this for anything.
      __spread: __spread
    };

    var React_1 = React$2;

    var react = React_1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */
    /**
     * WARNING: DO NOT manually require this module.
     * This is a replacement for `invariant(...)` used by the error code system
     * and will _only_ be required by the corresponding babel pass.
     * It always throws.
     */

    function reactProdInvariant$1(code) {
      var argCount = arguments.length - 1;

      var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

      for (var argIdx = 0; argIdx < argCount; argIdx++) {
        message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
      }

      message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

      var error = new Error(message);
      error.name = 'Invariant Violation';
      error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

      throw error;
    }

    var reactProdInvariant_1$2 = reactProdInvariant$1;

    var _prodInvariant$6 = reactProdInvariant_1$2;

    var invariant$7 = invariant_1;

    function checkMask(value, bitmask) {
      return (value & bitmask) === bitmask;
    }

    var DOMPropertyInjection = {
      /**
       * Mapping from normalized, camelcased property names to a configuration that
       * specifies how the associated DOM property should be accessed or rendered.
       */
      MUST_USE_PROPERTY: 0x1,
      HAS_BOOLEAN_VALUE: 0x4,
      HAS_NUMERIC_VALUE: 0x8,
      HAS_POSITIVE_NUMERIC_VALUE: 0x10 | 0x8,
      HAS_OVERLOADED_BOOLEAN_VALUE: 0x20,

      /**
       * Inject some specialized knowledge about the DOM. This takes a config object
       * with the following properties:
       *
       * isCustomAttribute: function that given an attribute name will return true
       * if it can be inserted into the DOM verbatim. Useful for data-* or aria-*
       * attributes where it's impossible to enumerate all of the possible
       * attribute names,
       *
       * Properties: object mapping DOM property name to one of the
       * DOMPropertyInjection constants or null. If your attribute isn't in here,
       * it won't get written to the DOM.
       *
       * DOMAttributeNames: object mapping React attribute name to the DOM
       * attribute name. Attribute names not specified use the **lowercase**
       * normalized name.
       *
       * DOMAttributeNamespaces: object mapping React attribute name to the DOM
       * attribute namespace URL. (Attribute names not specified use no namespace.)
       *
       * DOMPropertyNames: similar to DOMAttributeNames but for DOM properties.
       * Property names not specified use the normalized name.
       *
       * DOMMutationMethods: Properties that require special mutation methods. If
       * `value` is undefined, the mutation method should unset the property.
       *
       * @param {object} domPropertyConfig the config as described above.
       */
      injectDOMPropertyConfig: function injectDOMPropertyConfig(domPropertyConfig) {
        var Injection = DOMPropertyInjection;
        var Properties = domPropertyConfig.Properties || {};
        var DOMAttributeNamespaces = domPropertyConfig.DOMAttributeNamespaces || {};
        var DOMAttributeNames = domPropertyConfig.DOMAttributeNames || {};
        var DOMPropertyNames = domPropertyConfig.DOMPropertyNames || {};
        var DOMMutationMethods = domPropertyConfig.DOMMutationMethods || {};

        if (domPropertyConfig.isCustomAttribute) {
          DOMProperty$1._isCustomAttributeFunctions.push(domPropertyConfig.isCustomAttribute);
        }

        for (var propName in Properties) {
          !!DOMProperty$1.properties.hasOwnProperty(propName) ? process.env.NODE_ENV !== 'production' ? invariant$7(false, 'injectDOMPropertyConfig(...): You\'re trying to inject DOM property \'%s\' which has already been injected. You may be accidentally injecting the same DOM property config twice, or you may be injecting two configs that have conflicting property names.', propName) : _prodInvariant$6('48', propName) : void 0;

          var lowerCased = propName.toLowerCase();
          var propConfig = Properties[propName];

          var propertyInfo = {
            attributeName: lowerCased,
            attributeNamespace: null,
            propertyName: propName,
            mutationMethod: null,

            mustUseProperty: checkMask(propConfig, Injection.MUST_USE_PROPERTY),
            hasBooleanValue: checkMask(propConfig, Injection.HAS_BOOLEAN_VALUE),
            hasNumericValue: checkMask(propConfig, Injection.HAS_NUMERIC_VALUE),
            hasPositiveNumericValue: checkMask(propConfig, Injection.HAS_POSITIVE_NUMERIC_VALUE),
            hasOverloadedBooleanValue: checkMask(propConfig, Injection.HAS_OVERLOADED_BOOLEAN_VALUE)
          };
          !(propertyInfo.hasBooleanValue + propertyInfo.hasNumericValue + propertyInfo.hasOverloadedBooleanValue <= 1) ? process.env.NODE_ENV !== 'production' ? invariant$7(false, 'DOMProperty: Value can be one of boolean, overloaded boolean, or numeric value, but not a combination: %s', propName) : _prodInvariant$6('50', propName) : void 0;

          if (process.env.NODE_ENV !== 'production') {
            DOMProperty$1.getPossibleStandardName[lowerCased] = propName;
          }

          if (DOMAttributeNames.hasOwnProperty(propName)) {
            var attributeName = DOMAttributeNames[propName];
            propertyInfo.attributeName = attributeName;
            if (process.env.NODE_ENV !== 'production') {
              DOMProperty$1.getPossibleStandardName[attributeName] = propName;
            }
          }

          if (DOMAttributeNamespaces.hasOwnProperty(propName)) {
            propertyInfo.attributeNamespace = DOMAttributeNamespaces[propName];
          }

          if (DOMPropertyNames.hasOwnProperty(propName)) {
            propertyInfo.propertyName = DOMPropertyNames[propName];
          }

          if (DOMMutationMethods.hasOwnProperty(propName)) {
            propertyInfo.mutationMethod = DOMMutationMethods[propName];
          }

          DOMProperty$1.properties[propName] = propertyInfo;
        }
      }
    };

    /* eslint-disable max-len */
    var ATTRIBUTE_NAME_START_CHAR = ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
    /* eslint-enable max-len */

    /**
     * DOMProperty exports lookup objects that can be used like functions:
     *
     *   > DOMProperty.isValid['id']
     *   true
     *   > DOMProperty.isValid['foobar']
     *   undefined
     *
     * Although this may be confusing, it performs better in general.
     *
     * @see http://jsperf.com/key-exists
     * @see http://jsperf.com/key-missing
     */
    var DOMProperty$1 = {

      ID_ATTRIBUTE_NAME: 'data-reactid',
      ROOT_ATTRIBUTE_NAME: 'data-reactroot',

      ATTRIBUTE_NAME_START_CHAR: ATTRIBUTE_NAME_START_CHAR,
      ATTRIBUTE_NAME_CHAR: ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040',

      /**
       * Map from property "standard name" to an object with info about how to set
       * the property in the DOM. Each object contains:
       *
       * attributeName:
       *   Used when rendering markup or with `*Attribute()`.
       * attributeNamespace
       * propertyName:
       *   Used on DOM node instances. (This includes properties that mutate due to
       *   external factors.)
       * mutationMethod:
       *   If non-null, used instead of the property or `setAttribute()` after
       *   initial render.
       * mustUseProperty:
       *   Whether the property must be accessed and mutated as an object property.
       * hasBooleanValue:
       *   Whether the property should be removed when set to a falsey value.
       * hasNumericValue:
       *   Whether the property must be numeric or parse as a numeric and should be
       *   removed when set to a falsey value.
       * hasPositiveNumericValue:
       *   Whether the property must be positive numeric or parse as a positive
       *   numeric and should be removed when set to a falsey value.
       * hasOverloadedBooleanValue:
       *   Whether the property can be used as a flag as well as with a value.
       *   Removed when strictly equal to false; present without a value when
       *   strictly equal to true; present with a value otherwise.
       */
      properties: {},

      /**
       * Mapping from lowercase property names to the properly cased version, used
       * to warn in the case of missing properties. Available only in __DEV__.
       *
       * autofocus is predefined, because adding it to the property whitelist
       * causes unintended side effects.
       *
       * @type {Object}
       */
      getPossibleStandardName: process.env.NODE_ENV !== 'production' ? { autofocus: 'autoFocus' } : null,

      /**
       * All of the isCustomAttribute() functions that have been injected.
       */
      _isCustomAttributeFunctions: [],

      /**
       * Checks whether a property name is a custom attribute.
       * @method
       */
      isCustomAttribute: function isCustomAttribute(attributeName) {
        for (var i = 0; i < DOMProperty$1._isCustomAttributeFunctions.length; i++) {
          var isCustomAttributeFn = DOMProperty$1._isCustomAttributeFunctions[i];
          if (isCustomAttributeFn(attributeName)) {
            return true;
          }
        }
        return false;
      },

      injection: DOMPropertyInjection
    };

    var DOMProperty_1 = DOMProperty$1;

    /**
     * Copyright 2015-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var ReactDOMComponentFlags$1 = {
      hasCachedChildNodes: 1 << 0
    };

    var ReactDOMComponentFlags_1 = ReactDOMComponentFlags$1;

    var _prodInvariant$5 = reactProdInvariant_1$2;

    var DOMProperty = DOMProperty_1;
    var ReactDOMComponentFlags = ReactDOMComponentFlags_1;

    var invariant$6 = invariant_1;

    var ATTR_NAME = DOMProperty.ID_ATTRIBUTE_NAME;
    var Flags = ReactDOMComponentFlags;

    var internalInstanceKey = '__reactInternalInstance$' + Math.random().toString(36).slice(2);

    /**
     * Check if a given node should be cached.
     */
    function shouldPrecacheNode(node, nodeID) {
      return node.nodeType === 1 && node.getAttribute(ATTR_NAME) === String(nodeID) || node.nodeType === 8 && node.nodeValue === ' react-text: ' + nodeID + ' ' || node.nodeType === 8 && node.nodeValue === ' react-empty: ' + nodeID + ' ';
    }

    /**
     * Drill down (through composites and empty components) until we get a host or
     * host text component.
     *
     * This is pretty polymorphic but unavoidable with the current structure we have
     * for `_renderedChildren`.
     */
    function getRenderedHostOrTextFromComponent(component) {
      var rendered;
      while (rendered = component._renderedComponent) {
        component = rendered;
      }
      return component;
    }

    /**
     * Populate `_hostNode` on the rendered host/text component with the given
     * DOM node. The passed `inst` can be a composite.
     */
    function precacheNode(inst, node) {
      var hostInst = getRenderedHostOrTextFromComponent(inst);
      hostInst._hostNode = node;
      node[internalInstanceKey] = hostInst;
    }

    function uncacheNode(inst) {
      var node = inst._hostNode;
      if (node) {
        delete node[internalInstanceKey];
        inst._hostNode = null;
      }
    }

    /**
     * Populate `_hostNode` on each child of `inst`, assuming that the children
     * match up with the DOM (element) children of `node`.
     *
     * We cache entire levels at once to avoid an n^2 problem where we access the
     * children of a node sequentially and have to walk from the start to our target
     * node every time.
     *
     * Since we update `_renderedChildren` and the actual DOM at (slightly)
     * different times, we could race here and see a newer `_renderedChildren` than
     * the DOM nodes we see. To avoid this, ReactMultiChild calls
     * `prepareToManageChildren` before we change `_renderedChildren`, at which
     * time the container's child nodes are always cached (until it unmounts).
     */
    function precacheChildNodes(inst, node) {
      if (inst._flags & Flags.hasCachedChildNodes) {
        return;
      }
      var children = inst._renderedChildren;
      var childNode = node.firstChild;
      outer: for (var name in children) {
        if (!children.hasOwnProperty(name)) {
          continue;
        }
        var childInst = children[name];
        var childID = getRenderedHostOrTextFromComponent(childInst)._domID;
        if (childID === 0) {
          // We're currently unmounting this child in ReactMultiChild; skip it.
          continue;
        }
        // We assume the child nodes are in the same order as the child instances.
        for (; childNode !== null; childNode = childNode.nextSibling) {
          if (shouldPrecacheNode(childNode, childID)) {
            precacheNode(childInst, childNode);
            continue outer;
          }
        }
        // We reached the end of the DOM children without finding an ID match.
        process.env.NODE_ENV !== 'production' ? invariant$6(false, 'Unable to find element with ID %s.', childID) : _prodInvariant$5('32', childID);
      }
      inst._flags |= Flags.hasCachedChildNodes;
    }

    /**
     * Given a DOM node, return the closest ReactDOMComponent or
     * ReactDOMTextComponent instance ancestor.
     */
    function getClosestInstanceFromNode(node) {
      if (node[internalInstanceKey]) {
        return node[internalInstanceKey];
      }

      // Walk up the tree until we find an ancestor whose instance we have cached.
      var parents = [];
      while (!node[internalInstanceKey]) {
        parents.push(node);
        if (node.parentNode) {
          node = node.parentNode;
        } else {
          // Top of the tree. This node must not be part of a React tree (or is
          // unmounted, potentially).
          return null;
        }
      }

      var closest;
      var inst;
      for (; node && (inst = node[internalInstanceKey]); node = parents.pop()) {
        closest = inst;
        if (parents.length) {
          precacheChildNodes(inst, node);
        }
      }

      return closest;
    }

    /**
     * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
     * instance, or null if the node was not rendered by this React.
     */
    function getInstanceFromNode$1(node) {
      var inst = getClosestInstanceFromNode(node);
      if (inst != null && inst._hostNode === node) {
        return inst;
      } else {
        return null;
      }
    }

    /**
     * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
     * DOM node.
     */
    function getNodeFromInstance$1(inst) {
      // Without this first invariant, passing a non-DOM-component triggers the next
      // invariant for a missing parent, which is super confusing.
      !(inst._hostNode !== undefined) ? process.env.NODE_ENV !== 'production' ? invariant$6(false, 'getNodeFromInstance: Invalid argument.') : _prodInvariant$5('33') : void 0;

      if (inst._hostNode) {
        return inst._hostNode;
      }

      // Walk up the tree until we find an ancestor whose DOM node we have cached.
      var parents = [];
      while (!inst._hostNode) {
        parents.push(inst);
        !inst._hostParent ? process.env.NODE_ENV !== 'production' ? invariant$6(false, 'React DOM tree root should always have a node reference.') : _prodInvariant$5('34') : void 0;
        inst = inst._hostParent;
      }

      // Now parents contains each ancestor that does *not* have a cached native
      // node, and `inst` is the deepest ancestor that does.
      for (; parents.length; inst = parents.pop()) {
        precacheChildNodes(inst, inst._hostNode);
      }

      return inst._hostNode;
    }

    var ReactDOMComponentTree$1 = {
      getClosestInstanceFromNode: getClosestInstanceFromNode,
      getInstanceFromNode: getInstanceFromNode$1,
      getNodeFromInstance: getNodeFromInstance$1,
      precacheChildNodes: precacheChildNodes,
      precacheNode: precacheNode,
      uncacheNode: uncacheNode
    };

    var ReactDOMComponentTree_1 = ReactDOMComponentTree$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var ARIADOMPropertyConfig$1 = {
      Properties: {
        // Global States and Properties
        'aria-current': 0, // state
        'aria-details': 0,
        'aria-disabled': 0, // state
        'aria-hidden': 0, // state
        'aria-invalid': 0, // state
        'aria-keyshortcuts': 0,
        'aria-label': 0,
        'aria-roledescription': 0,
        // Widget Attributes
        'aria-autocomplete': 0,
        'aria-checked': 0,
        'aria-expanded': 0,
        'aria-haspopup': 0,
        'aria-level': 0,
        'aria-modal': 0,
        'aria-multiline': 0,
        'aria-multiselectable': 0,
        'aria-orientation': 0,
        'aria-placeholder': 0,
        'aria-pressed': 0,
        'aria-readonly': 0,
        'aria-required': 0,
        'aria-selected': 0,
        'aria-sort': 0,
        'aria-valuemax': 0,
        'aria-valuemin': 0,
        'aria-valuenow': 0,
        'aria-valuetext': 0,
        // Live Region Attributes
        'aria-atomic': 0,
        'aria-busy': 0,
        'aria-live': 0,
        'aria-relevant': 0,
        // Drag-and-Drop Attributes
        'aria-dropeffect': 0,
        'aria-grabbed': 0,
        // Relationship Attributes
        'aria-activedescendant': 0,
        'aria-colcount': 0,
        'aria-colindex': 0,
        'aria-colspan': 0,
        'aria-controls': 0,
        'aria-describedby': 0,
        'aria-errormessage': 0,
        'aria-flowto': 0,
        'aria-labelledby': 0,
        'aria-owns': 0,
        'aria-posinset': 0,
        'aria-rowcount': 0,
        'aria-rowindex': 0,
        'aria-rowspan': 0,
        'aria-setsize': 0
      },
      DOMAttributeNames: {},
      DOMPropertyNames: {}
    };

    var ARIADOMPropertyConfig_1 = ARIADOMPropertyConfig$1;

    /**
     * Copyright 2013-present Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var EventPropagators = require('./EventPropagators');
    var ExecutionEnvironment$1 = require('fbjs/lib/ExecutionEnvironment');
    var FallbackCompositionState = require('./FallbackCompositionState');
    var SyntheticCompositionEvent = require('./SyntheticCompositionEvent');
    var SyntheticInputEvent = require('./SyntheticInputEvent');

    var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space
    var START_KEYCODE = 229;

    var canUseCompositionEvent = ExecutionEnvironment$1.canUseDOM && 'CompositionEvent' in window;

    var documentMode = null;
    if (ExecutionEnvironment$1.canUseDOM && 'documentMode' in document) {
      documentMode = document.documentMode;
    }

    // Webkit offers a very useful `textInput` event that can be used to
    // directly represent `beforeInput`. The IE `textinput` event is not as
    // useful, so we don't use it.
    var canUseTextInputEvent = ExecutionEnvironment$1.canUseDOM && 'TextEvent' in window && !documentMode && !isPresto();

    // In IE9+, we have access to composition events, but the data supplied
    // by the native compositionend event may be incorrect. Japanese ideographic
    // spaces, for instance (\u3000) are not recorded correctly.
    var useFallbackCompositionData = ExecutionEnvironment$1.canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);

    /**
     * Opera <= 12 includes TextEvent in window, but does not fire
     * text input events. Rely on keypress instead.
     */
    function isPresto() {
      var opera = window.opera;
      return (typeof opera === 'undefined' ? 'undefined' : _typeof(opera)) === 'object' && typeof opera.version === 'function' && parseInt(opera.version(), 10) <= 12;
    }

    var SPACEBAR_CODE = 32;
    var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

    // Events and their corresponding property names.
    var eventTypes = {
      beforeInput: {
        phasedRegistrationNames: {
          bubbled: 'onBeforeInput',
          captured: 'onBeforeInputCapture'
        },
        dependencies: ['topCompositionEnd', 'topKeyPress', 'topTextInput', 'topPaste']
      },
      compositionEnd: {
        phasedRegistrationNames: {
          bubbled: 'onCompositionEnd',
          captured: 'onCompositionEndCapture'
        },
        dependencies: ['topBlur', 'topCompositionEnd', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
      },
      compositionStart: {
        phasedRegistrationNames: {
          bubbled: 'onCompositionStart',
          captured: 'onCompositionStartCapture'
        },
        dependencies: ['topBlur', 'topCompositionStart', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
      },
      compositionUpdate: {
        phasedRegistrationNames: {
          bubbled: 'onCompositionUpdate',
          captured: 'onCompositionUpdateCapture'
        },
        dependencies: ['topBlur', 'topCompositionUpdate', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
      }
    };

    // Track whether we've ever handled a keypress on the space key.
    var hasSpaceKeypress = false;

    /**
     * Return whether a native keypress event is assumed to be a command.
     * This is required because Firefox fires `keypress` events for key commands
     * (cut, copy, select-all, etc.) even though no character is inserted.
     */
    function isKeypressCommand(nativeEvent) {
      return (nativeEvent.ctrlKey || nativeEvent.altKey || nativeEvent.metaKey) &&
      // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(nativeEvent.ctrlKey && nativeEvent.altKey);
    }

    /**
     * Translate native top level events into event types.
     *
     * @param {string} topLevelType
     * @return {object}
     */
    function getCompositionEventType(topLevelType) {
      switch (topLevelType) {
        case 'topCompositionStart':
          return eventTypes.compositionStart;
        case 'topCompositionEnd':
          return eventTypes.compositionEnd;
        case 'topCompositionUpdate':
          return eventTypes.compositionUpdate;
      }
    }

    /**
     * Does our fallback best-guess model think this event signifies that
     * composition has begun?
     *
     * @param {string} topLevelType
     * @param {object} nativeEvent
     * @return {boolean}
     */
    function isFallbackCompositionStart(topLevelType, nativeEvent) {
      return topLevelType === 'topKeyDown' && nativeEvent.keyCode === START_KEYCODE;
    }

    /**
     * Does our fallback mode think that this event is the end of composition?
     *
     * @param {string} topLevelType
     * @param {object} nativeEvent
     * @return {boolean}
     */
    function isFallbackCompositionEnd(topLevelType, nativeEvent) {
      switch (topLevelType) {
        case 'topKeyUp':
          // Command keys insert or clear IME input.
          return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;
        case 'topKeyDown':
          // Expect IME keyCode on each keydown. If we get any other
          // code we must have exited earlier.
          return nativeEvent.keyCode !== START_KEYCODE;
        case 'topKeyPress':
        case 'topMouseDown':
        case 'topBlur':
          // Events are not possible without cancelling IME.
          return true;
        default:
          return false;
      }
    }

    /**
     * Google Input Tools provides composition data via a CustomEvent,
     * with the `data` property populated in the `detail` object. If this
     * is available on the event object, use it. If not, this is a plain
     * composition event and we have nothing special to extract.
     *
     * @param {object} nativeEvent
     * @return {?string}
     */
    function getDataFromCustomEvent(nativeEvent) {
      var detail = nativeEvent.detail;
      if ((typeof detail === 'undefined' ? 'undefined' : _typeof(detail)) === 'object' && 'data' in detail) {
        return detail.data;
      }
      return null;
    }

    // Track the current IME composition fallback object, if any.
    var currentComposition = null;

    /**
     * @return {?object} A SyntheticCompositionEvent.
     */
    function extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
      var eventType;
      var fallbackData;

      if (canUseCompositionEvent) {
        eventType = getCompositionEventType(topLevelType);
      } else if (!currentComposition) {
        if (isFallbackCompositionStart(topLevelType, nativeEvent)) {
          eventType = eventTypes.compositionStart;
        }
      } else if (isFallbackCompositionEnd(topLevelType, nativeEvent)) {
        eventType = eventTypes.compositionEnd;
      }

      if (!eventType) {
        return null;
      }

      if (useFallbackCompositionData) {
        // The current composition is stored statically and must not be
        // overwritten while composition continues.
        if (!currentComposition && eventType === eventTypes.compositionStart) {
          currentComposition = FallbackCompositionState.getPooled(nativeEventTarget);
        } else if (eventType === eventTypes.compositionEnd) {
          if (currentComposition) {
            fallbackData = currentComposition.getData();
          }
        }
      }

      var event = SyntheticCompositionEvent.getPooled(eventType, targetInst, nativeEvent, nativeEventTarget);

      if (fallbackData) {
        // Inject data generated from fallback path into the synthetic event.
        // This matches the property of native CompositionEventInterface.
        event.data = fallbackData;
      } else {
        var customData = getDataFromCustomEvent(nativeEvent);
        if (customData !== null) {
          event.data = customData;
        }
      }

      EventPropagators.accumulateTwoPhaseDispatches(event);
      return event;
    }

    /**
     * @param {string} topLevelType Record from `EventConstants`.
     * @param {object} nativeEvent Native browser event.
     * @return {?string} The string corresponding to this `beforeInput` event.
     */
    function getNativeBeforeInputChars(topLevelType, nativeEvent) {
      switch (topLevelType) {
        case 'topCompositionEnd':
          return getDataFromCustomEvent(nativeEvent);
        case 'topKeyPress':
          /**
           * If native `textInput` events are available, our goal is to make
           * use of them. However, there is a special case: the spacebar key.
           * In Webkit, preventing default on a spacebar `textInput` event
           * cancels character insertion, but it *also* causes the browser
           * to fall back to its default spacebar behavior of scrolling the
           * page.
           *
           * Tracking at:
           * https://code.google.com/p/chromium/issues/detail?id=355103
           *
           * To avoid this issue, use the keypress event as if no `textInput`
           * event is available.
           */
          var which = nativeEvent.which;
          if (which !== SPACEBAR_CODE) {
            return null;
          }

          hasSpaceKeypress = true;
          return SPACEBAR_CHAR;

        case 'topTextInput':
          // Record the characters to be added to the DOM.
          var chars = nativeEvent.data;

          // If it's a spacebar character, assume that we have already handled
          // it at the keypress level and bail immediately. Android Chrome
          // doesn't give us keycodes, so we need to blacklist it.
          if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
            return null;
          }

          return chars;

        default:
          // For other native event types, do nothing.
          return null;
      }
    }

    /**
     * For browsers that do not provide the `textInput` event, extract the
     * appropriate string to use for SyntheticInputEvent.
     *
     * @param {string} topLevelType Record from `EventConstants`.
     * @param {object} nativeEvent Native browser event.
     * @return {?string} The fallback string for this `beforeInput` event.
     */
    function getFallbackBeforeInputChars(topLevelType, nativeEvent) {
      // If we are currently composing (IME) and using a fallback to do so,
      // try to extract the composed characters from the fallback object.
      // If composition event is available, we extract a string only at
      // compositionevent, otherwise extract it at fallback events.
      if (currentComposition) {
        if (topLevelType === 'topCompositionEnd' || !canUseCompositionEvent && isFallbackCompositionEnd(topLevelType, nativeEvent)) {
          var chars = currentComposition.getData();
          FallbackCompositionState.release(currentComposition);
          currentComposition = null;
          return chars;
        }
        return null;
      }

      switch (topLevelType) {
        case 'topPaste':
          // If a paste event occurs after a keypress, throw out the input
          // chars. Paste events should not lead to BeforeInput events.
          return null;
        case 'topKeyPress':
          /**
           * As of v27, Firefox may fire keypress events even when no character
           * will be inserted. A few possibilities:
           *
           * - `which` is `0`. Arrow keys, Esc key, etc.
           *
           * - `which` is the pressed key code, but no char is available.
           *   Ex: 'AltGr + d` in Polish. There is no modified character for
           *   this key combination and no character is inserted into the
           *   document, but FF fires the keypress for char code `100` anyway.
           *   No `input` event will occur.
           *
           * - `which` is the pressed key code, but a command combination is
           *   being used. Ex: `Cmd+C`. No character is inserted, and no
           *   `input` event will occur.
           */
          if (nativeEvent.which && !isKeypressCommand(nativeEvent)) {
            return String.fromCharCode(nativeEvent.which);
          }
          return null;
        case 'topCompositionEnd':
          return useFallbackCompositionData ? null : nativeEvent.data;
        default:
          return null;
      }
    }

    /**
     * Extract a SyntheticInputEvent for `beforeInput`, based on either native
     * `textInput` or fallback behavior.
     *
     * @return {?object} A SyntheticInputEvent.
     */
    function extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
      var chars;

      if (canUseTextInputEvent) {
        chars = getNativeBeforeInputChars(topLevelType, nativeEvent);
      } else {
        chars = getFallbackBeforeInputChars(topLevelType, nativeEvent);
      }

      // If no characters are being inserted, no BeforeInput event should
      // be fired.
      if (!chars) {
        return null;
      }

      var event = SyntheticInputEvent.getPooled(eventTypes.beforeInput, targetInst, nativeEvent, nativeEventTarget);

      event.data = chars;
      EventPropagators.accumulateTwoPhaseDispatches(event);
      return event;
    }

    /**
     * Create an `onBeforeInput` event to match
     * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
     *
     * This event plugin is based on the native `textInput` event
     * available in Chrome, Safari, Opera, and IE. This event fires after
     * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
     *
     * `beforeInput` is spec'd but not implemented in any browsers, and
     * the `input` event does not provide any useful information about what has
     * actually been added, contrary to the spec. Thus, `textInput` is the best
     * available event to identify the characters that have actually been inserted
     * into the target node.
     *
     * This plugin is also responsible for emitting `composition` events, thus
     * allowing us to share composition fallback code for both `beforeInput` and
     * `composition` event types.
     */
    var BeforeInputEventPlugin$1 = {

      eventTypes: eventTypes,

      extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        return [extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget), extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget)];
      }
    };

    module.exports = BeforeInputEventPlugin$1;



    var BeforeInputEventPlugin$2 = Object.freeze({

    });

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var _prodInvariant$7 = require('./reactProdInvariant');

    var EventPluginRegistry = require('./EventPluginRegistry');
    var EventPluginUtils = require('./EventPluginUtils');
    var ReactErrorUtils = require('./ReactErrorUtils');

    var accumulateInto = require('./accumulateInto');
    var forEachAccumulated = require('./forEachAccumulated');
    var invariant$8 = require('fbjs/lib/invariant');

    /**
     * Internal store for event listeners
     */
    var listenerBank = {};

    /**
     * Internal queue of events that have accumulated their dispatches and are
     * waiting to have their dispatches executed.
     */
    var eventQueue = null;

    /**
     * Dispatches an event and releases it back into the pool, unless persistent.
     *
     * @param {?object} event Synthetic event to be dispatched.
     * @param {boolean} simulated If the event is simulated (changes exn behavior)
     * @private
     */
    var executeDispatchesAndRelease = function executeDispatchesAndRelease(event, simulated) {
      if (event) {
        EventPluginUtils.executeDispatchesInOrder(event, simulated);

        if (!event.isPersistent()) {
          event.constructor.release(event);
        }
      }
    };
    var executeDispatchesAndReleaseSimulated = function executeDispatchesAndReleaseSimulated(e) {
      return executeDispatchesAndRelease(e, true);
    };
    var executeDispatchesAndReleaseTopLevel = function executeDispatchesAndReleaseTopLevel(e) {
      return executeDispatchesAndRelease(e, false);
    };

    var getDictionaryKey = function getDictionaryKey(inst) {
      // Prevents V8 performance issue:
      // https://github.com/facebook/react/pull/7232
      return '.' + inst._rootNodeID;
    };

    function isInteractive(tag) {
      return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea';
    }

    function shouldPreventMouseEvent(name, type, props) {
      switch (name) {
        case 'onClick':
        case 'onClickCapture':
        case 'onDoubleClick':
        case 'onDoubleClickCapture':
        case 'onMouseDown':
        case 'onMouseDownCapture':
        case 'onMouseMove':
        case 'onMouseMoveCapture':
        case 'onMouseUp':
        case 'onMouseUpCapture':
          return !!(props.disabled && isInteractive(type));
        default:
          return false;
      }
    }

    /**
     * This is a unified interface for event plugins to be installed and configured.
     *
     * Event plugins can implement the following properties:
     *
     *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
     *     Required. When a top-level event is fired, this method is expected to
     *     extract synthetic events that will in turn be queued and dispatched.
     *
     *   `eventTypes` {object}
     *     Optional, plugins that fire events must publish a mapping of registration
     *     names that are used to register listeners. Values of this mapping must
     *     be objects that contain `registrationName` or `phasedRegistrationNames`.
     *
     *   `executeDispatch` {function(object, function, string)}
     *     Optional, allows plugins to override how an event gets dispatched. By
     *     default, the listener is simply invoked.
     *
     * Each plugin that is injected into `EventsPluginHub` is immediately operable.
     *
     * @public
     */
    var EventPluginHub$1 = {

      /**
       * Methods for injecting dependencies.
       */
      injection: {

        /**
         * @param {array} InjectedEventPluginOrder
         * @public
         */
        injectEventPluginOrder: EventPluginRegistry.injectEventPluginOrder,

        /**
         * @param {object} injectedNamesToPlugins Map from names to plugin modules.
         */
        injectEventPluginsByName: EventPluginRegistry.injectEventPluginsByName

      },

      /**
       * Stores `listener` at `listenerBank[registrationName][key]`. Is idempotent.
       *
       * @param {object} inst The instance, which is the source of events.
       * @param {string} registrationName Name of listener (e.g. `onClick`).
       * @param {function} listener The callback to store.
       */
      putListener: function putListener(inst, registrationName, listener) {
        !(typeof listener === 'function') ? process.env.NODE_ENV !== 'production' ? invariant$8(false, 'Expected %s listener to be a function, instead got type %s', registrationName, typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) : _prodInvariant$7('94', registrationName, typeof listener === 'undefined' ? 'undefined' : _typeof(listener)) : void 0;

        var key = getDictionaryKey(inst);
        var bankForRegistrationName = listenerBank[registrationName] || (listenerBank[registrationName] = {});
        bankForRegistrationName[key] = listener;

        var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
        if (PluginModule && PluginModule.didPutListener) {
          PluginModule.didPutListener(inst, registrationName, listener);
        }
      },

      /**
       * @param {object} inst The instance, which is the source of events.
       * @param {string} registrationName Name of listener (e.g. `onClick`).
       * @return {?function} The stored callback.
       */
      getListener: function getListener(inst, registrationName) {
        // TODO: shouldPreventMouseEvent is DOM-specific and definitely should not
        // live here; needs to be moved to a better place soon
        var bankForRegistrationName = listenerBank[registrationName];
        if (shouldPreventMouseEvent(registrationName, inst._currentElement.type, inst._currentElement.props)) {
          return null;
        }
        var key = getDictionaryKey(inst);
        return bankForRegistrationName && bankForRegistrationName[key];
      },

      /**
       * Deletes a listener from the registration bank.
       *
       * @param {object} inst The instance, which is the source of events.
       * @param {string} registrationName Name of listener (e.g. `onClick`).
       */
      deleteListener: function deleteListener(inst, registrationName) {
        var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
        if (PluginModule && PluginModule.willDeleteListener) {
          PluginModule.willDeleteListener(inst, registrationName);
        }

        var bankForRegistrationName = listenerBank[registrationName];
        // TODO: This should never be null -- when is it?
        if (bankForRegistrationName) {
          var key = getDictionaryKey(inst);
          delete bankForRegistrationName[key];
        }
      },

      /**
       * Deletes all listeners for the DOM element with the supplied ID.
       *
       * @param {object} inst The instance, which is the source of events.
       */
      deleteAllListeners: function deleteAllListeners(inst) {
        var key = getDictionaryKey(inst);
        for (var registrationName in listenerBank) {
          if (!listenerBank.hasOwnProperty(registrationName)) {
            continue;
          }

          if (!listenerBank[registrationName][key]) {
            continue;
          }

          var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
          if (PluginModule && PluginModule.willDeleteListener) {
            PluginModule.willDeleteListener(inst, registrationName);
          }

          delete listenerBank[registrationName][key];
        }
      },

      /**
       * Allows registered plugins an opportunity to extract events from top-level
       * native browser events.
       *
       * @return {*} An accumulation of synthetic events.
       * @internal
       */
      extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var events;
        var plugins = EventPluginRegistry.plugins;
        for (var i = 0; i < plugins.length; i++) {
          // Not every plugin in the ordering may be loaded at runtime.
          var possiblePlugin = plugins[i];
          if (possiblePlugin) {
            var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
            if (extractedEvents) {
              events = accumulateInto(events, extractedEvents);
            }
          }
        }
        return events;
      },

      /**
       * Enqueues a synthetic event that should be dispatched when
       * `processEventQueue` is invoked.
       *
       * @param {*} events An accumulation of synthetic events.
       * @internal
       */
      enqueueEvents: function enqueueEvents(events) {
        if (events) {
          eventQueue = accumulateInto(eventQueue, events);
        }
      },

      /**
       * Dispatches all synthetic events on the event queue.
       *
       * @internal
       */
      processEventQueue: function processEventQueue(simulated) {
        // Set `eventQueue` to null before processing it so that we can tell if more
        // events get enqueued while processing.
        var processingEventQueue = eventQueue;
        eventQueue = null;
        if (simulated) {
          forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseSimulated);
        } else {
          forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);
        }
        !!eventQueue ? process.env.NODE_ENV !== 'production' ? invariant$8(false, 'processEventQueue(): Additional events were enqueued while processing an event queue. Support for this has not yet been implemented.') : _prodInvariant$7('95') : void 0;
        // This would be a good time to rethrow if any of the event handlers threw.
        ReactErrorUtils.rethrowCaughtError();
      },

      /**
       * These are needed for tests only. Do not use!
       */
      __purge: function __purge() {
        listenerBank = {};
      },

      __getListenerBank: function __getListenerBank() {
        return listenerBank;
      }

    };

    module.exports = EventPluginHub$1;



    var EventPluginHub$2 = Object.freeze({

    });

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    var caughtError = null;

    /**
     * Call a function while guarding against errors that happens within it.
     *
     * @param {String} name of the guard to use for logging or debugging
     * @param {Function} func The function to invoke
     * @param {*} a First argument
     * @param {*} b Second argument
     */
    function invokeGuardedCallback(name, func, a) {
      try {
        func(a);
      } catch (x) {
        if (caughtError === null) {
          caughtError = x;
        }
      }
    }

    var ReactErrorUtils$2 = {
      invokeGuardedCallback: invokeGuardedCallback,

      /**
       * Invoked by ReactTestUtils.Simulate so that any errors thrown by the event
       * handler are sure to be rethrown by rethrowCaughtError.
       */
      invokeGuardedCallbackWithCatch: invokeGuardedCallback,

      /**
       * During execution of guarded functions we will capture the first error which
       * we will rethrow to be handled by the top level error handler.
       */
      rethrowCaughtError: function rethrowCaughtError() {
        if (caughtError) {
          var error = caughtError;
          caughtError = null;
          throw error;
        }
      }
    };

    if (process.env.NODE_ENV !== 'production') {
      /**
       * To help development we can get better devtools integration by simulating a
       * real browser event.
       */
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof document !== 'undefined' && typeof document.createEvent === 'function') {
        var fakeNode = document.createElement('react');
        ReactErrorUtils$2.invokeGuardedCallback = function (name, func, a) {
          var boundFunc = func.bind(null, a);
          var evtType = 'react-' + name;
          fakeNode.addEventListener(evtType, boundFunc, false);
          var evt = document.createEvent('Event');
          // $FlowFixMe https://github.com/facebook/flow/issues/2336
          evt.initEvent(evtType, false, false);
          fakeNode.dispatchEvent(evt);
          fakeNode.removeEventListener(evtType, boundFunc, false);
        };
      }
    }

    var ReactErrorUtils_1 = ReactErrorUtils$2;

    var _prodInvariant$8 = reactProdInvariant_1$2;

    var ReactErrorUtils$1 = ReactErrorUtils_1;

    var invariant$9 = invariant_1;
    var warning$11 = warning_1;

    /**
     * Injected dependencies:
     */

    /**
     * - `ComponentTree`: [required] Module that can convert between React instances
     *   and actual node references.
     */
    var ComponentTree;
    var TreeTraversal;
    var injection = {
      injectComponentTree: function injectComponentTree(Injected) {
        ComponentTree = Injected;
        if (process.env.NODE_ENV !== 'production') {
          process.env.NODE_ENV !== 'production' ? warning$11(Injected && Injected.getNodeFromInstance && Injected.getInstanceFromNode, 'EventPluginUtils.injection.injectComponentTree(...): Injected ' + 'module is missing getNodeFromInstance or getInstanceFromNode.') : void 0;
        }
      },
      injectTreeTraversal: function injectTreeTraversal(Injected) {
        TreeTraversal = Injected;
        if (process.env.NODE_ENV !== 'production') {
          process.env.NODE_ENV !== 'production' ? warning$11(Injected && Injected.isAncestor && Injected.getLowestCommonAncestor, 'EventPluginUtils.injection.injectTreeTraversal(...): Injected ' + 'module is missing isAncestor or getLowestCommonAncestor.') : void 0;
        }
      }
    };

    function isEndish(topLevelType) {
      return topLevelType === 'topMouseUp' || topLevelType === 'topTouchEnd' || topLevelType === 'topTouchCancel';
    }

    function isMoveish(topLevelType) {
      return topLevelType === 'topMouseMove' || topLevelType === 'topTouchMove';
    }
    function isStartish(topLevelType) {
      return topLevelType === 'topMouseDown' || topLevelType === 'topTouchStart';
    }

    var validateEventDispatches;
    if (process.env.NODE_ENV !== 'production') {
      validateEventDispatches = function validateEventDispatches(event) {
        var dispatchListeners = event._dispatchListeners;
        var dispatchInstances = event._dispatchInstances;

        var listenersIsArr = Array.isArray(dispatchListeners);
        var listenersLen = listenersIsArr ? dispatchListeners.length : dispatchListeners ? 1 : 0;

        var instancesIsArr = Array.isArray(dispatchInstances);
        var instancesLen = instancesIsArr ? dispatchInstances.length : dispatchInstances ? 1 : 0;

        process.env.NODE_ENV !== 'production' ? warning$11(instancesIsArr === listenersIsArr && instancesLen === listenersLen, 'EventPluginUtils: Invalid `event`.') : void 0;
      };
    }

    /**
     * Dispatch the event to the listener.
     * @param {SyntheticEvent} event SyntheticEvent to handle
     * @param {boolean} simulated If the event is simulated (changes exn behavior)
     * @param {function} listener Application-level callback
     * @param {*} inst Internal component instance
     */
    function executeDispatch(event, simulated, listener, inst) {
      var type = event.type || 'unknown-event';
      event.currentTarget = EventPluginUtils$2.getNodeFromInstance(inst);
      if (simulated) {
        ReactErrorUtils$1.invokeGuardedCallbackWithCatch(type, listener, event);
      } else {
        ReactErrorUtils$1.invokeGuardedCallback(type, listener, event);
      }
      event.currentTarget = null;
    }

    /**
     * Standard/simple iteration through an event's collected dispatches.
     */
    function executeDispatchesInOrder(event, simulated) {
      var dispatchListeners = event._dispatchListeners;
      var dispatchInstances = event._dispatchInstances;
      if (process.env.NODE_ENV !== 'production') {
        validateEventDispatches(event);
      }
      if (Array.isArray(dispatchListeners)) {
        for (var i = 0; i < dispatchListeners.length; i++) {
          if (event.isPropagationStopped()) {
            break;
          }
          // Listeners and Instances are two parallel arrays that are always in sync.
          executeDispatch(event, simulated, dispatchListeners[i], dispatchInstances[i]);
        }
      } else if (dispatchListeners) {
        executeDispatch(event, simulated, dispatchListeners, dispatchInstances);
      }
      event._dispatchListeners = null;
      event._dispatchInstances = null;
    }

    /**
     * Standard/simple iteration through an event's collected dispatches, but stops
     * at the first dispatch execution returning true, and returns that id.
     *
     * @return {?string} id of the first dispatch execution who's listener returns
     * true, or null if no listener returned true.
     */
    function executeDispatchesInOrderStopAtTrueImpl(event) {
      var dispatchListeners = event._dispatchListeners;
      var dispatchInstances = event._dispatchInstances;
      if (process.env.NODE_ENV !== 'production') {
        validateEventDispatches(event);
      }
      if (Array.isArray(dispatchListeners)) {
        for (var i = 0; i < dispatchListeners.length; i++) {
          if (event.isPropagationStopped()) {
            break;
          }
          // Listeners and Instances are two parallel arrays that are always in sync.
          if (dispatchListeners[i](event, dispatchInstances[i])) {
            return dispatchInstances[i];
          }
        }
      } else if (dispatchListeners) {
        if (dispatchListeners(event, dispatchInstances)) {
          return dispatchInstances;
        }
      }
      return null;
    }

    /**
     * @see executeDispatchesInOrderStopAtTrueImpl
     */
    function executeDispatchesInOrderStopAtTrue(event) {
      var ret = executeDispatchesInOrderStopAtTrueImpl(event);
      event._dispatchInstances = null;
      event._dispatchListeners = null;
      return ret;
    }

    /**
     * Execution of a "direct" dispatch - there must be at most one dispatch
     * accumulated on the event or it is considered an error. It doesn't really make
     * sense for an event with multiple dispatches (bubbled) to keep track of the
     * return values at each dispatch execution, but it does tend to make sense when
     * dealing with "direct" dispatches.
     *
     * @return {*} The return value of executing the single dispatch.
     */
    function executeDirectDispatch(event) {
      if (process.env.NODE_ENV !== 'production') {
        validateEventDispatches(event);
      }
      var dispatchListener = event._dispatchListeners;
      var dispatchInstance = event._dispatchInstances;
      !!Array.isArray(dispatchListener) ? process.env.NODE_ENV !== 'production' ? invariant$9(false, 'executeDirectDispatch(...): Invalid `event`.') : _prodInvariant$8('103') : void 0;
      event.currentTarget = dispatchListener ? EventPluginUtils$2.getNodeFromInstance(dispatchInstance) : null;
      var res = dispatchListener ? dispatchListener(event) : null;
      event.currentTarget = null;
      event._dispatchListeners = null;
      event._dispatchInstances = null;
      return res;
    }

    /**
     * @param {SyntheticEvent} event
     * @return {boolean} True iff number of dispatches accumulated is greater than 0.
     */
    function hasDispatches(event) {
      return !!event._dispatchListeners;
    }

    /**
     * General utilities that are useful in creating custom Event Plugins.
     */
    var EventPluginUtils$2 = {
      isEndish: isEndish,
      isMoveish: isMoveish,
      isStartish: isStartish,

      executeDirectDispatch: executeDirectDispatch,
      executeDispatchesInOrder: executeDispatchesInOrder,
      executeDispatchesInOrderStopAtTrue: executeDispatchesInOrderStopAtTrue,
      hasDispatches: hasDispatches,

      getInstanceFromNode: function getInstanceFromNode(node) {
        return ComponentTree.getInstanceFromNode(node);
      },
      getNodeFromInstance: function getNodeFromInstance(node) {
        return ComponentTree.getNodeFromInstance(node);
      },
      isAncestor: function isAncestor(a, b) {
        return TreeTraversal.isAncestor(a, b);
      },
      getLowestCommonAncestor: function getLowestCommonAncestor(a, b) {
        return TreeTraversal.getLowestCommonAncestor(a, b);
      },
      getParentInstance: function getParentInstance(inst) {
        return TreeTraversal.getParentInstance(inst);
      },
      traverseTwoPhase: function traverseTwoPhase(target, fn, arg) {
        return TreeTraversal.traverseTwoPhase(target, fn, arg);
      },
      traverseEnterLeave: function traverseEnterLeave(from, to, fn, argFrom, argTo) {
        return TreeTraversal.traverseEnterLeave(from, to, fn, argFrom, argTo);
      },

      injection: injection
    };

    var EventPluginUtils_1 = EventPluginUtils$2;

    var _prodInvariant$9 = reactProdInvariant_1$2;

    var invariant$10 = invariant_1;

    /**
     * Accumulates items that must not be null or undefined into the first one. This
     * is used to conserve memory by avoiding array allocations, and thus sacrifices
     * API cleanness. Since `current` can be null before being passed in and not
     * null after this function, make sure to assign it back to `current`:
     *
     * `a = accumulateInto(a, b);`
     *
     * This API should be sparingly used. Try `accumulate` for something cleaner.
     *
     * @return {*|array<*>} An accumulation of items.
     */

    function accumulateInto$2(current, next) {
      !(next != null) ? process.env.NODE_ENV !== 'production' ? invariant$10(false, 'accumulateInto(...): Accumulated items must not be null or undefined.') : _prodInvariant$9('30') : void 0;

      if (current == null) {
        return next;
      }

      // Both are not empty. Warning: Never call x.concat(y) when you are not
      // certain that x is an Array (x could be a string with concat method).
      if (Array.isArray(current)) {
        if (Array.isArray(next)) {
          current.push.apply(current, next);
          return current;
        }
        current.push(next);
        return current;
      }

      if (Array.isArray(next)) {
        // A bit too dangerous to mutate `next`.
        return [current].concat(next);
      }

      return [current, next];
    }

    var accumulateInto_1 = accumulateInto$2;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    /**
     * @param {array} arr an "accumulation" of items which is either an Array or
     * a single item. Useful when paired with the `accumulate` module. This is a
     * simple utility that allows us to reason about a collection of items, but
     * handling the case when there is exactly one item (and we do not need to
     * allocate an array).
     */

    function forEachAccumulated$2(arr, cb, scope) {
      if (Array.isArray(arr)) {
        arr.forEach(cb, scope);
      } else if (arr) {
        cb.call(scope, arr);
      }
    }

    var forEachAccumulated_1 = forEachAccumulated$2;

    var require$$0$5 = ( EventPluginHub$2 && EventPluginHub$2['default'] ) || EventPluginHub$2;

    var EventPluginHub$3 = require$$0$5;
    var EventPluginUtils$1 = EventPluginUtils_1;

    var accumulateInto$1 = accumulateInto_1;
    var forEachAccumulated$1 = forEachAccumulated_1;
    var warning$10 = warning_1;

    var getListener$1 = EventPluginHub$3.getListener;

    /**
     * Some event types have a notion of different registration names for different
     * "phases" of propagation. This finds listeners by a given phase.
     */
    function listenerAtPhase(inst, event, propagationPhase) {
      var registrationName = event.dispatchConfig.phasedRegistrationNames[propagationPhase];
      return getListener$1(inst, registrationName);
    }

    /**
     * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
     * here, allows us to not have to bind or create functions for each event.
     * Mutating the event's members allows us to not have to create a wrapping
     * "dispatch" object that pairs the event with the listener.
     */
    function accumulateDirectionalDispatches(inst, phase, event) {
      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning$10(inst, 'Dispatching inst must not be null') : void 0;
      }
      var listener = listenerAtPhase(inst, event, phase);
      if (listener) {
        event._dispatchListeners = accumulateInto$1(event._dispatchListeners, listener);
        event._dispatchInstances = accumulateInto$1(event._dispatchInstances, inst);
      }
    }

    /**
     * Collect dispatches (must be entirely collected before dispatching - see unit
     * tests). Lazily allocate the array to conserve memory.  We must loop through
     * each event and perform the traversal for each one. We cannot perform a
     * single traversal for the entire collection of events because each event may
     * have a different target.
     */
    function accumulateTwoPhaseDispatchesSingle(event) {
      if (event && event.dispatchConfig.phasedRegistrationNames) {
        EventPluginUtils$1.traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
      }
    }

    /**
     * Same as `accumulateTwoPhaseDispatchesSingle`, but skips over the targetID.
     */
    function accumulateTwoPhaseDispatchesSingleSkipTarget(event) {
      if (event && event.dispatchConfig.phasedRegistrationNames) {
        var targetInst = event._targetInst;
        var parentInst = targetInst ? EventPluginUtils$1.getParentInstance(targetInst) : null;
        EventPluginUtils$1.traverseTwoPhase(parentInst, accumulateDirectionalDispatches, event);
      }
    }

    /**
     * Accumulates without regard to direction, does not look for phased
     * registration names. Same as `accumulateDirectDispatchesSingle` but without
     * requiring that the `dispatchMarker` be the same as the dispatched ID.
     */
    function accumulateDispatches(inst, ignoredDirection, event) {
      if (event && event.dispatchConfig.registrationName) {
        var registrationName = event.dispatchConfig.registrationName;
        var listener = getListener$1(inst, registrationName);
        if (listener) {
          event._dispatchListeners = accumulateInto$1(event._dispatchListeners, listener);
          event._dispatchInstances = accumulateInto$1(event._dispatchInstances, inst);
        }
      }
    }

    /**
     * Accumulates dispatches on an `SyntheticEvent`, but only for the
     * `dispatchMarker`.
     * @param {SyntheticEvent} event
     */
    function accumulateDirectDispatchesSingle(event) {
      if (event && event.dispatchConfig.registrationName) {
        accumulateDispatches(event._targetInst, null, event);
      }
    }

    function accumulateTwoPhaseDispatches(events) {
      forEachAccumulated$1(events, accumulateTwoPhaseDispatchesSingle);
    }

    function accumulateTwoPhaseDispatchesSkipTarget(events) {
      forEachAccumulated$1(events, accumulateTwoPhaseDispatchesSingleSkipTarget);
    }

    function accumulateEnterLeaveDispatches(leave, enter, from, to) {
      EventPluginUtils$1.traverseEnterLeave(from, to, accumulateDispatches, leave, enter);
    }

    function accumulateDirectDispatches(events) {
      forEachAccumulated$1(events, accumulateDirectDispatchesSingle);
    }

    /**
     * A small set of propagation patterns, each of which will accept a small amount
     * of information, and generate a set of "dispatch ready event objects" - which
     * are sets of events that have already been annotated with a set of dispatched
     * listener functions/ids. The API is designed this way to discourage these
     * propagation strategies from actually executing the dispatches, since we
     * always want to collect the entire set of dispatches before executing event a
     * single one.
     *
     * @constructor EventPropagators
     */
    var EventPropagators$2 = {
      accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
      accumulateTwoPhaseDispatchesSkipTarget: accumulateTwoPhaseDispatchesSkipTarget,
      accumulateDirectDispatches: accumulateDirectDispatches,
      accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches
    };

    var EventPropagators_1 = EventPropagators$2;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

    /**
     * Simple, lightweight module assisting with the detection and context of
     * Worker. Helps avoid circular dependencies and allows code to reason about
     * whether or not they are in a Worker, even if they never include the main
     * `ReactWorker` dependency.
     */
    var ExecutionEnvironment$3 = {

      canUseDOM: canUseDOM,

      canUseWorkers: typeof Worker !== 'undefined',

      canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

      canUseViewport: canUseDOM && !!window.screen,

      isInWorker: !canUseDOM // For now, this is true - might change in the future.

    };

    var ExecutionEnvironment_1 = ExecutionEnvironment$3;

    var _prodInvariant$12 = reactProdInvariant_1$2;

    var invariant$13 = invariant_1;

    /**
     * Static poolers. Several custom versions for each potential number of
     * arguments. A completely generic pooler is easy to implement, but would
     * require accessing the `arguments` object. In each of these, `this` refers to
     * the Class itself, not an instance. If any others are needed, simply add them
     * here, or in their own files.
     */
    var oneArgumentPooler$1 = function oneArgumentPooler$1(copyFieldsFrom) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, copyFieldsFrom);
        return instance;
      } else {
        return new Klass(copyFieldsFrom);
      }
    };

    var twoArgumentPooler$2 = function twoArgumentPooler$2(a1, a2) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2);
        return instance;
      } else {
        return new Klass(a1, a2);
      }
    };

    var threeArgumentPooler$1 = function threeArgumentPooler$1(a1, a2, a3) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2, a3);
        return instance;
      } else {
        return new Klass(a1, a2, a3);
      }
    };

    var fourArgumentPooler$2 = function fourArgumentPooler$2(a1, a2, a3, a4) {
      var Klass = this;
      if (Klass.instancePool.length) {
        var instance = Klass.instancePool.pop();
        Klass.call(instance, a1, a2, a3, a4);
        return instance;
      } else {
        return new Klass(a1, a2, a3, a4);
      }
    };

    var standardReleaser$1 = function standardReleaser$1(instance) {
      var Klass = this;
      !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant$13(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant$12('25') : void 0;
      instance.destructor();
      if (Klass.instancePool.length < Klass.poolSize) {
        Klass.instancePool.push(instance);
      }
    };

    var DEFAULT_POOL_SIZE$1 = 10;
    var DEFAULT_POOLER$1 = oneArgumentPooler$1;

    /**
     * Augments `CopyConstructor` to be a poolable class, augmenting only the class
     * itself (statically) not adding any prototypical fields. Any CopyConstructor
     * you give this may have a `poolSize` property, and will look for a
     * prototypical `destructor` on instances.
     *
     * @param {Function} CopyConstructor Constructor that can be used to reset.
     * @param {Function} pooler Customizable pooler.
     */
    var addPoolingTo$1 = function addPoolingTo$1(CopyConstructor, pooler) {
      // Casting as any so that flow ignores the actual implementation and trusts
      // it to match the type we declared
      var NewKlass = CopyConstructor;
      NewKlass.instancePool = [];
      NewKlass.getPooled = pooler || DEFAULT_POOLER$1;
      if (!NewKlass.poolSize) {
        NewKlass.poolSize = DEFAULT_POOL_SIZE$1;
      }
      NewKlass.release = standardReleaser$1;
      return NewKlass;
    };

    var PooledClass$4 = {
      addPoolingTo: addPoolingTo$1,
      oneArgumentPooler: oneArgumentPooler$1,
      twoArgumentPooler: twoArgumentPooler$2,
      threeArgumentPooler: threeArgumentPooler$1,
      fourArgumentPooler: fourArgumentPooler$2
    };

    var PooledClass_1$2 = PooledClass$4;

    var _prodInvariant$11 = reactProdInvariant_1$2;

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var PooledClass$3 = PooledClass_1$2;

    var invariant$12 = invariant_1;

    /**
     * A specialized pseudo-event module to help keep track of components waiting to
     * be notified when their DOM representations are available for use.
     *
     * This implements `PooledClass`, so you should never need to instantiate this.
     * Instead, use `CallbackQueue.getPooled()`.
     *
     * @class ReactMountReady
     * @implements PooledClass
     * @internal
     */

    var CallbackQueue$1 = function () {
      function CallbackQueue(arg) {
        _classCallCheck(this, CallbackQueue);

        this._callbacks = null;
        this._contexts = null;
        this._arg = arg;
      }

      /**
       * Enqueues a callback to be invoked when `notifyAll` is invoked.
       *
       * @param {function} callback Invoked when `notifyAll` is invoked.
       * @param {?object} context Context to call `callback` with.
       * @internal
       */

      CallbackQueue.prototype.enqueue = function enqueue(callback, context) {
        this._callbacks = this._callbacks || [];
        this._callbacks.push(callback);
        this._contexts = this._contexts || [];
        this._contexts.push(context);
      };

      /**
       * Invokes all enqueued callbacks and clears the queue. This is invoked after
       * the DOM representation of a component has been created or updated.
       *
       * @internal
       */

      CallbackQueue.prototype.notifyAll = function notifyAll() {
        var callbacks = this._callbacks;
        var contexts = this._contexts;
        var arg = this._arg;
        if (callbacks && contexts) {
          !(callbacks.length === contexts.length) ? process.env.NODE_ENV !== 'production' ? invariant$12(false, 'Mismatched list of contexts in callback queue') : _prodInvariant$11('24') : void 0;
          this._callbacks = null;
          this._contexts = null;
          for (var i = 0; i < callbacks.length; i++) {
            callbacks[i].call(contexts[i], arg);
          }
          callbacks.length = 0;
          contexts.length = 0;
        }
      };

      CallbackQueue.prototype.checkpoint = function checkpoint() {
        return this._callbacks ? this._callbacks.length : 0;
      };

      CallbackQueue.prototype.rollback = function rollback(len) {
        if (this._callbacks && this._contexts) {
          this._callbacks.length = len;
          this._contexts.length = len;
        }
      };

      /**
       * Resets the internal queue.
       *
       * @internal
       */

      CallbackQueue.prototype.reset = function reset() {
        this._callbacks = null;
        this._contexts = null;
      };

      /**
       * `PooledClass` looks for this.
       */

      CallbackQueue.prototype.destructor = function destructor() {
        this.reset();
      };

      return CallbackQueue;
    }();

    var CallbackQueue_1 = PooledClass$3.addPoolingTo(CallbackQueue$1);

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    var ReactFeatureFlags$1 = {
      // When true, call console.time() before and .timeEnd() after each top-level
      // render (both initial renders and updates). Useful when looking at prod-mode
      // timeline profiles in Chrome, for example.
      logTopLevelRenders: false
    };

    var ReactFeatureFlags_1 = ReactFeatureFlags$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    var ReactOwner = require('./ReactOwner');

    var ReactRef$1 = {};

    function attachRef(ref, component, owner) {
      if (typeof ref === 'function') {
        ref(component.getPublicInstance());
      } else {
        // Legacy ref
        ReactOwner.addComponentAsRefTo(component, ref, owner);
      }
    }

    function detachRef(ref, component, owner) {
      if (typeof ref === 'function') {
        ref(null);
      } else {
        // Legacy ref
        ReactOwner.removeComponentAsRefFrom(component, ref, owner);
      }
    }

    ReactRef$1.attachRefs = function (instance, element) {
      if (element === null || (typeof element === 'undefined' ? 'undefined' : _typeof(element)) !== 'object') {
        return;
      }
      var ref = element.ref;
      if (ref != null) {
        attachRef(ref, instance, element._owner);
      }
    };

    ReactRef$1.shouldUpdateRefs = function (prevElement, nextElement) {
      // If either the owner or a `ref` has changed, make sure the newest owner
      // has stored a reference to `this`, and the previous owner (if different)
      // has forgotten the reference to `this`. We use the element instead
      // of the public this.props because the post processing cannot determine
      // a ref. The ref conceptually lives on the element.

      // TODO: Should this even be possible? The owner cannot change because
      // it's forbidden by shouldUpdateReactComponent. The ref can change
      // if you swap the keys of but not the refs. Reconsider where this check
      // is made. It probably belongs where the key checking and
      // instantiateReactComponent is done.

      var prevRef = null;
      var prevOwner = null;
      if (prevElement !== null && (typeof prevElement === 'undefined' ? 'undefined' : _typeof(prevElement)) === 'object') {
        prevRef = prevElement.ref;
        prevOwner = prevElement._owner;
      }

      var nextRef = null;
      var nextOwner = null;
      if (nextElement !== null && (typeof nextElement === 'undefined' ? 'undefined' : _typeof(nextElement)) === 'object') {
        nextRef = nextElement.ref;
        nextOwner = nextElement._owner;
      }

      return prevRef !== nextRef ||
      // If owner changes but we have an unchanged function ref, don't update refs
      typeof nextRef === 'string' && nextOwner !== prevOwner;
    };

    ReactRef$1.detachRefs = function (instance, element) {
      if (element === null || (typeof element === 'undefined' ? 'undefined' : _typeof(element)) !== 'object') {
        return;
      }
      var ref = element.ref;
      if (ref != null) {
        detachRef(ref, instance, element._owner);
      }
    };

    module.exports = ReactRef$1;



    var ReactRef$2 = Object.freeze({

    });

    /**
     * Copyright 2016-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    var ReactInvalidSetStateWarningHook = require('./ReactInvalidSetStateWarningHook');
    var ReactHostOperationHistoryHook = require('./ReactHostOperationHistoryHook');
    var ReactComponentTreeHook$1 = require('react/lib/ReactComponentTreeHook');
    var ExecutionEnvironment$4 = require('fbjs/lib/ExecutionEnvironment');

    var performanceNow = require('fbjs/lib/performanceNow');
    var warning$13 = require('fbjs/lib/warning');

    var hooks = [];
    var didHookThrowForEvent = {};

    function callHook(event, fn, context, arg1, arg2, arg3, arg4, arg5) {
      try {
        fn.call(context, arg1, arg2, arg3, arg4, arg5);
      } catch (e) {
        process.env.NODE_ENV !== 'production' ? warning$13(didHookThrowForEvent[event], 'Exception thrown by hook while handling %s: %s', event, e + '\n' + e.stack) : void 0;
        didHookThrowForEvent[event] = true;
      }
    }

    function emitEvent(event, arg1, arg2, arg3, arg4, arg5) {
      for (var i = 0; i < hooks.length; i++) {
        var hook = hooks[i];
        var fn = hook[event];
        if (fn) {
          callHook(event, fn, hook, arg1, arg2, arg3, arg4, arg5);
        }
      }
    }

    var _isProfiling = false;
    var flushHistory = [];
    var lifeCycleTimerStack = [];
    var currentFlushNesting = 0;
    var currentFlushMeasurements = [];
    var currentFlushStartTime = 0;
    var currentTimerDebugID = null;
    var currentTimerStartTime = 0;
    var currentTimerNestedFlushDuration = 0;
    var currentTimerType = null;

    var lifeCycleTimerHasWarned = false;

    function clearHistory() {
      ReactComponentTreeHook$1.purgeUnmountedComponents();
      ReactHostOperationHistoryHook.clearHistory();
    }

    function getTreeSnapshot(registeredIDs) {
      return registeredIDs.reduce(function (tree, id) {
        var ownerID = ReactComponentTreeHook$1.getOwnerID(id);
        var parentID = ReactComponentTreeHook$1.getParentID(id);
        tree[id] = {
          displayName: ReactComponentTreeHook$1.getDisplayName(id),
          text: ReactComponentTreeHook$1.getText(id),
          updateCount: ReactComponentTreeHook$1.getUpdateCount(id),
          childIDs: ReactComponentTreeHook$1.getChildIDs(id),
          // Text nodes don't have owners but this is close enough.
          ownerID: ownerID || parentID && ReactComponentTreeHook$1.getOwnerID(parentID) || 0,
          parentID: parentID
        };
        return tree;
      }, {});
    }

    function resetMeasurements() {
      var previousStartTime = currentFlushStartTime;
      var previousMeasurements = currentFlushMeasurements;
      var previousOperations = ReactHostOperationHistoryHook.getHistory();

      if (currentFlushNesting === 0) {
        currentFlushStartTime = 0;
        currentFlushMeasurements = [];
        clearHistory();
        return;
      }

      if (previousMeasurements.length || previousOperations.length) {
        var registeredIDs = ReactComponentTreeHook$1.getRegisteredIDs();
        flushHistory.push({
          duration: performanceNow() - previousStartTime,
          measurements: previousMeasurements || [],
          operations: previousOperations || [],
          treeSnapshot: getTreeSnapshot(registeredIDs)
        });
      }

      clearHistory();
      currentFlushStartTime = performanceNow();
      currentFlushMeasurements = [];
    }

    function checkDebugID(debugID) {
      var allowRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (allowRoot && debugID === 0) {
        return;
      }
      if (!debugID) {
        process.env.NODE_ENV !== 'production' ? warning$13(false, 'ReactDebugTool: debugID may not be empty.') : void 0;
      }
    }

    function beginLifeCycleTimer(debugID, timerType) {
      if (currentFlushNesting === 0) {
        return;
      }
      if (currentTimerType && !lifeCycleTimerHasWarned) {
        process.env.NODE_ENV !== 'production' ? warning$13(false, 'There is an internal error in the React performance measurement code. ' + 'Did not expect %s timer to start while %s timer is still in ' + 'progress for %s instance.', timerType, currentTimerType || 'no', debugID === currentTimerDebugID ? 'the same' : 'another') : void 0;
        lifeCycleTimerHasWarned = true;
      }
      currentTimerStartTime = performanceNow();
      currentTimerNestedFlushDuration = 0;
      currentTimerDebugID = debugID;
      currentTimerType = timerType;
    }

    function endLifeCycleTimer(debugID, timerType) {
      if (currentFlushNesting === 0) {
        return;
      }
      if (currentTimerType !== timerType && !lifeCycleTimerHasWarned) {
        process.env.NODE_ENV !== 'production' ? warning$13(false, 'There is an internal error in the React performance measurement code. ' + 'We did not expect %s timer to stop while %s timer is still in ' + 'progress for %s instance. Please report this as a bug in React.', timerType, currentTimerType || 'no', debugID === currentTimerDebugID ? 'the same' : 'another') : void 0;
        lifeCycleTimerHasWarned = true;
      }
      if (_isProfiling) {
        currentFlushMeasurements.push({
          timerType: timerType,
          instanceID: debugID,
          duration: performanceNow() - currentTimerStartTime - currentTimerNestedFlushDuration
        });
      }
      currentTimerStartTime = 0;
      currentTimerNestedFlushDuration = 0;
      currentTimerDebugID = null;
      currentTimerType = null;
    }

    function pauseCurrentLifeCycleTimer() {
      var currentTimer = {
        startTime: currentTimerStartTime,
        nestedFlushStartTime: performanceNow(),
        debugID: currentTimerDebugID,
        timerType: currentTimerType
      };
      lifeCycleTimerStack.push(currentTimer);
      currentTimerStartTime = 0;
      currentTimerNestedFlushDuration = 0;
      currentTimerDebugID = null;
      currentTimerType = null;
    }

    function resumeCurrentLifeCycleTimer() {
      var _lifeCycleTimerStack$ = lifeCycleTimerStack.pop(),
          startTime = _lifeCycleTimerStack$.startTime,
          nestedFlushStartTime = _lifeCycleTimerStack$.nestedFlushStartTime,
          debugID = _lifeCycleTimerStack$.debugID,
          timerType = _lifeCycleTimerStack$.timerType;

      var nestedFlushDuration = performanceNow() - nestedFlushStartTime;
      currentTimerStartTime = startTime;
      currentTimerNestedFlushDuration += nestedFlushDuration;
      currentTimerDebugID = debugID;
      currentTimerType = timerType;
    }

    var lastMarkTimeStamp = 0;
    var canUsePerformanceMeasure =
    // $FlowFixMe https://github.com/facebook/flow/issues/2345
    typeof performance !== 'undefined' && typeof performance.mark === 'function' && typeof performance.clearMarks === 'function' && typeof performance.measure === 'function' && typeof performance.clearMeasures === 'function';

    function shouldMark(debugID) {
      if (!_isProfiling || !canUsePerformanceMeasure) {
        return false;
      }
      var element = ReactComponentTreeHook$1.getElement(debugID);
      if (element == null || (typeof element === 'undefined' ? 'undefined' : _typeof(element)) !== 'object') {
        return false;
      }
      var isHostElement = typeof element.type === 'string';
      if (isHostElement) {
        return false;
      }
      return true;
    }

    function markBegin(debugID, markType) {
      if (!shouldMark(debugID)) {
        return;
      }

      var markName = debugID + '::' + markType;
      lastMarkTimeStamp = performanceNow();
      performance.mark(markName);
    }

    function markEnd(debugID, markType) {
      if (!shouldMark(debugID)) {
        return;
      }

      var markName = debugID + '::' + markType;
      var displayName = ReactComponentTreeHook$1.getDisplayName(debugID) || 'Unknown';

      // Chrome has an issue of dropping markers recorded too fast:
      // https://bugs.chromium.org/p/chromium/issues/detail?id=640652
      // To work around this, we will not report very small measurements.
      // I determined the magic number by tweaking it back and forth.
      // 0.05ms was enough to prevent the issue, but I set it to 0.1ms to be safe.
      // When the bug is fixed, we can `measure()` unconditionally if we want to.
      var timeStamp = performanceNow();
      if (timeStamp - lastMarkTimeStamp > 0.1) {
        var measurementName = displayName + ' [' + markType + ']';
        performance.measure(measurementName, markName);
      }

      performance.clearMarks(markName);
      performance.clearMeasures(measurementName);
    }

    var ReactDebugTool$1 = {
      addHook: function addHook(hook) {
        hooks.push(hook);
      },
      removeHook: function removeHook(hook) {
        for (var i = 0; i < hooks.length; i++) {
          if (hooks[i] === hook) {
            hooks.splice(i, 1);
            i--;
          }
        }
      },
      isProfiling: function isProfiling() {
        return _isProfiling;
      },
      beginProfiling: function beginProfiling() {
        if (_isProfiling) {
          return;
        }

        _isProfiling = true;
        flushHistory.length = 0;
        resetMeasurements();
        ReactDebugTool$1.addHook(ReactHostOperationHistoryHook);
      },
      endProfiling: function endProfiling() {
        if (!_isProfiling) {
          return;
        }

        _isProfiling = false;
        resetMeasurements();
        ReactDebugTool$1.removeHook(ReactHostOperationHistoryHook);
      },
      getFlushHistory: function getFlushHistory() {
        return flushHistory;
      },
      onBeginFlush: function onBeginFlush() {
        currentFlushNesting++;
        resetMeasurements();
        pauseCurrentLifeCycleTimer();
        emitEvent('onBeginFlush');
      },
      onEndFlush: function onEndFlush() {
        resetMeasurements();
        currentFlushNesting--;
        resumeCurrentLifeCycleTimer();
        emitEvent('onEndFlush');
      },
      onBeginLifeCycleTimer: function onBeginLifeCycleTimer(debugID, timerType) {
        checkDebugID(debugID);
        emitEvent('onBeginLifeCycleTimer', debugID, timerType);
        markBegin(debugID, timerType);
        beginLifeCycleTimer(debugID, timerType);
      },
      onEndLifeCycleTimer: function onEndLifeCycleTimer(debugID, timerType) {
        checkDebugID(debugID);
        endLifeCycleTimer(debugID, timerType);
        markEnd(debugID, timerType);
        emitEvent('onEndLifeCycleTimer', debugID, timerType);
      },
      onBeginProcessingChildContext: function onBeginProcessingChildContext() {
        emitEvent('onBeginProcessingChildContext');
      },
      onEndProcessingChildContext: function onEndProcessingChildContext() {
        emitEvent('onEndProcessingChildContext');
      },
      onHostOperation: function onHostOperation(operation) {
        checkDebugID(operation.instanceID);
        emitEvent('onHostOperation', operation);
      },
      onSetState: function onSetState() {
        emitEvent('onSetState');
      },
      onSetChildren: function onSetChildren(debugID, childDebugIDs) {
        checkDebugID(debugID);
        childDebugIDs.forEach(checkDebugID);
        emitEvent('onSetChildren', debugID, childDebugIDs);
      },
      onBeforeMountComponent: function onBeforeMountComponent(debugID, element, parentDebugID) {
        checkDebugID(debugID);
        checkDebugID(parentDebugID, true);
        emitEvent('onBeforeMountComponent', debugID, element, parentDebugID);
        markBegin(debugID, 'mount');
      },
      onMountComponent: function onMountComponent(debugID) {
        checkDebugID(debugID);
        markEnd(debugID, 'mount');
        emitEvent('onMountComponent', debugID);
      },
      onBeforeUpdateComponent: function onBeforeUpdateComponent(debugID, element) {
        checkDebugID(debugID);
        emitEvent('onBeforeUpdateComponent', debugID, element);
        markBegin(debugID, 'update');
      },
      onUpdateComponent: function onUpdateComponent(debugID) {
        checkDebugID(debugID);
        markEnd(debugID, 'update');
        emitEvent('onUpdateComponent', debugID);
      },
      onBeforeUnmountComponent: function onBeforeUnmountComponent(debugID) {
        checkDebugID(debugID);
        emitEvent('onBeforeUnmountComponent', debugID);
        markBegin(debugID, 'unmount');
      },
      onUnmountComponent: function onUnmountComponent(debugID) {
        checkDebugID(debugID);
        markEnd(debugID, 'unmount');
        emitEvent('onUnmountComponent', debugID);
      },
      onTestEvent: function onTestEvent() {
        emitEvent('onTestEvent');
      }
    };

    // TODO remove these when RN/www gets updated
    ReactDebugTool$1.addDevtool = ReactDebugTool$1.addHook;
    ReactDebugTool$1.removeDevtool = ReactDebugTool$1.removeHook;

    ReactDebugTool$1.addHook(ReactInvalidSetStateWarningHook);
    ReactDebugTool$1.addHook(ReactComponentTreeHook$1);
    var url = ExecutionEnvironment$4.canUseDOM && window.location.href || '';
    if (/[?&]react_perf\b/.test(url)) {
      ReactDebugTool$1.beginProfiling();
    }

    module.exports = ReactDebugTool$1;



    var ReactDebugTool$2 = Object.freeze({

    });

    var require$$0$6 = ( ReactDebugTool$2 && ReactDebugTool$2['default'] ) || ReactDebugTool$2;

    // Trust the developer to only use ReactInstrumentation with a __DEV__ check

    var debugTool = null;

    if (process.env.NODE_ENV !== 'production') {
      var ReactDebugTool = require$$0$6;
      debugTool = ReactDebugTool;
    }

    var ReactInstrumentation$2 = { debugTool: debugTool };

    var require$$2$8 = ( ReactRef$2 && ReactRef$2['default'] ) || ReactRef$2;

    var ReactRef = require$$2$8;
    var ReactInstrumentation$1 = ReactInstrumentation$2;

    var warning$12 = warning_1;

    /**
     * Helper to call ReactRef.attachRefs with this composite component, split out
     * to avoid allocations in the transaction mount-ready queue.
     */
    function attachRefs() {
      ReactRef.attachRefs(this, this._currentElement);
    }

    var ReactReconciler$2 = {

      /**
       * Initializes the component, renders markup, and registers event listeners.
       *
       * @param {ReactComponent} internalInstance
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @param {?object} the containing host component instance
       * @param {?object} info about the host container
       * @return {?string} Rendered markup to be inserted into the DOM.
       * @final
       * @internal
       */
      mountComponent: function mountComponent(internalInstance, transaction, hostParent, hostContainerInfo, context, parentDebugID // 0 in production and for roots
      ) {
        if (process.env.NODE_ENV !== 'production') {
          if (internalInstance._debugID !== 0) {
            ReactInstrumentation$1.debugTool.onBeforeMountComponent(internalInstance._debugID, internalInstance._currentElement, parentDebugID);
          }
        }
        var markup = internalInstance.mountComponent(transaction, hostParent, hostContainerInfo, context, parentDebugID);
        if (internalInstance._currentElement && internalInstance._currentElement.ref != null) {
          transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
        }
        if (process.env.NODE_ENV !== 'production') {
          if (internalInstance._debugID !== 0) {
            ReactInstrumentation$1.debugTool.onMountComponent(internalInstance._debugID);
          }
        }
        return markup;
      },

      /**
       * Returns a value that can be passed to
       * ReactComponentEnvironment.replaceNodeWithMarkup.
       */
      getHostNode: function getHostNode(internalInstance) {
        return internalInstance.getHostNode();
      },

      /**
       * Releases any resources allocated by `mountComponent`.
       *
       * @final
       * @internal
       */
      unmountComponent: function unmountComponent(internalInstance, safely) {
        if (process.env.NODE_ENV !== 'production') {
          if (internalInstance._debugID !== 0) {
            ReactInstrumentation$1.debugTool.onBeforeUnmountComponent(internalInstance._debugID);
          }
        }
        ReactRef.detachRefs(internalInstance, internalInstance._currentElement);
        internalInstance.unmountComponent(safely);
        if (process.env.NODE_ENV !== 'production') {
          if (internalInstance._debugID !== 0) {
            ReactInstrumentation$1.debugTool.onUnmountComponent(internalInstance._debugID);
          }
        }
      },

      /**
       * Update a component using a new element.
       *
       * @param {ReactComponent} internalInstance
       * @param {ReactElement} nextElement
       * @param {ReactReconcileTransaction} transaction
       * @param {object} context
       * @internal
       */
      receiveComponent: function receiveComponent(internalInstance, nextElement, transaction, context) {
        var prevElement = internalInstance._currentElement;

        if (nextElement === prevElement && context === internalInstance._context) {
          // Since elements are immutable after the owner is rendered,
          // we can do a cheap identity compare here to determine if this is a
          // superfluous reconcile. It's possible for state to be mutable but such
          // change should trigger an update of the owner which would recreate
          // the element. We explicitly check for the existence of an owner since
          // it's possible for an element created outside a composite to be
          // deeply mutated and reused.

          // TODO: Bailing out early is just a perf optimization right?
          // TODO: Removing the return statement should affect correctness?
          return;
        }

        if (process.env.NODE_ENV !== 'production') {
          if (internalInstance._debugID !== 0) {
            ReactInstrumentation$1.debugTool.onBeforeUpdateComponent(internalInstance._debugID, nextElement);
          }
        }

        var refsChanged = ReactRef.shouldUpdateRefs(prevElement, nextElement);

        if (refsChanged) {
          ReactRef.detachRefs(internalInstance, prevElement);
        }

        internalInstance.receiveComponent(nextElement, transaction, context);

        if (refsChanged && internalInstance._currentElement && internalInstance._currentElement.ref != null) {
          transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
        }

        if (process.env.NODE_ENV !== 'production') {
          if (internalInstance._debugID !== 0) {
            ReactInstrumentation$1.debugTool.onUpdateComponent(internalInstance._debugID);
          }
        }
      },

      /**
       * Flush any dirty changes in a component.
       *
       * @param {ReactComponent} internalInstance
       * @param {ReactReconcileTransaction} transaction
       * @internal
       */
      performUpdateIfNecessary: function performUpdateIfNecessary(internalInstance, transaction, updateBatchNumber) {
        if (internalInstance._updateBatchNumber !== updateBatchNumber) {
          // The component's enqueued batch number should always be the current
          // batch or the following one.
          process.env.NODE_ENV !== 'production' ? warning$12(internalInstance._updateBatchNumber == null || internalInstance._updateBatchNumber === updateBatchNumber + 1, 'performUpdateIfNecessary: Unexpected batch number (current %s, ' + 'pending %s)', updateBatchNumber, internalInstance._updateBatchNumber) : void 0;
          return;
        }
        if (process.env.NODE_ENV !== 'production') {
          if (internalInstance._debugID !== 0) {
            ReactInstrumentation$1.debugTool.onBeforeUpdateComponent(internalInstance._debugID, internalInstance._currentElement);
          }
        }
        internalInstance.performUpdateIfNecessary(transaction);
        if (process.env.NODE_ENV !== 'production') {
          if (internalInstance._debugID !== 0) {
            ReactInstrumentation$1.debugTool.onUpdateComponent(internalInstance._debugID);
          }
        }
      }

    };

    var ReactReconciler_1 = ReactReconciler$2;

    var _prodInvariant$13 = reactProdInvariant_1$2;

    var invariant$14 = invariant_1;

    var OBSERVED_ERROR = {};

    /**
     * `Transaction` creates a black box that is able to wrap any method such that
     * certain invariants are maintained before and after the method is invoked
     * (Even if an exception is thrown while invoking the wrapped method). Whoever
     * instantiates a transaction can provide enforcers of the invariants at
     * creation time. The `Transaction` class itself will supply one additional
     * automatic invariant for you - the invariant that any transaction instance
     * should not be run while it is already being run. You would typically create a
     * single instance of a `Transaction` for reuse multiple times, that potentially
     * is used to wrap several different methods. Wrappers are extremely simple -
     * they only require implementing two methods.
     *
     * <pre>
     *                       wrappers (injected at creation time)
     *                                      +        +
     *                                      |        |
     *                    +-----------------|--------|--------------+
     *                    |                 v        |              |
     *                    |      +---------------+   |              |
     *                    |   +--|    wrapper1   |---|----+         |
     *                    |   |  +---------------+   v    |         |
     *                    |   |          +-------------+  |         |
     *                    |   |     +----|   wrapper2  |--------+   |
     *                    |   |     |    +-------------+  |     |   |
     *                    |   |     |                     |     |   |
     *                    |   v     v                     v     v   | wrapper
     *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
     * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
     * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
     *                    | |   | |   |   |         |   |   | |   | |
     *                    | |   | |   |   |         |   |   | |   | |
     *                    | |   | |   |   |         |   |   | |   | |
     *                    | +---+ +---+   +---------+   +---+ +---+ |
     *                    |  initialize                    close    |
     *                    +-----------------------------------------+
     * </pre>
     *
     * Use cases:
     * - Preserving the input selection ranges before/after reconciliation.
     *   Restoring selection even in the event of an unexpected error.
     * - Deactivating events while rearranging the DOM, preventing blurs/focuses,
     *   while guaranteeing that afterwards, the event system is reactivated.
     * - Flushing a queue of collected DOM mutations to the main UI thread after a
     *   reconciliation takes place in a worker thread.
     * - Invoking any collected `componentDidUpdate` callbacks after rendering new
     *   content.
     * - (Future use case): Wrapping particular flushes of the `ReactWorker` queue
     *   to preserve the `scrollTop` (an automatic scroll aware DOM).
     * - (Future use case): Layout calculations before and after DOM updates.
     *
     * Transactional plugin API:
     * - A module that has an `initialize` method that returns any precomputation.
     * - and a `close` method that accepts the precomputation. `close` is invoked
     *   when the wrapped process is completed, or has failed.
     *
     * @param {Array<TransactionalWrapper>} transactionWrapper Wrapper modules
     * that implement `initialize` and `close`.
     * @return {Transaction} Single transaction for reuse in thread.
     *
     * @class Transaction
     */
    var TransactionImpl = {
      /**
       * Sets up this instance so that it is prepared for collecting metrics. Does
       * so such that this setup method may be used on an instance that is already
       * initialized, in a way that does not consume additional memory upon reuse.
       * That can be useful if you decide to make your subclass of this mixin a
       * "PooledClass".
       */
      reinitializeTransaction: function reinitializeTransaction() {
        this.transactionWrappers = this.getTransactionWrappers();
        if (this.wrapperInitData) {
          this.wrapperInitData.length = 0;
        } else {
          this.wrapperInitData = [];
        }
        this._isInTransaction = false;
      },

      _isInTransaction: false,

      /**
       * @abstract
       * @return {Array<TransactionWrapper>} Array of transaction wrappers.
       */
      getTransactionWrappers: null,

      isInTransaction: function isInTransaction() {
        return !!this._isInTransaction;
      },

      /**
       * Executes the function within a safety window. Use this for the top level
       * methods that result in large amounts of computation/mutations that would
       * need to be safety checked. The optional arguments helps prevent the need
       * to bind in many cases.
       *
       * @param {function} method Member of scope to call.
       * @param {Object} scope Scope to invoke from.
       * @param {Object?=} a Argument to pass to the method.
       * @param {Object?=} b Argument to pass to the method.
       * @param {Object?=} c Argument to pass to the method.
       * @param {Object?=} d Argument to pass to the method.
       * @param {Object?=} e Argument to pass to the method.
       * @param {Object?=} f Argument to pass to the method.
       *
       * @return {*} Return value from `method`.
       */
      perform: function perform(method, scope, a, b, c, d, e, f) {
        !!this.isInTransaction() ? process.env.NODE_ENV !== 'production' ? invariant$14(false, 'Transaction.perform(...): Cannot initialize a transaction when there is already an outstanding transaction.') : _prodInvariant$13('27') : void 0;
        var errorThrown;
        var ret;
        try {
          this._isInTransaction = true;
          // Catching errors makes debugging more difficult, so we start with
          // errorThrown set to true before setting it to false after calling
          // close -- if it's still set to true in the finally block, it means
          // one of these calls threw.
          errorThrown = true;
          this.initializeAll(0);
          ret = method.call(scope, a, b, c, d, e, f);
          errorThrown = false;
        } finally {
          try {
            if (errorThrown) {
              // If `method` throws, prefer to show that stack trace over any thrown
              // by invoking `closeAll`.
              try {
                this.closeAll(0);
              } catch (err) {}
            } else {
              // Since `method` didn't throw, we don't want to silence the exception
              // here.
              this.closeAll(0);
            }
          } finally {
            this._isInTransaction = false;
          }
        }
        return ret;
      },

      initializeAll: function initializeAll(startIndex) {
        var transactionWrappers = this.transactionWrappers;
        for (var i = startIndex; i < transactionWrappers.length; i++) {
          var wrapper = transactionWrappers[i];
          try {
            // Catching errors makes debugging more difficult, so we start with the
            // OBSERVED_ERROR state before overwriting it with the real return value
            // of initialize -- if it's still set to OBSERVED_ERROR in the finally
            // block, it means wrapper.initialize threw.
            this.wrapperInitData[i] = OBSERVED_ERROR;
            this.wrapperInitData[i] = wrapper.initialize ? wrapper.initialize.call(this) : null;
          } finally {
            if (this.wrapperInitData[i] === OBSERVED_ERROR) {
              // The initializer for wrapper i threw an error; initialize the
              // remaining wrappers but silence any exceptions from them to ensure
              // that the first error is the one to bubble up.
              try {
                this.initializeAll(i + 1);
              } catch (err) {}
            }
          }
        }
      },

      /**
       * Invokes each of `this.transactionWrappers.close[i]` functions, passing into
       * them the respective return values of `this.transactionWrappers.init[i]`
       * (`close`rs that correspond to initializers that failed will not be
       * invoked).
       */
      closeAll: function closeAll(startIndex) {
        !this.isInTransaction() ? process.env.NODE_ENV !== 'production' ? invariant$14(false, 'Transaction.closeAll(): Cannot close transaction when none are open.') : _prodInvariant$13('28') : void 0;
        var transactionWrappers = this.transactionWrappers;
        for (var i = startIndex; i < transactionWrappers.length; i++) {
          var wrapper = transactionWrappers[i];
          var initData = this.wrapperInitData[i];
          var errorThrown;
          try {
            // Catching errors makes debugging more difficult, so we start with
            // errorThrown set to true before setting it to false after calling
            // close -- if it's still set to true in the finally block, it means
            // wrapper.close threw.
            errorThrown = true;
            if (initData !== OBSERVED_ERROR && wrapper.close) {
              wrapper.close.call(this, initData);
            }
            errorThrown = false;
          } finally {
            if (errorThrown) {
              // The closer for wrapper i threw an error; close the remaining
              // wrappers but silence any exceptions from them to ensure that the
              // first error is the one to bubble up.
              try {
                this.closeAll(i + 1);
              } catch (e) {}
            }
          }
        }
        this.wrapperInitData.length = 0;
      }
    };

    var Transaction$1 = TransactionImpl;

    var _prodInvariant$10 = reactProdInvariant_1$2;
    var _assign$4 = index;

    var CallbackQueue = CallbackQueue_1;
    var PooledClass$2 = PooledClass_1$2;
    var ReactFeatureFlags = ReactFeatureFlags_1;
    var ReactReconciler$1 = ReactReconciler_1;
    var Transaction = Transaction$1;

    var invariant$11 = invariant_1;

    var dirtyComponents = [];
    var updateBatchNumber = 0;
    var asapCallbackQueue = CallbackQueue.getPooled();
    var asapEnqueued = false;

    var batchingStrategy = null;

    function ensureInjected() {
      !(ReactUpdates$2.ReactReconcileTransaction && batchingStrategy) ? process.env.NODE_ENV !== 'production' ? invariant$11(false, 'ReactUpdates: must inject a reconcile transaction class and batching strategy') : _prodInvariant$10('123') : void 0;
    }

    var NESTED_UPDATES = {
      initialize: function initialize() {
        this.dirtyComponentsLength = dirtyComponents.length;
      },
      close: function close() {
        if (this.dirtyComponentsLength !== dirtyComponents.length) {
          // Additional updates were enqueued by componentDidUpdate handlers or
          // similar; before our own UPDATE_QUEUEING wrapper closes, we want to run
          // these new updates so that if A's componentDidUpdate calls setState on
          // B, B will update before the callback A's updater provided when calling
          // setState.
          dirtyComponents.splice(0, this.dirtyComponentsLength);
          flushBatchedUpdates();
        } else {
          dirtyComponents.length = 0;
        }
      }
    };

    var UPDATE_QUEUEING = {
      initialize: function initialize() {
        this.callbackQueue.reset();
      },
      close: function close() {
        this.callbackQueue.notifyAll();
      }
    };

    var TRANSACTION_WRAPPERS = [NESTED_UPDATES, UPDATE_QUEUEING];

    function ReactUpdatesFlushTransaction() {
      this.reinitializeTransaction();
      this.dirtyComponentsLength = null;
      this.callbackQueue = CallbackQueue.getPooled();
      this.reconcileTransaction = ReactUpdates$2.ReactReconcileTransaction.getPooled(
      /* useCreateElement */true);
    }

    _assign$4(ReactUpdatesFlushTransaction.prototype, Transaction, {
      getTransactionWrappers: function getTransactionWrappers() {
        return TRANSACTION_WRAPPERS;
      },

      destructor: function destructor() {
        this.dirtyComponentsLength = null;
        CallbackQueue.release(this.callbackQueue);
        this.callbackQueue = null;
        ReactUpdates$2.ReactReconcileTransaction.release(this.reconcileTransaction);
        this.reconcileTransaction = null;
      },

      perform: function perform(method, scope, a) {
        // Essentially calls `this.reconcileTransaction.perform(method, scope, a)`
        // with this transaction's wrappers around it.
        return Transaction.perform.call(this, this.reconcileTransaction.perform, this.reconcileTransaction, method, scope, a);
      }
    });

    PooledClass$2.addPoolingTo(ReactUpdatesFlushTransaction);

    function batchedUpdates$1(callback, a, b, c, d, e) {
      ensureInjected();
      return batchingStrategy.batchedUpdates(callback, a, b, c, d, e);
    }

    /**
     * Array comparator for ReactComponents by mount ordering.
     *
     * @param {ReactComponent} c1 first component you're comparing
     * @param {ReactComponent} c2 second component you're comparing
     * @return {number} Return value usable by Array.prototype.sort().
     */
    function mountOrderComparator(c1, c2) {
      return c1._mountOrder - c2._mountOrder;
    }

    function runBatchedUpdates(transaction) {
      var len = transaction.dirtyComponentsLength;
      !(len === dirtyComponents.length) ? process.env.NODE_ENV !== 'production' ? invariant$11(false, 'Expected flush transaction\'s stored dirty-components length (%s) to match dirty-components array length (%s).', len, dirtyComponents.length) : _prodInvariant$10('124', len, dirtyComponents.length) : void 0;

      // Since reconciling a component higher in the owner hierarchy usually (not
      // always -- see shouldComponentUpdate()) will reconcile children, reconcile
      // them before their children by sorting the array.
      dirtyComponents.sort(mountOrderComparator);

      // Any updates enqueued while reconciling must be performed after this entire
      // batch. Otherwise, if dirtyComponents is [A, B] where A has children B and
      // C, B could update twice in a single batch if C's render enqueues an update
      // to B (since B would have already updated, we should skip it, and the only
      // way we can know to do so is by checking the batch counter).
      updateBatchNumber++;

      for (var i = 0; i < len; i++) {
        // If a component is unmounted before pending changes apply, it will still
        // be here, but we assume that it has cleared its _pendingCallbacks and
        // that performUpdateIfNecessary is a noop.
        var component = dirtyComponents[i];

        // If performUpdateIfNecessary happens to enqueue any new updates, we
        // shouldn't execute the callbacks until the next render happens, so
        // stash the callbacks first
        var callbacks = component._pendingCallbacks;
        component._pendingCallbacks = null;

        var markerName;
        if (ReactFeatureFlags.logTopLevelRenders) {
          var namedComponent = component;
          // Duck type TopLevelWrapper. This is probably always true.
          if (component._currentElement.type.isReactTopLevelWrapper) {
            namedComponent = component._renderedComponent;
          }
          markerName = 'React update: ' + namedComponent.getName();
          console.time(markerName);
        }

        ReactReconciler$1.performUpdateIfNecessary(component, transaction.reconcileTransaction, updateBatchNumber);

        if (markerName) {
          console.timeEnd(markerName);
        }

        if (callbacks) {
          for (var j = 0; j < callbacks.length; j++) {
            transaction.callbackQueue.enqueue(callbacks[j], component.getPublicInstance());
          }
        }
      }
    }

    var flushBatchedUpdates = function flushBatchedUpdates() {
      // ReactUpdatesFlushTransaction's wrappers will clear the dirtyComponents
      // array and perform any updates enqueued by mount-ready handlers (i.e.,
      // componentDidUpdate) but we need to check here too in order to catch
      // updates enqueued by setState callbacks and asap calls.
      while (dirtyComponents.length || asapEnqueued) {
        if (dirtyComponents.length) {
          var transaction = ReactUpdatesFlushTransaction.getPooled();
          transaction.perform(runBatchedUpdates, null, transaction);
          ReactUpdatesFlushTransaction.release(transaction);
        }

        if (asapEnqueued) {
          asapEnqueued = false;
          var queue = asapCallbackQueue;
          asapCallbackQueue = CallbackQueue.getPooled();
          queue.notifyAll();
          CallbackQueue.release(queue);
        }
      }
    };

    /**
     * Mark a component as needing a rerender, adding an optional callback to a
     * list of functions which will be executed once the rerender occurs.
     */
    function enqueueUpdate(component) {
      ensureInjected();

      // Various parts of our code (such as ReactCompositeComponent's
      // _renderValidatedComponent) assume that calls to render aren't nested;
      // verify that that's the case. (This is called by each top-level update
      // function, like setState, forceUpdate, etc.; creation and
      // destruction of top-level components is guarded in ReactMount.)

      if (!batchingStrategy.isBatchingUpdates) {
        batchingStrategy.batchedUpdates(enqueueUpdate, component);
        return;
      }

      dirtyComponents.push(component);
      if (component._updateBatchNumber == null) {
        component._updateBatchNumber = updateBatchNumber + 1;
      }
    }

    /**
     * Enqueue a callback to be run at the end of the current batching cycle. Throws
     * if no updates are currently being performed.
     */
    function asap(callback, context) {
      !batchingStrategy.isBatchingUpdates ? process.env.NODE_ENV !== 'production' ? invariant$11(false, 'ReactUpdates.asap: Can\'t enqueue an asap callback in a context whereupdates are not being batched.') : _prodInvariant$10('125') : void 0;
      asapCallbackQueue.enqueue(callback, context);
      asapEnqueued = true;
    }

    var ReactUpdatesInjection = {
      injectReconcileTransaction: function injectReconcileTransaction(ReconcileTransaction) {
        !ReconcileTransaction ? process.env.NODE_ENV !== 'production' ? invariant$11(false, 'ReactUpdates: must provide a reconcile transaction class') : _prodInvariant$10('126') : void 0;
        ReactUpdates$2.ReactReconcileTransaction = ReconcileTransaction;
      },

      injectBatchingStrategy: function injectBatchingStrategy(_batchingStrategy) {
        !_batchingStrategy ? process.env.NODE_ENV !== 'production' ? invariant$11(false, 'ReactUpdates: must provide a batching strategy') : _prodInvariant$10('127') : void 0;
        !(typeof _batchingStrategy.batchedUpdates === 'function') ? process.env.NODE_ENV !== 'production' ? invariant$11(false, 'ReactUpdates: must provide a batchedUpdates() function') : _prodInvariant$10('128') : void 0;
        !(typeof _batchingStrategy.isBatchingUpdates === 'boolean') ? process.env.NODE_ENV !== 'production' ? invariant$11(false, 'ReactUpdates: must provide an isBatchingUpdates boolean attribute') : _prodInvariant$10('129') : void 0;
        batchingStrategy = _batchingStrategy;
      }
    };

    var ReactUpdates$2 = {
      /**
       * React references `ReactReconcileTransaction` using this property in order
       * to allow dependency injection.
       *
       * @internal
       */
      ReactReconcileTransaction: null,

      batchedUpdates: batchedUpdates$1,
      enqueueUpdate: enqueueUpdate,
      flushBatchedUpdates: flushBatchedUpdates,
      injection: ReactUpdatesInjection,
      asap: asap
    };

    var ReactUpdates_1 = ReactUpdates$2;

    var _assign$5 = index;

    var PooledClass$5 = PooledClass_1$2;

    var emptyFunction$4 = emptyFunction_1;
    var warning$14 = warning_1;

    var didWarnForAddedNewProperty = false;
    var isProxySupported = typeof Proxy === 'function';

    var shouldBeReleasedProperties = ['dispatchConfig', '_targetInst', 'nativeEvent', 'isDefaultPrevented', 'isPropagationStopped', '_dispatchListeners', '_dispatchInstances'];

    /**
     * @interface Event
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var EventInterface = {
      type: null,
      target: null,
      // currentTarget is set when dispatching; no use in copying it here
      currentTarget: emptyFunction$4.thatReturnsNull,
      eventPhase: null,
      bubbles: null,
      cancelable: null,
      timeStamp: function timeStamp(event) {
        return event.timeStamp || Date.now();
      },
      defaultPrevented: null,
      isTrusted: null
    };

    /**
     * Synthetic events are dispatched by event plugins, typically in response to a
     * top-level event delegation handler.
     *
     * These systems should generally use pooling to reduce the frequency of garbage
     * collection. The system should check `isPersistent` to determine whether the
     * event should be released into the pool after being dispatched. Users that
     * need a persisted event should invoke `persist`.
     *
     * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
     * normalizing browser quirks. Subclasses do not necessarily have to implement a
     * DOM interface; custom application-specific events can also subclass this.
     *
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {*} targetInst Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @param {DOMEventTarget} nativeEventTarget Target node.
     */
    function SyntheticEvent$1(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
      if (process.env.NODE_ENV !== 'production') {
        // these have a getter/setter for warnings
        delete this.nativeEvent;
        delete this.preventDefault;
        delete this.stopPropagation;
      }

      this.dispatchConfig = dispatchConfig;
      this._targetInst = targetInst;
      this.nativeEvent = nativeEvent;

      var Interface = this.constructor.Interface;
      for (var propName in Interface) {
        if (!Interface.hasOwnProperty(propName)) {
          continue;
        }
        if (process.env.NODE_ENV !== 'production') {
          delete this[propName]; // this has a getter/setter for warnings
        }
        var normalize = Interface[propName];
        if (normalize) {
          this[propName] = normalize(nativeEvent);
        } else {
          if (propName === 'target') {
            this.target = nativeEventTarget;
          } else {
            this[propName] = nativeEvent[propName];
          }
        }
      }

      var defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
      if (defaultPrevented) {
        this.isDefaultPrevented = emptyFunction$4.thatReturnsTrue;
      } else {
        this.isDefaultPrevented = emptyFunction$4.thatReturnsFalse;
      }
      this.isPropagationStopped = emptyFunction$4.thatReturnsFalse;
      return this;
    }

    _assign$5(SyntheticEvent$1.prototype, {

      preventDefault: function preventDefault() {
        this.defaultPrevented = true;
        var event = this.nativeEvent;
        if (!event) {
          return;
        }

        if (event.preventDefault) {
          event.preventDefault();
        } else if (typeof event.returnValue !== 'unknown') {
          // eslint-disable-line valid-typeof
          event.returnValue = false;
        }
        this.isDefaultPrevented = emptyFunction$4.thatReturnsTrue;
      },

      stopPropagation: function stopPropagation() {
        var event = this.nativeEvent;
        if (!event) {
          return;
        }

        if (event.stopPropagation) {
          event.stopPropagation();
        } else if (typeof event.cancelBubble !== 'unknown') {
          // eslint-disable-line valid-typeof
          // The ChangeEventPlugin registers a "propertychange" event for
          // IE. This event does not support bubbling or cancelling, and
          // any references to cancelBubble throw "Member not found".  A
          // typeof check of "unknown" circumvents this issue (and is also
          // IE specific).
          event.cancelBubble = true;
        }

        this.isPropagationStopped = emptyFunction$4.thatReturnsTrue;
      },

      /**
       * We release all dispatched `SyntheticEvent`s after each event loop, adding
       * them back into the pool. This allows a way to hold onto a reference that
       * won't be added back into the pool.
       */
      persist: function persist() {
        this.isPersistent = emptyFunction$4.thatReturnsTrue;
      },

      /**
       * Checks if this event should be released back into the pool.
       *
       * @return {boolean} True if this should not be released, false otherwise.
       */
      isPersistent: emptyFunction$4.thatReturnsFalse,

      /**
       * `PooledClass` looks for `destructor` on each instance it releases.
       */
      destructor: function destructor() {
        var Interface = this.constructor.Interface;
        for (var propName in Interface) {
          if (process.env.NODE_ENV !== 'production') {
            Object.defineProperty(this, propName, getPooledWarningPropertyDefinition(propName, Interface[propName]));
          } else {
            this[propName] = null;
          }
        }
        for (var i = 0; i < shouldBeReleasedProperties.length; i++) {
          this[shouldBeReleasedProperties[i]] = null;
        }
        if (process.env.NODE_ENV !== 'production') {
          Object.defineProperty(this, 'nativeEvent', getPooledWarningPropertyDefinition('nativeEvent', null));
          Object.defineProperty(this, 'preventDefault', getPooledWarningPropertyDefinition('preventDefault', emptyFunction$4));
          Object.defineProperty(this, 'stopPropagation', getPooledWarningPropertyDefinition('stopPropagation', emptyFunction$4));
        }
      }

    });

    SyntheticEvent$1.Interface = EventInterface;

    if (process.env.NODE_ENV !== 'production') {
      if (isProxySupported) {
        /*eslint-disable no-func-assign */
        SyntheticEvent$1 = new Proxy(SyntheticEvent$1, {
          construct: function construct(target, args) {
            return this.apply(target, Object.create(target.prototype), args);
          },
          apply: function apply(constructor, that, args) {
            return new Proxy(constructor.apply(that, args), {
              set: function set(target, prop, value) {
                if (prop !== 'isPersistent' && !target.constructor.Interface.hasOwnProperty(prop) && shouldBeReleasedProperties.indexOf(prop) === -1) {
                  process.env.NODE_ENV !== 'production' ? warning$14(didWarnForAddedNewProperty || target.isPersistent(), 'This synthetic event is reused for performance reasons. If you\'re ' + 'seeing this, you\'re adding a new property in the synthetic event object. ' + 'The property is never released. See ' + 'https://fb.me/react-event-pooling for more information.') : void 0;
                  didWarnForAddedNewProperty = true;
                }
                target[prop] = value;
                return true;
              }
            });
          }
        });
        /*eslint-enable no-func-assign */
      }
    }
    /**
     * Helper to reduce boilerplate when creating subclasses.
     *
     * @param {function} Class
     * @param {?object} Interface
     */
    SyntheticEvent$1.augmentClass = function (Class, Interface) {
      var Super = this;

      var E = function E() {};
      E.prototype = Super.prototype;
      var prototype = new E();

      _assign$5(prototype, Class.prototype);
      Class.prototype = prototype;
      Class.prototype.constructor = Class;

      Class.Interface = _assign$5({}, Super.Interface, Interface);
      Class.augmentClass = Super.augmentClass;

      PooledClass$5.addPoolingTo(Class, PooledClass$5.fourArgumentPooler);
    };

    PooledClass$5.addPoolingTo(SyntheticEvent$1, PooledClass$5.fourArgumentPooler);

    var SyntheticEvent_1 = SyntheticEvent$1;

    /**
      * Helper to nullify syntheticEvent instance properties when destructing
      *
      * @param {object} SyntheticEvent
      * @param {String} propName
      * @return {object} defineProperty object
      */
    function getPooledWarningPropertyDefinition(propName, getVal) {
      var isFunction = typeof getVal === 'function';
      return {
        configurable: true,
        set: set,
        get: get
      };

      function set(val) {
        var action = isFunction ? 'setting the method' : 'setting the property';
        warn(action, 'This is effectively a no-op');
        return val;
      }

      function get() {
        var action = isFunction ? 'accessing the method' : 'accessing the property';
        var result = isFunction ? 'This is a no-op function' : 'This is set to null';
        warn(action, result);
        return getVal;
      }

      function warn(action, result) {
        var warningCondition = false;
        process.env.NODE_ENV !== 'production' ? warning$14(warningCondition, 'This synthetic event is reused for performance reasons. If you\'re seeing this, ' + 'you\'re %s `%s` on a released/nullified synthetic event. %s. ' + 'If you must keep the original synthetic event around, use event.persist(). ' + 'See https://fb.me/react-event-pooling for more information.', action, propName, result) : void 0;
      }
    }

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /**
     * Gets the target node from a native browser event by accounting for
     * inconsistencies in browser DOM APIs.
     *
     * @param {object} nativeEvent Native browser event.
     * @return {DOMEventTarget} Target node.
     */

    function getEventTarget$1(nativeEvent) {
      var target = nativeEvent.target || nativeEvent.srcElement || window;

      // Normalize SVG <use> element events #4963
      if (target.correspondingUseElement) {
        target = target.correspondingUseElement;
      }

      // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
      // @see http://www.quirksmode.org/js/events_properties.html
      return target.nodeType === 3 ? target.parentNode : target;
    }

    var getEventTarget_1 = getEventTarget$1;

    var ExecutionEnvironment$5 = ExecutionEnvironment_1;

    var useHasFeature;
    if (ExecutionEnvironment$5.canUseDOM) {
      useHasFeature = document.implementation && document.implementation.hasFeature &&
      // always returns true in newer browsers as per the standard.
      // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
      document.implementation.hasFeature('', '') !== true;
    }

    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @param {?boolean} capture Check if the capture phase is supported.
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function isEventSupported$1(eventNameSuffix, capture) {
      if (!ExecutionEnvironment$5.canUseDOM || capture && !('addEventListener' in document)) {
        return false;
      }

      var eventName = 'on' + eventNameSuffix;
      var isSupported = eventName in document;

      if (!isSupported) {
        var element = document.createElement('div');
        element.setAttribute(eventName, 'return;');
        isSupported = typeof element[eventName] === 'function';
      }

      if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
        // This is the only way to test support for the `wheel` event in IE9+.
        isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
      }

      return isSupported;
    }

    var isEventSupported_1 = isEventSupported$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    /**
     * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
     */

    var supportedInputTypes = {
      'color': true,
      'date': true,
      'datetime': true,
      'datetime-local': true,
      'email': true,
      'month': true,
      'number': true,
      'password': true,
      'range': true,
      'search': true,
      'tel': true,
      'text': true,
      'time': true,
      'url': true,
      'week': true
    };

    function isTextInputElement$1(elem) {
      var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();

      if (nodeName === 'input') {
        return !!supportedInputTypes[elem.type];
      }

      if (nodeName === 'textarea') {
        return true;
      }

      return false;
    }

    var isTextInputElement_1 = isTextInputElement$1;

    var EventPluginHub = require$$0$5;
    var EventPropagators$1 = EventPropagators_1;
    var ExecutionEnvironment$2 = ExecutionEnvironment_1;
    var ReactDOMComponentTree$3 = ReactDOMComponentTree_1;
    var ReactUpdates$1 = ReactUpdates_1;
    var SyntheticEvent = SyntheticEvent_1;

    var getEventTarget = getEventTarget_1;
    var isEventSupported = isEventSupported_1;
    var isTextInputElement = isTextInputElement_1;

    var eventTypes$1 = {
      change: {
        phasedRegistrationNames: {
          bubbled: 'onChange',
          captured: 'onChangeCapture'
        },
        dependencies: ['topBlur', 'topChange', 'topClick', 'topFocus', 'topInput', 'topKeyDown', 'topKeyUp', 'topSelectionChange']
      }
    };

    /**
     * For IE shims
     */
    var activeElement = null;
    var activeElementInst = null;
    var activeElementValue = null;
    var activeElementValueProp = null;

    /**
     * SECTION: handle `change` event
     */
    function shouldUseChangeEvent(elem) {
      var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
      return nodeName === 'select' || nodeName === 'input' && elem.type === 'file';
    }

    var doesChangeEventBubble = false;
    if (ExecutionEnvironment$2.canUseDOM) {
      // See `handleChange` comment below
      doesChangeEventBubble = isEventSupported('change') && (!document.documentMode || document.documentMode > 8);
    }

    function manualDispatchChangeEvent(nativeEvent) {
      var event = SyntheticEvent.getPooled(eventTypes$1.change, activeElementInst, nativeEvent, getEventTarget(nativeEvent));
      EventPropagators$1.accumulateTwoPhaseDispatches(event);

      // If change and propertychange bubbled, we'd just bind to it like all the
      // other events and have it go through ReactBrowserEventEmitter. Since it
      // doesn't, we manually listen for the events and so we have to enqueue and
      // process the abstract event manually.
      //
      // Batching is necessary here in order to ensure that all event handlers run
      // before the next rerender (including event handlers attached to ancestor
      // elements instead of directly on the input). Without this, controlled
      // components don't work properly in conjunction with event bubbling because
      // the component is rerendered and the value reverted before all the event
      // handlers can run. See https://github.com/facebook/react/issues/708.
      ReactUpdates$1.batchedUpdates(runEventInBatch, event);
    }

    function runEventInBatch(event) {
      EventPluginHub.enqueueEvents(event);
      EventPluginHub.processEventQueue(false);
    }

    function startWatchingForChangeEventIE8(target, targetInst) {
      activeElement = target;
      activeElementInst = targetInst;
      activeElement.attachEvent('onchange', manualDispatchChangeEvent);
    }

    function stopWatchingForChangeEventIE8() {
      if (!activeElement) {
        return;
      }
      activeElement.detachEvent('onchange', manualDispatchChangeEvent);
      activeElement = null;
      activeElementInst = null;
    }

    function getTargetInstForChangeEvent(topLevelType, targetInst) {
      if (topLevelType === 'topChange') {
        return targetInst;
      }
    }
    function handleEventsForChangeEventIE8(topLevelType, target, targetInst) {
      if (topLevelType === 'topFocus') {
        // stopWatching() should be a noop here but we call it just in case we
        // missed a blur event somehow.
        stopWatchingForChangeEventIE8();
        startWatchingForChangeEventIE8(target, targetInst);
      } else if (topLevelType === 'topBlur') {
        stopWatchingForChangeEventIE8();
      }
    }

    /**
     * SECTION: handle `input` event
     */
    var isInputEventSupported = false;
    if (ExecutionEnvironment$2.canUseDOM) {
      // IE9 claims to support the input event but fails to trigger it when
      // deleting text, so we ignore its input events.
      // IE10+ fire input events to often, such when a placeholder
      // changes or when an input with a placeholder is focused.
      isInputEventSupported = isEventSupported('input') && (!document.documentMode || document.documentMode > 11);
    }

    /**
     * (For IE <=11) Replacement getter/setter for the `value` property that gets
     * set on the active element.
     */
    var newValueProp = {
      get: function get() {
        return activeElementValueProp.get.call(this);
      },
      set: function set(val) {
        // Cast to a string so we can do equality checks.
        activeElementValue = '' + val;
        activeElementValueProp.set.call(this, val);
      }
    };

    /**
     * (For IE <=11) Starts tracking propertychange events on the passed-in element
     * and override the value property so that we can distinguish user events from
     * value changes in JS.
     */
    function startWatchingForValueChange(target, targetInst) {
      activeElement = target;
      activeElementInst = targetInst;
      activeElementValue = target.value;
      activeElementValueProp = Object.getOwnPropertyDescriptor(target.constructor.prototype, 'value');

      // Not guarded in a canDefineProperty check: IE8 supports defineProperty only
      // on DOM elements
      Object.defineProperty(activeElement, 'value', newValueProp);
      if (activeElement.attachEvent) {
        activeElement.attachEvent('onpropertychange', handlePropertyChange);
      } else {
        activeElement.addEventListener('propertychange', handlePropertyChange, false);
      }
    }

    /**
     * (For IE <=11) Removes the event listeners from the currently-tracked element,
     * if any exists.
     */
    function stopWatchingForValueChange() {
      if (!activeElement) {
        return;
      }

      // delete restores the original property definition
      delete activeElement.value;

      if (activeElement.detachEvent) {
        activeElement.detachEvent('onpropertychange', handlePropertyChange);
      } else {
        activeElement.removeEventListener('propertychange', handlePropertyChange, false);
      }

      activeElement = null;
      activeElementInst = null;
      activeElementValue = null;
      activeElementValueProp = null;
    }

    /**
     * (For IE <=11) Handles a propertychange event, sending a `change` event if
     * the value of the active element has changed.
     */
    function handlePropertyChange(nativeEvent) {
      if (nativeEvent.propertyName !== 'value') {
        return;
      }
      var value = nativeEvent.srcElement.value;
      if (value === activeElementValue) {
        return;
      }
      activeElementValue = value;

      manualDispatchChangeEvent(nativeEvent);
    }

    /**
     * If a `change` event should be fired, returns the target's ID.
     */
    function getTargetInstForInputEvent(topLevelType, targetInst) {
      if (topLevelType === 'topInput') {
        // In modern browsers (i.e., not IE8 or IE9), the input event is exactly
        // what we want so fall through here and trigger an abstract event
        return targetInst;
      }
    }

    function handleEventsForInputEventIE(topLevelType, target, targetInst) {
      if (topLevelType === 'topFocus') {
        // In IE8, we can capture almost all .value changes by adding a
        // propertychange handler and looking for events with propertyName
        // equal to 'value'
        // In IE9-11, propertychange fires for most input events but is buggy and
        // doesn't fire when text is deleted, but conveniently, selectionchange
        // appears to fire in all of the remaining cases so we catch those and
        // forward the event if the value has changed
        // In either case, we don't want to call the event handler if the value
        // is changed from JS so we redefine a setter for `.value` that updates
        // our activeElementValue variable, allowing us to ignore those changes
        //
        // stopWatching() should be a noop here but we call it just in case we
        // missed a blur event somehow.
        stopWatchingForValueChange();
        startWatchingForValueChange(target, targetInst);
      } else if (topLevelType === 'topBlur') {
        stopWatchingForValueChange();
      }
    }

    // For IE8 and IE9.
    function getTargetInstForInputEventIE(topLevelType, targetInst) {
      if (topLevelType === 'topSelectionChange' || topLevelType === 'topKeyUp' || topLevelType === 'topKeyDown') {
        // On the selectionchange event, the target is just document which isn't
        // helpful for us so just check activeElement instead.
        //
        // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
        // propertychange on the first input event after setting `value` from a
        // script and fires only keydown, keypress, keyup. Catching keyup usually
        // gets it and catching keydown lets us fire an event for the first
        // keystroke if user does a key repeat (it'll be a little delayed: right
        // before the second keystroke). Other input methods (e.g., paste) seem to
        // fire selectionchange normally.
        if (activeElement && activeElement.value !== activeElementValue) {
          activeElementValue = activeElement.value;
          return activeElementInst;
        }
      }
    }

    /**
     * SECTION: handle `click` event
     */
    function shouldUseClickEvent(elem) {
      // Use the `click` event to detect changes to checkbox and radio inputs.
      // This approach works across all browsers, whereas `change` does not fire
      // until `blur` in IE8.
      return elem.nodeName && elem.nodeName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio');
    }

    function getTargetInstForClickEvent(topLevelType, targetInst) {
      if (topLevelType === 'topClick') {
        return targetInst;
      }
    }

    /**
     * This plugin creates an `onChange` event that normalizes change events
     * across form elements. This event fires at a time when it's possible to
     * change the element's value without seeing a flicker.
     *
     * Supported elements are:
     * - input (see `isTextInputElement`)
     * - textarea
     * - select
     */
    var ChangeEventPlugin$1 = {

      eventTypes: eventTypes$1,

      extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var targetNode = targetInst ? ReactDOMComponentTree$3.getNodeFromInstance(targetInst) : window;

        var getTargetInstFunc, handleEventFunc;
        if (shouldUseChangeEvent(targetNode)) {
          if (doesChangeEventBubble) {
            getTargetInstFunc = getTargetInstForChangeEvent;
          } else {
            handleEventFunc = handleEventsForChangeEventIE8;
          }
        } else if (isTextInputElement(targetNode)) {
          if (isInputEventSupported) {
            getTargetInstFunc = getTargetInstForInputEvent;
          } else {
            getTargetInstFunc = getTargetInstForInputEventIE;
            handleEventFunc = handleEventsForInputEventIE;
          }
        } else if (shouldUseClickEvent(targetNode)) {
          getTargetInstFunc = getTargetInstForClickEvent;
        }

        if (getTargetInstFunc) {
          var inst = getTargetInstFunc(topLevelType, targetInst);
          if (inst) {
            var event = SyntheticEvent.getPooled(eventTypes$1.change, inst, nativeEvent, nativeEventTarget);
            event.type = 'change';
            EventPropagators$1.accumulateTwoPhaseDispatches(event);
            return event;
          }
        }

        if (handleEventFunc) {
          handleEventFunc(topLevelType, targetNode, targetInst);
        }
      }

    };

    var ChangeEventPlugin_1 = ChangeEventPlugin$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /**
     * Module that is injectable into `EventPluginHub`, that specifies a
     * deterministic ordering of `EventPlugin`s. A convenient way to reason about
     * plugins, without having to package every one of them. This is better than
     * having plugins be ordered in the same order that they are injected because
     * that ordering would be influenced by the packaging order.
     * `ResponderEventPlugin` must occur before `SimpleEventPlugin` so that
     * preventing default on events is convenient in `SimpleEventPlugin` handlers.
     */

    var DefaultEventPluginOrder$1 = ['ResponderEventPlugin', 'SimpleEventPlugin', 'TapEventPlugin', 'EnterLeaveEventPlugin', 'ChangeEventPlugin', 'SelectEventPlugin', 'BeforeInputEventPlugin'];

    var DefaultEventPluginOrder_1 = DefaultEventPluginOrder$1;

    var SyntheticEvent$2 = SyntheticEvent_1;

    var getEventTarget$2 = getEventTarget_1;

    /**
     * @interface UIEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var UIEventInterface = {
      view: function view(event) {
        if (event.view) {
          return event.view;
        }

        var target = getEventTarget$2(event);
        if (target.window === target) {
          // target is a window object
          return target;
        }

        var doc = target.ownerDocument;
        // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
        if (doc) {
          return doc.defaultView || doc.parentWindow;
        } else {
          return window;
        }
      },
      detail: function detail(event) {
        return event.detail || 0;
      }
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticEvent}
     */
    function SyntheticUIEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticEvent$2.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$2.augmentClass(SyntheticUIEvent$1, UIEventInterface);

    var SyntheticUIEvent_1 = SyntheticUIEvent$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var ViewportMetrics$1 = {

      currentScrollLeft: 0,

      currentScrollTop: 0,

      refreshScrollValues: function refreshScrollValues(scrollPosition) {
        ViewportMetrics$1.currentScrollLeft = scrollPosition.x;
        ViewportMetrics$1.currentScrollTop = scrollPosition.y;
      }

    };

    var ViewportMetrics_1 = ViewportMetrics$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /**
     * Translation from modifier key to the associated property in the event.
     * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
     */

    var modifierKeyToProp = {
      'Alt': 'altKey',
      'Control': 'ctrlKey',
      'Meta': 'metaKey',
      'Shift': 'shiftKey'
    };

    // IE8 does not implement getModifierState so we simply map it to the only
    // modifier keys exposed by the event itself, does not support Lock-keys.
    // Currently, all major browsers except Chrome seems to support Lock-keys.
    function modifierStateGetter(keyArg) {
      var syntheticEvent = this;
      var nativeEvent = syntheticEvent.nativeEvent;
      if (nativeEvent.getModifierState) {
        return nativeEvent.getModifierState(keyArg);
      }
      var keyProp = modifierKeyToProp[keyArg];
      return keyProp ? !!nativeEvent[keyProp] : false;
    }

    function getEventModifierState$1(nativeEvent) {
      return modifierStateGetter;
    }

    var getEventModifierState_1 = getEventModifierState$1;

    var SyntheticUIEvent = SyntheticUIEvent_1;
    var ViewportMetrics = ViewportMetrics_1;

    var getEventModifierState = getEventModifierState_1;

    /**
     * @interface MouseEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var MouseEventInterface = {
      screenX: null,
      screenY: null,
      clientX: null,
      clientY: null,
      ctrlKey: null,
      shiftKey: null,
      altKey: null,
      metaKey: null,
      getModifierState: getEventModifierState,
      button: function button(event) {
        // Webkit, Firefox, IE9+
        // which:  1 2 3
        // button: 0 1 2 (standard)
        var button = event.button;
        if ('which' in event) {
          return button;
        }
        // IE<9
        // which:  undefined
        // button: 0 0 0
        // button: 1 4 2 (onmouseup)
        return button === 2 ? 2 : button === 4 ? 1 : 0;
      },
      buttons: null,
      relatedTarget: function relatedTarget(event) {
        return event.relatedTarget || (event.fromElement === event.srcElement ? event.toElement : event.fromElement);
      },
      // "Proprietary" Interface.
      pageX: function pageX(event) {
        return 'pageX' in event ? event.pageX : event.clientX + ViewportMetrics.currentScrollLeft;
      },
      pageY: function pageY(event) {
        return 'pageY' in event ? event.pageY : event.clientY + ViewportMetrics.currentScrollTop;
      }
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticMouseEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticUIEvent.augmentClass(SyntheticMouseEvent$1, MouseEventInterface);

    var SyntheticMouseEvent_1 = SyntheticMouseEvent$1;

    var EventPropagators$3 = EventPropagators_1;
    var ReactDOMComponentTree$4 = ReactDOMComponentTree_1;
    var SyntheticMouseEvent = SyntheticMouseEvent_1;

    var eventTypes$2 = {
      mouseEnter: {
        registrationName: 'onMouseEnter',
        dependencies: ['topMouseOut', 'topMouseOver']
      },
      mouseLeave: {
        registrationName: 'onMouseLeave',
        dependencies: ['topMouseOut', 'topMouseOver']
      }
    };

    var EnterLeaveEventPlugin$1 = {

      eventTypes: eventTypes$2,

      /**
       * For almost every interaction we care about, there will be both a top-level
       * `mouseover` and `mouseout` event that occurs. Only use `mouseout` so that
       * we do not extract duplicate events. However, moving the mouse into the
       * browser from outside will not fire a `mouseout` event. In this case, we use
       * the `mouseover` top-level event.
       */
      extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        if (topLevelType === 'topMouseOver' && (nativeEvent.relatedTarget || nativeEvent.fromElement)) {
          return null;
        }
        if (topLevelType !== 'topMouseOut' && topLevelType !== 'topMouseOver') {
          // Must not be a mouse in or mouse out - ignoring.
          return null;
        }

        var win;
        if (nativeEventTarget.window === nativeEventTarget) {
          // `nativeEventTarget` is probably a window object.
          win = nativeEventTarget;
        } else {
          // TODO: Figure out why `ownerDocument` is sometimes undefined in IE8.
          var doc = nativeEventTarget.ownerDocument;
          if (doc) {
            win = doc.defaultView || doc.parentWindow;
          } else {
            win = window;
          }
        }

        var from;
        var to;
        if (topLevelType === 'topMouseOut') {
          from = targetInst;
          var related = nativeEvent.relatedTarget || nativeEvent.toElement;
          to = related ? ReactDOMComponentTree$4.getClosestInstanceFromNode(related) : null;
        } else {
          // Moving to a node from outside the window.
          from = null;
          to = targetInst;
        }

        if (from === to) {
          // Nothing pertains to our managed components.
          return null;
        }

        var fromNode = from == null ? win : ReactDOMComponentTree$4.getNodeFromInstance(from);
        var toNode = to == null ? win : ReactDOMComponentTree$4.getNodeFromInstance(to);

        var leave = SyntheticMouseEvent.getPooled(eventTypes$2.mouseLeave, from, nativeEvent, nativeEventTarget);
        leave.type = 'mouseleave';
        leave.target = fromNode;
        leave.relatedTarget = toNode;

        var enter = SyntheticMouseEvent.getPooled(eventTypes$2.mouseEnter, to, nativeEvent, nativeEventTarget);
        enter.type = 'mouseenter';
        enter.target = toNode;
        enter.relatedTarget = fromNode;

        EventPropagators$3.accumulateEnterLeaveDispatches(leave, enter, from, to);

        return [leave, enter];
      }

    };

    var EnterLeaveEventPlugin_1 = EnterLeaveEventPlugin$1;

    var DOMProperty$2 = DOMProperty_1;

    var MUST_USE_PROPERTY = DOMProperty$2.injection.MUST_USE_PROPERTY;
    var HAS_BOOLEAN_VALUE = DOMProperty$2.injection.HAS_BOOLEAN_VALUE;
    var HAS_NUMERIC_VALUE = DOMProperty$2.injection.HAS_NUMERIC_VALUE;
    var HAS_POSITIVE_NUMERIC_VALUE = DOMProperty$2.injection.HAS_POSITIVE_NUMERIC_VALUE;
    var HAS_OVERLOADED_BOOLEAN_VALUE = DOMProperty$2.injection.HAS_OVERLOADED_BOOLEAN_VALUE;

    var HTMLDOMPropertyConfig$1 = {
      isCustomAttribute: RegExp.prototype.test.bind(new RegExp('^(data|aria)-[' + DOMProperty$2.ATTRIBUTE_NAME_CHAR + ']*$')),
      Properties: {
        /**
         * Standard Properties
         */
        accept: 0,
        acceptCharset: 0,
        accessKey: 0,
        action: 0,
        allowFullScreen: HAS_BOOLEAN_VALUE,
        allowTransparency: 0,
        alt: 0,
        // specifies target context for links with `preload` type
        as: 0,
        async: HAS_BOOLEAN_VALUE,
        autoComplete: 0,
        // autoFocus is polyfilled/normalized by AutoFocusUtils
        // autoFocus: HAS_BOOLEAN_VALUE,
        autoPlay: HAS_BOOLEAN_VALUE,
        capture: HAS_BOOLEAN_VALUE,
        cellPadding: 0,
        cellSpacing: 0,
        charSet: 0,
        challenge: 0,
        checked: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
        cite: 0,
        classID: 0,
        className: 0,
        cols: HAS_POSITIVE_NUMERIC_VALUE,
        colSpan: 0,
        content: 0,
        contentEditable: 0,
        contextMenu: 0,
        controls: HAS_BOOLEAN_VALUE,
        coords: 0,
        crossOrigin: 0,
        data: 0, // For `<object />` acts as `src`.
        dateTime: 0,
        'default': HAS_BOOLEAN_VALUE,
        defer: HAS_BOOLEAN_VALUE,
        dir: 0,
        disabled: HAS_BOOLEAN_VALUE,
        download: HAS_OVERLOADED_BOOLEAN_VALUE,
        draggable: 0,
        encType: 0,
        form: 0,
        formAction: 0,
        formEncType: 0,
        formMethod: 0,
        formNoValidate: HAS_BOOLEAN_VALUE,
        formTarget: 0,
        frameBorder: 0,
        headers: 0,
        height: 0,
        hidden: HAS_BOOLEAN_VALUE,
        high: 0,
        href: 0,
        hrefLang: 0,
        htmlFor: 0,
        httpEquiv: 0,
        icon: 0,
        id: 0,
        inputMode: 0,
        integrity: 0,
        is: 0,
        keyParams: 0,
        keyType: 0,
        kind: 0,
        label: 0,
        lang: 0,
        list: 0,
        loop: HAS_BOOLEAN_VALUE,
        low: 0,
        manifest: 0,
        marginHeight: 0,
        marginWidth: 0,
        max: 0,
        maxLength: 0,
        media: 0,
        mediaGroup: 0,
        method: 0,
        min: 0,
        minLength: 0,
        // Caution; `option.selected` is not updated if `select.multiple` is
        // disabled with `removeAttribute`.
        multiple: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
        muted: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
        name: 0,
        nonce: 0,
        noValidate: HAS_BOOLEAN_VALUE,
        open: HAS_BOOLEAN_VALUE,
        optimum: 0,
        pattern: 0,
        placeholder: 0,
        playsInline: HAS_BOOLEAN_VALUE,
        poster: 0,
        preload: 0,
        profile: 0,
        radioGroup: 0,
        readOnly: HAS_BOOLEAN_VALUE,
        referrerPolicy: 0,
        rel: 0,
        required: HAS_BOOLEAN_VALUE,
        reversed: HAS_BOOLEAN_VALUE,
        role: 0,
        rows: HAS_POSITIVE_NUMERIC_VALUE,
        rowSpan: HAS_NUMERIC_VALUE,
        sandbox: 0,
        scope: 0,
        scoped: HAS_BOOLEAN_VALUE,
        scrolling: 0,
        seamless: HAS_BOOLEAN_VALUE,
        selected: MUST_USE_PROPERTY | HAS_BOOLEAN_VALUE,
        shape: 0,
        size: HAS_POSITIVE_NUMERIC_VALUE,
        sizes: 0,
        span: HAS_POSITIVE_NUMERIC_VALUE,
        spellCheck: 0,
        src: 0,
        srcDoc: 0,
        srcLang: 0,
        srcSet: 0,
        start: HAS_NUMERIC_VALUE,
        step: 0,
        style: 0,
        summary: 0,
        tabIndex: 0,
        target: 0,
        title: 0,
        // Setting .type throws on non-<input> tags
        type: 0,
        useMap: 0,
        value: 0,
        width: 0,
        wmode: 0,
        wrap: 0,

        /**
         * RDFa Properties
         */
        about: 0,
        datatype: 0,
        inlist: 0,
        prefix: 0,
        // property is also supported for OpenGraph in meta tags.
        property: 0,
        resource: 0,
        'typeof': 0,
        vocab: 0,

        /**
         * Non-standard Properties
         */
        // autoCapitalize and autoCorrect are supported in Mobile Safari for
        // keyboard hints.
        autoCapitalize: 0,
        autoCorrect: 0,
        // autoSave allows WebKit/Blink to persist values of input fields on page reloads
        autoSave: 0,
        // color is for Safari mask-icon link
        color: 0,
        // itemProp, itemScope, itemType are for
        // Microdata support. See http://schema.org/docs/gs.html
        itemProp: 0,
        itemScope: HAS_BOOLEAN_VALUE,
        itemType: 0,
        // itemID and itemRef are for Microdata support as well but
        // only specified in the WHATWG spec document. See
        // https://html.spec.whatwg.org/multipage/microdata.html#microdata-dom-api
        itemID: 0,
        itemRef: 0,
        // results show looking glass icon and recent searches on input
        // search fields in WebKit/Blink
        results: 0,
        // IE-only attribute that specifies security restrictions on an iframe
        // as an alternative to the sandbox attribute on IE<10
        security: 0,
        // IE-only attribute that controls focus behavior
        unselectable: 0
      },
      DOMAttributeNames: {
        acceptCharset: 'accept-charset',
        className: 'class',
        htmlFor: 'for',
        httpEquiv: 'http-equiv'
      },
      DOMPropertyNames: {}
    };

    var HTMLDOMPropertyConfig_1 = HTMLDOMPropertyConfig$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var DOMNamespaces$1 = {
      html: 'http://www.w3.org/1999/xhtml',
      mathml: 'http://www.w3.org/1998/Math/MathML',
      svg: 'http://www.w3.org/2000/svg'
    };

    var DOMNamespaces_1 = DOMNamespaces$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /* globals MSApp */

    /**
     * Create a function which has 'unsafe' privileges (required by windows8 apps)
     */

    var createMicrosoftUnsafeLocalFunction$3 = function createMicrosoftUnsafeLocalFunction$3(func) {
      if (typeof MSApp !== 'undefined' && MSApp.execUnsafeLocalFunction) {
        return function (arg0, arg1, arg2, arg3) {
          MSApp.execUnsafeLocalFunction(function () {
            return func(arg0, arg1, arg2, arg3);
          });
        };
      } else {
        return func;
      }
    };

    var createMicrosoftUnsafeLocalFunction_1 = createMicrosoftUnsafeLocalFunction$3;

    var ExecutionEnvironment$6 = ExecutionEnvironment_1;
    var DOMNamespaces$2 = DOMNamespaces_1;

    var WHITESPACE_TEST = /^[ \r\n\t\f]/;
    var NONVISIBLE_TEST = /<(!--|link|noscript|meta|script|style)[ \r\n\t\f\/>]/;

    var createMicrosoftUnsafeLocalFunction$2 = createMicrosoftUnsafeLocalFunction_1;

    // SVG temp container for IE lacking innerHTML
    var reusableSVGContainer;

    /**
     * Set the innerHTML property of a node, ensuring that whitespace is preserved
     * even in IE8.
     *
     * @param {DOMElement} node
     * @param {string} html
     * @internal
     */
    var setInnerHTML$2 = createMicrosoftUnsafeLocalFunction$2(function (node, html) {
      // IE does not have innerHTML for SVG nodes, so instead we inject the
      // new markup in a temp node and then move the child nodes across into
      // the target node
      if (node.namespaceURI === DOMNamespaces$2.svg && !('innerHTML' in node)) {
        reusableSVGContainer = reusableSVGContainer || document.createElement('div');
        reusableSVGContainer.innerHTML = '<svg>' + html + '</svg>';
        var svgNode = reusableSVGContainer.firstChild;
        while (svgNode.firstChild) {
          node.appendChild(svgNode.firstChild);
        }
      } else {
        node.innerHTML = html;
      }
    });

    if (ExecutionEnvironment$6.canUseDOM) {
      // IE8: When updating a just created node with innerHTML only leading
      // whitespace is removed. When updating an existing node with innerHTML
      // whitespace in root TextNodes is also collapsed.
      // @see quirksmode.org/bugreports/archives/2004/11/innerhtml_and_t.html

      // Feature detection; only IE8 is known to behave improperly like this.
      var testElement = document.createElement('div');
      testElement.innerHTML = ' ';
      if (testElement.innerHTML === '') {
        setInnerHTML$2 = function setInnerHTML$2(node, html) {
          // Magic theory: IE8 supposedly differentiates between added and updated
          // nodes when processing innerHTML, innerHTML on updated nodes suffers
          // from worse whitespace behavior. Re-adding a node like this triggers
          // the initial and more favorable whitespace behavior.
          // TODO: What to do on a detached node?
          if (node.parentNode) {
            node.parentNode.replaceChild(node, node);
          }

          // We also implement a workaround for non-visible tags disappearing into
          // thin air on IE8, this only happens if there is no visible text
          // in-front of the non-visible tags. Piggyback on the whitespace fix
          // and simply check if any non-visible tags appear in the source.
          if (WHITESPACE_TEST.test(html) || html[0] === '<' && NONVISIBLE_TEST.test(html)) {
            // Recover leading whitespace by temporarily prepending any character.
            // \uFEFF has the potential advantage of being zero-width/invisible.
            // UglifyJS drops U+FEFF chars when parsing, so use String.fromCharCode
            // in hopes that this is preserved even if "\uFEFF" is transformed to
            // the actual Unicode character (by Babel, for example).
            // https://github.com/mishoo/UglifyJS2/blob/v2.4.20/lib/parse.js#L216
            node.innerHTML = String.fromCharCode(0xFEFF) + html;

            // deleteData leaves an empty `TextNode` which offsets the index of all
            // children. Definitely want to avoid this.
            var textNode = node.firstChild;
            if (textNode.data.length === 1) {
              node.removeChild(textNode);
            } else {
              textNode.deleteData(0, 1);
            }
          } else {
            node.innerHTML = html;
          }
        };
      }
      testElement = null;
    }

    var setInnerHTML_1 = setInnerHTML$2;

    /**
     * Copyright 2016-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * Based on the escape-html library, which is used under the MIT License below:
     *
     * Copyright (c) 2012-2013 TJ Holowaychuk
     * Copyright (c) 2015 Andreas Lubbe
     * Copyright (c) 2015 Tiancheng "Timothy" Gu
     *
     * Permission is hereby granted, free of charge, to any person obtaining
     * a copy of this software and associated documentation files (the
     * 'Software'), to deal in the Software without restriction, including
     * without limitation the rights to use, copy, modify, merge, publish,
     * distribute, sublicense, and/or sell copies of the Software, and to
     * permit persons to whom the Software is furnished to do so, subject to
     * the following conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
     * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
     * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
     * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
     * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
     * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
     *
     */

    // code copied and modified from escape-html
    /**
     * Module variables.
     * @private
     */

    var matchHtmlRegExp = /["'&<>]/;

    /**
     * Escape special characters in the given string of html.
     *
     * @param  {string} string The string to escape for inserting into HTML
     * @return {string}
     * @public
     */

    function escapeHtml(string) {
      var str = '' + string;
      var match = matchHtmlRegExp.exec(str);

      if (!match) {
        return str;
      }

      var escape;
      var html = '';
      var index = 0;
      var lastIndex = 0;

      for (index = match.index; index < str.length; index++) {
        switch (str.charCodeAt(index)) {
          case 34:
            // "
            escape = '&quot;';
            break;
          case 38:
            // &
            escape = '&amp;';
            break;
          case 39:
            // '
            escape = '&#x27;'; // modified from escape-html; used to be '&#39'
            break;
          case 60:
            // <
            escape = '&lt;';
            break;
          case 62:
            // >
            escape = '&gt;';
            break;
          default:
            continue;
        }

        if (lastIndex !== index) {
          html += str.substring(lastIndex, index);
        }

        lastIndex = index + 1;
        html += escape;
      }

      return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
    }
    // end code copied and modified from escape-html


    /**
     * Escapes text to prevent scripting attacks.
     *
     * @param {*} text Text value to escape.
     * @return {string} An escaped string.
     */
    function escapeTextContentForBrowser$1(text) {
      if (typeof text === 'boolean' || typeof text === 'number') {
        // this shortcircuit helps perf for types that we know will never have
        // special characters, especially given that this function is used often
        // for numeric dom ids.
        return '' + text;
      }
      return escapeHtml(text);
    }

    var escapeTextContentForBrowser_1 = escapeTextContentForBrowser$1;

    var ExecutionEnvironment$7 = ExecutionEnvironment_1;
    var escapeTextContentForBrowser = escapeTextContentForBrowser_1;
    var setInnerHTML$3 = setInnerHTML_1;

    /**
     * Set the textContent property of a node, ensuring that whitespace is preserved
     * even in IE8. innerText is a poor substitute for textContent and, among many
     * issues, inserts <br> instead of the literal newline chars. innerHTML behaves
     * as it should.
     *
     * @param {DOMElement} node
     * @param {string} text
     * @internal
     */
    var setTextContent$2 = function setTextContent$2(node, text) {
      if (text) {
        var firstChild = node.firstChild;

        if (firstChild && firstChild === node.lastChild && firstChild.nodeType === 3) {
          firstChild.nodeValue = text;
          return;
        }
      }
      node.textContent = text;
    };

    if (ExecutionEnvironment$7.canUseDOM) {
      if (!('textContent' in document.documentElement)) {
        setTextContent$2 = function setTextContent$2(node, text) {
          if (node.nodeType === 3) {
            node.nodeValue = text;
            return;
          }
          setInnerHTML$3(node, escapeTextContentForBrowser(text));
        };
      }
    }

    var setTextContent_1 = setTextContent$2;

    var DOMNamespaces = DOMNamespaces_1;
    var setInnerHTML$1 = setInnerHTML_1;

    var createMicrosoftUnsafeLocalFunction$1 = createMicrosoftUnsafeLocalFunction_1;
    var setTextContent$1 = setTextContent_1;

    var ELEMENT_NODE_TYPE = 1;
    var DOCUMENT_FRAGMENT_NODE_TYPE = 11;

    /**
     * In IE (8-11) and Edge, appending nodes with no children is dramatically
     * faster than appending a full subtree, so we essentially queue up the
     * .appendChild calls here and apply them so each node is added to its parent
     * before any children are added.
     *
     * In other browsers, doing so is slower or neutral compared to the other order
     * (in Firefox, twice as slow) so we only do this inversion in IE.
     *
     * See https://github.com/spicyj/innerhtml-vs-createelement-vs-clonenode.
     */
    var enableLazy = typeof document !== 'undefined' && typeof document.documentMode === 'number' || typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string' && /\bEdge\/\d/.test(navigator.userAgent);

    function insertTreeChildren(tree) {
      if (!enableLazy) {
        return;
      }
      var node = tree.node;
      var children = tree.children;
      if (children.length) {
        for (var i = 0; i < children.length; i++) {
          insertTreeBefore(node, children[i], null);
        }
      } else if (tree.html != null) {
        setInnerHTML$1(node, tree.html);
      } else if (tree.text != null) {
        setTextContent$1(node, tree.text);
      }
    }

    var insertTreeBefore = createMicrosoftUnsafeLocalFunction$1(function (parentNode, tree, referenceNode) {
      // DocumentFragments aren't actually part of the DOM after insertion so
      // appending children won't update the DOM. We need to ensure the fragment
      // is properly populated first, breaking out of our lazy approach for just
      // this level. Also, some <object> plugins (like Flash Player) will read
      // <param> nodes immediately upon insertion into the DOM, so <object>
      // must also be populated prior to insertion into the DOM.
      if (tree.node.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE || tree.node.nodeType === ELEMENT_NODE_TYPE && tree.node.nodeName.toLowerCase() === 'object' && (tree.node.namespaceURI == null || tree.node.namespaceURI === DOMNamespaces.html)) {
        insertTreeChildren(tree);
        parentNode.insertBefore(tree.node, referenceNode);
      } else {
        parentNode.insertBefore(tree.node, referenceNode);
        insertTreeChildren(tree);
      }
    });

    function replaceChildWithTree(oldNode, newTree) {
      oldNode.parentNode.replaceChild(newTree.node, oldNode);
      insertTreeChildren(newTree);
    }

    function queueChild(parentTree, childTree) {
      if (enableLazy) {
        parentTree.children.push(childTree);
      } else {
        parentTree.node.appendChild(childTree.node);
      }
    }

    function queueHTML(tree, html) {
      if (enableLazy) {
        tree.html = html;
      } else {
        setInnerHTML$1(tree.node, html);
      }
    }

    function queueText(tree, text) {
      if (enableLazy) {
        tree.text = text;
      } else {
        setTextContent$1(tree.node, text);
      }
    }

    function toString() {
      return this.node.nodeName;
    }

    function DOMLazyTree$1(node) {
      return {
        node: node,
        children: [],
        html: null,
        text: null,
        toString: toString
      };
    }

    DOMLazyTree$1.insertTreeBefore = insertTreeBefore;
    DOMLazyTree$1.replaceChildWithTree = replaceChildWithTree;
    DOMLazyTree$1.queueChild = queueChild;
    DOMLazyTree$1.queueHTML = queueHTML;
    DOMLazyTree$1.queueText = queueText;

    var DOMLazyTree_1 = DOMLazyTree$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    var invariant$17 = require('./invariant');

    /**
     * Convert array-like objects to arrays.
     *
     * This API assumes the caller knows the contents of the data type. For less
     * well defined inputs use createArrayFromMixed.
     *
     * @param {object|function|filelist} obj
     * @return {array}
     */
    function toArray$2(obj) {
      var length = obj.length;

      // Some browsers builtin objects can report typeof 'function' (e.g. NodeList
      // in old versions of Safari).
      !(!Array.isArray(obj) && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function')) ? process.env.NODE_ENV !== 'production' ? invariant$17(false, 'toArray: Array-like object expected') : invariant$17(false) : void 0;

      !(typeof length === 'number') ? process.env.NODE_ENV !== 'production' ? invariant$17(false, 'toArray: Object needs a length property') : invariant$17(false) : void 0;

      !(length === 0 || length - 1 in obj) ? process.env.NODE_ENV !== 'production' ? invariant$17(false, 'toArray: Object should have keys for indices') : invariant$17(false) : void 0;

      !(typeof obj.callee !== 'function') ? process.env.NODE_ENV !== 'production' ? invariant$17(false, 'toArray: Object can\'t be `arguments`. Use rest params ' + '(function(...args) {}) or Array.from() instead.') : invariant$17(false) : void 0;

      // Old IE doesn't give collections access to hasOwnProperty. Assume inputs
      // without method will throw during the slice call and skip straight to the
      // fallback.
      if (obj.hasOwnProperty) {
        try {
          return Array.prototype.slice.call(obj);
        } catch (e) {
          // IE < 9 does not support Array#slice on collections objects
        }
      }

      // Fall back to copying key by key. This assumes all keys have a value,
      // so will not preserve sparsely populated inputs.
      var ret = Array(length);
      for (var ii = 0; ii < length; ii++) {
        ret[ii] = obj[ii];
      }
      return ret;
    }

    /**
     * Perform a heuristic test to determine if an object is "array-like".
     *
     *   A monk asked Joshu, a Zen master, "Has a dog Buddha nature?"
     *   Joshu replied: "Mu."
     *
     * This function determines if its argument has "array nature": it returns
     * true if the argument is an actual array, an `arguments' object, or an
     * HTMLCollection (e.g. node.childNodes or node.getElementsByTagName()).
     *
     * It will return false for other array-like objects like Filelist.
     *
     * @param {*} obj
     * @return {boolean}
     */
    function hasArrayNature(obj) {
      return (
        // not null/false
        !!obj && (
        // arrays are objects, NodeLists are functions in Safari
        (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object' || typeof obj == 'function') &&
        // quacks like an array
        'length' in obj &&
        // not window
        !('setInterval' in obj) &&
        // no DOM node should be considered an array-like
        // a 'select' element has 'length' and 'item' properties on IE8
        typeof obj.nodeType != 'number' && (
        // a real array
        Array.isArray(obj) ||
        // arguments
        'callee' in obj ||
        // HTMLCollection/NodeList
        'item' in obj)
      );
    }

    /**
     * Ensure that the argument is an array by wrapping it in an array if it is not.
     * Creates a copy of the argument if it is already an array.
     *
     * This is mostly useful idiomatically:
     *
     *   var createArrayFromMixed = require('createArrayFromMixed');
     *
     *   function takesOneOrMoreThings(things) {
     *     things = createArrayFromMixed(things);
     *     ...
     *   }
     *
     * This allows you to treat `things' as an array, but accept scalars in the API.
     *
     * If you need to convert an array-like object, like `arguments`, into an array
     * use toArray instead.
     *
     * @param {*} obj
     * @return {array}
     */
    function createArrayFromMixed$1(obj) {
      if (!hasArrayNature(obj)) {
        return [obj];
      } else if (Array.isArray(obj)) {
        return obj.slice();
      } else {
        return toArray$2(obj);
      }
    }

    module.exports = createArrayFromMixed$1;



    var createArrayFromMixed$2 = Object.freeze({

    });

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /*eslint-disable fb-www/unsafe-html */

    var ExecutionEnvironment$10 = ExecutionEnvironment_1;

    var invariant$18 = invariant_1;

    /**
     * Dummy container used to detect which wraps are necessary.
     */
    var dummyNode$1 = ExecutionEnvironment$10.canUseDOM ? document.createElement('div') : null;

    /**
     * Some browsers cannot use `innerHTML` to render certain elements standalone,
     * so we wrap them, render the wrapped nodes, then extract the desired node.
     *
     * In IE8, certain elements cannot render alone, so wrap all elements ('*').
     */

    var shouldWrap = {};

    var selectWrap = [1, '<select multiple="true">', '</select>'];
    var tableWrap = [1, '<table>', '</table>'];
    var trWrap = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

    var svgWrap = [1, '<svg xmlns="http://www.w3.org/2000/svg">', '</svg>'];

    var markupWrap = {
      '*': [1, '?<div>', '</div>'],

      'area': [1, '<map>', '</map>'],
      'col': [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
      'legend': [1, '<fieldset>', '</fieldset>'],
      'param': [1, '<object>', '</object>'],
      'tr': [2, '<table><tbody>', '</tbody></table>'],

      'optgroup': selectWrap,
      'option': selectWrap,

      'caption': tableWrap,
      'colgroup': tableWrap,
      'tbody': tableWrap,
      'tfoot': tableWrap,
      'thead': tableWrap,

      'td': trWrap,
      'th': trWrap
    };

    // Initialize the SVG elements since we know they'll always need to be wrapped
    // consistently. If they are created inside a <div> they will be initialized in
    // the wrong namespace (and will not display).
    var svgElements = ['circle', 'clipPath', 'defs', 'ellipse', 'g', 'image', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'text', 'tspan'];
    svgElements.forEach(function (nodeName) {
      markupWrap[nodeName] = svgWrap;
      shouldWrap[nodeName] = true;
    });

    /**
     * Gets the markup wrap configuration for the supplied `nodeName`.
     *
     * NOTE: This lazily detects which wraps are necessary for the current browser.
     *
     * @param {string} nodeName Lowercase `nodeName`.
     * @return {?array} Markup wrap configuration, if applicable.
     */
    function getMarkupWrap$1(nodeName) {
      !!!dummyNode$1 ? process.env.NODE_ENV !== 'production' ? invariant$18(false, 'Markup wrapping node not initialized') : invariant$18(false) : void 0;
      if (!markupWrap.hasOwnProperty(nodeName)) {
        nodeName = '*';
      }
      if (!shouldWrap.hasOwnProperty(nodeName)) {
        if (nodeName === '*') {
          dummyNode$1.innerHTML = '<link />';
        } else {
          dummyNode$1.innerHTML = '<' + nodeName + '></' + nodeName + '>';
        }
        shouldWrap[nodeName] = !dummyNode$1.firstChild;
      }
      return shouldWrap[nodeName] ? markupWrap[nodeName] : null;
    }

    var getMarkupWrap_1 = getMarkupWrap$1;

    var require$$2$12 = ( createArrayFromMixed$2 && createArrayFromMixed$2['default'] ) || createArrayFromMixed$2;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    /*eslint-disable fb-www/unsafe-html*/

    var ExecutionEnvironment$9 = ExecutionEnvironment_1;

    var createArrayFromMixed = require$$2$12;
    var getMarkupWrap = getMarkupWrap_1;
    var invariant$16 = invariant_1;

    /**
     * Dummy container used to render all markup.
     */
    var dummyNode = ExecutionEnvironment$9.canUseDOM ? document.createElement('div') : null;

    /**
     * Pattern used by `getNodeName`.
     */
    var nodeNamePattern = /^\s*<(\w+)/;

    /**
     * Extracts the `nodeName` of the first element in a string of markup.
     *
     * @param {string} markup String of markup.
     * @return {?string} Node name of the supplied markup.
     */
    function getNodeName(markup) {
      var nodeNameMatch = markup.match(nodeNamePattern);
      return nodeNameMatch && nodeNameMatch[1].toLowerCase();
    }

    /**
     * Creates an array containing the nodes rendered from the supplied markup. The
     * optionally supplied `handleScript` function will be invoked once for each
     * <script> element that is rendered. If no `handleScript` function is supplied,
     * an exception is thrown if any <script> elements are rendered.
     *
     * @param {string} markup A string of valid HTML markup.
     * @param {?function} handleScript Invoked once for each rendered <script>.
     * @return {array<DOMElement|DOMTextNode>} An array of rendered nodes.
     */
    function createNodesFromMarkup$1(markup, handleScript) {
      var node = dummyNode;
      !!!dummyNode ? process.env.NODE_ENV !== 'production' ? invariant$16(false, 'createNodesFromMarkup dummy not initialized') : invariant$16(false) : void 0;
      var nodeName = getNodeName(markup);

      var wrap = nodeName && getMarkupWrap(nodeName);
      if (wrap) {
        node.innerHTML = wrap[1] + markup + wrap[2];

        var wrapDepth = wrap[0];
        while (wrapDepth--) {
          node = node.lastChild;
        }
      } else {
        node.innerHTML = markup;
      }

      var scripts = node.getElementsByTagName('script');
      if (scripts.length) {
        !handleScript ? process.env.NODE_ENV !== 'production' ? invariant$16(false, 'createNodesFromMarkup(...): Unexpected <script> element rendered.') : invariant$16(false) : void 0;
        createArrayFromMixed(scripts).forEach(handleScript);
      }

      var nodes = Array.from(node.childNodes);
      while (node.lastChild) {
        node.removeChild(node.lastChild);
      }
      return nodes;
    }

    var createNodesFromMarkup_1 = createNodesFromMarkup$1;

    var _prodInvariant$14 = reactProdInvariant_1$2;

    var DOMLazyTree$2 = DOMLazyTree_1;
    var ExecutionEnvironment$8 = ExecutionEnvironment_1;

    var createNodesFromMarkup = createNodesFromMarkup_1;
    var emptyFunction$5 = emptyFunction_1;
    var invariant$15 = invariant_1;

    var Danger$1 = {

      /**
       * Replaces a node with a string of markup at its current position within its
       * parent. The markup must render into a single root node.
       *
       * @param {DOMElement} oldChild Child node to replace.
       * @param {string} markup Markup to render in place of the child node.
       * @internal
       */
      dangerouslyReplaceNodeWithMarkup: function dangerouslyReplaceNodeWithMarkup(oldChild, markup) {
        !ExecutionEnvironment$8.canUseDOM ? process.env.NODE_ENV !== 'production' ? invariant$15(false, 'dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a worker thread. Make sure `window` and `document` are available globally before requiring React when unit testing or use ReactDOMServer.renderToString() for server rendering.') : _prodInvariant$14('56') : void 0;
        !markup ? process.env.NODE_ENV !== 'production' ? invariant$15(false, 'dangerouslyReplaceNodeWithMarkup(...): Missing markup.') : _prodInvariant$14('57') : void 0;
        !(oldChild.nodeName !== 'HTML') ? process.env.NODE_ENV !== 'production' ? invariant$15(false, 'dangerouslyReplaceNodeWithMarkup(...): Cannot replace markup of the <html> node. This is because browser quirks make this unreliable and/or slow. If you want to render to the root you must use server rendering. See ReactDOMServer.renderToString().') : _prodInvariant$14('58') : void 0;

        if (typeof markup === 'string') {
          var newChild = createNodesFromMarkup(markup, emptyFunction$5)[0];
          oldChild.parentNode.replaceChild(newChild, oldChild);
        } else {
          DOMLazyTree$2.replaceChildWithTree(oldChild, markup);
        }
      }

    };

    var Danger_1 = Danger$1;

    var DOMLazyTree = DOMLazyTree_1;
    var Danger = Danger_1;
    var ReactDOMComponentTree$5 = ReactDOMComponentTree_1;
    var ReactInstrumentation$4 = ReactInstrumentation$2;

    var createMicrosoftUnsafeLocalFunction = createMicrosoftUnsafeLocalFunction_1;
    var setInnerHTML = setInnerHTML_1;
    var setTextContent = setTextContent_1;

    function getNodeAfter(parentNode, node) {
      // Special case for text components, which return [open, close] comments
      // from getHostNode.
      if (Array.isArray(node)) {
        node = node[1];
      }
      return node ? node.nextSibling : parentNode.firstChild;
    }

    /**
     * Inserts `childNode` as a child of `parentNode` at the `index`.
     *
     * @param {DOMElement} parentNode Parent node in which to insert.
     * @param {DOMElement} childNode Child node to insert.
     * @param {number} index Index at which to insert the child.
     * @internal
     */
    var insertChildAt = createMicrosoftUnsafeLocalFunction(function (parentNode, childNode, referenceNode) {
      // We rely exclusively on `insertBefore(node, null)` instead of also using
      // `appendChild(node)`. (Using `undefined` is not allowed by all browsers so
      // we are careful to use `null`.)
      parentNode.insertBefore(childNode, referenceNode);
    });

    function insertLazyTreeChildAt(parentNode, childTree, referenceNode) {
      DOMLazyTree.insertTreeBefore(parentNode, childTree, referenceNode);
    }

    function moveChild(parentNode, childNode, referenceNode) {
      if (Array.isArray(childNode)) {
        moveDelimitedText(parentNode, childNode[0], childNode[1], referenceNode);
      } else {
        insertChildAt(parentNode, childNode, referenceNode);
      }
    }

    function removeChild(parentNode, childNode) {
      if (Array.isArray(childNode)) {
        var closingComment = childNode[1];
        childNode = childNode[0];
        removeDelimitedText(parentNode, childNode, closingComment);
        parentNode.removeChild(closingComment);
      }
      parentNode.removeChild(childNode);
    }

    function moveDelimitedText(parentNode, openingComment, closingComment, referenceNode) {
      var node = openingComment;
      while (true) {
        var nextNode = node.nextSibling;
        insertChildAt(parentNode, node, referenceNode);
        if (node === closingComment) {
          break;
        }
        node = nextNode;
      }
    }

    function removeDelimitedText(parentNode, startNode, closingComment) {
      while (true) {
        var node = startNode.nextSibling;
        if (node === closingComment) {
          // The closing comment is removed by ReactMultiChild.
          break;
        } else {
          parentNode.removeChild(node);
        }
      }
    }

    function replaceDelimitedText(openingComment, closingComment, stringText) {
      var parentNode = openingComment.parentNode;
      var nodeAfterComment = openingComment.nextSibling;
      if (nodeAfterComment === closingComment) {
        // There are no text nodes between the opening and closing comments; insert
        // a new one if stringText isn't empty.
        if (stringText) {
          insertChildAt(parentNode, document.createTextNode(stringText), nodeAfterComment);
        }
      } else {
        if (stringText) {
          // Set the text content of the first node after the opening comment, and
          // remove all following nodes up until the closing comment.
          setTextContent(nodeAfterComment, stringText);
          removeDelimitedText(parentNode, nodeAfterComment, closingComment);
        } else {
          removeDelimitedText(parentNode, openingComment, closingComment);
        }
      }

      if (process.env.NODE_ENV !== 'production') {
        ReactInstrumentation$4.debugTool.onHostOperation({
          instanceID: ReactDOMComponentTree$5.getInstanceFromNode(openingComment)._debugID,
          type: 'replace text',
          payload: stringText
        });
      }
    }

    var dangerouslyReplaceNodeWithMarkup$1 = Danger.dangerouslyReplaceNodeWithMarkup;
    if (process.env.NODE_ENV !== 'production') {
      dangerouslyReplaceNodeWithMarkup$1 = function dangerouslyReplaceNodeWithMarkup$1(oldChild, markup, prevInstance) {
        Danger.dangerouslyReplaceNodeWithMarkup(oldChild, markup);
        if (prevInstance._debugID !== 0) {
          ReactInstrumentation$4.debugTool.onHostOperation({
            instanceID: prevInstance._debugID,
            type: 'replace with',
            payload: markup.toString()
          });
        } else {
          var nextInstance = ReactDOMComponentTree$5.getInstanceFromNode(markup.node);
          if (nextInstance._debugID !== 0) {
            ReactInstrumentation$4.debugTool.onHostOperation({
              instanceID: nextInstance._debugID,
              type: 'mount',
              payload: markup.toString()
            });
          }
        }
      };
    }

    /**
     * Operations for updating with DOM children.
     */
    var DOMChildrenOperations$1 = {

      dangerouslyReplaceNodeWithMarkup: dangerouslyReplaceNodeWithMarkup$1,

      replaceDelimitedText: replaceDelimitedText,

      /**
       * Updates a component's children by processing a series of updates. The
       * update configurations are each expected to have a `parentNode` property.
       *
       * @param {array<object>} updates List of update configurations.
       * @internal
       */
      processUpdates: function processUpdates(parentNode, updates) {
        if (process.env.NODE_ENV !== 'production') {
          var parentNodeDebugID = ReactDOMComponentTree$5.getInstanceFromNode(parentNode)._debugID;
        }

        for (var k = 0; k < updates.length; k++) {
          var update = updates[k];
          switch (update.type) {
            case 'INSERT_MARKUP':
              insertLazyTreeChildAt(parentNode, update.content, getNodeAfter(parentNode, update.afterNode));
              if (process.env.NODE_ENV !== 'production') {
                ReactInstrumentation$4.debugTool.onHostOperation({
                  instanceID: parentNodeDebugID,
                  type: 'insert child',
                  payload: { toIndex: update.toIndex, content: update.content.toString() }
                });
              }
              break;
            case 'MOVE_EXISTING':
              moveChild(parentNode, update.fromNode, getNodeAfter(parentNode, update.afterNode));
              if (process.env.NODE_ENV !== 'production') {
                ReactInstrumentation$4.debugTool.onHostOperation({
                  instanceID: parentNodeDebugID,
                  type: 'move child',
                  payload: { fromIndex: update.fromIndex, toIndex: update.toIndex }
                });
              }
              break;
            case 'SET_MARKUP':
              setInnerHTML(parentNode, update.content);
              if (process.env.NODE_ENV !== 'production') {
                ReactInstrumentation$4.debugTool.onHostOperation({
                  instanceID: parentNodeDebugID,
                  type: 'replace children',
                  payload: update.content.toString()
                });
              }
              break;
            case 'TEXT_CONTENT':
              setTextContent(parentNode, update.content);
              if (process.env.NODE_ENV !== 'production') {
                ReactInstrumentation$4.debugTool.onHostOperation({
                  instanceID: parentNodeDebugID,
                  type: 'replace text',
                  payload: update.content.toString()
                });
              }
              break;
            case 'REMOVE_NODE':
              removeChild(parentNode, update.fromNode);
              if (process.env.NODE_ENV !== 'production') {
                ReactInstrumentation$4.debugTool.onHostOperation({
                  instanceID: parentNodeDebugID,
                  type: 'remove child',
                  payload: { fromIndex: update.fromIndex }
                });
              }
              break;
          }
        }
      }

    };

    var DOMChildrenOperations_1 = DOMChildrenOperations$1;

    var DOMChildrenOperations$2 = DOMChildrenOperations_1;
    var ReactDOMComponentTree$6 = ReactDOMComponentTree_1;

    /**
     * Operations used to process updates to DOM nodes.
     */
    var ReactDOMIDOperations$1 = {

      /**
       * Updates a component's children by processing a series of updates.
       *
       * @param {array<object>} updates List of update configurations.
       * @internal
       */
      dangerouslyProcessChildrenUpdates: function dangerouslyProcessChildrenUpdates(parentInst, updates) {
        var node = ReactDOMComponentTree$6.getNodeFromInstance(parentInst);
        DOMChildrenOperations$2.processUpdates(node, updates);
      }
    };

    var ReactDOMIDOperations_1 = ReactDOMIDOperations$1;

    var DOMChildrenOperations = DOMChildrenOperations_1;
    var ReactDOMIDOperations = ReactDOMIDOperations_1;

    /**
     * Abstracts away all functionality of the reconciler that requires knowledge of
     * the browser context. TODO: These callers should be refactored to avoid the
     * need for this injection.
     */
    var ReactComponentBrowserEnvironment$1 = {

      processChildrenUpdates: ReactDOMIDOperations.dangerouslyProcessChildrenUpdates,

      replaceNodeWithMarkup: DOMChildrenOperations.dangerouslyReplaceNodeWithMarkup

    };

    var ReactComponentBrowserEnvironment_1 = ReactComponentBrowserEnvironment$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /* global hasOwnProperty:true */

    var _prodInvariant$15 = require('./reactProdInvariant');
    var _assign$6 = require('object-assign');

    var AutoFocusUtils = require('./AutoFocusUtils');
    var CSSPropertyOperations = require('./CSSPropertyOperations');
    var DOMLazyTree$3 = require('./DOMLazyTree');
    var DOMNamespaces$3 = require('./DOMNamespaces');
    var DOMProperty$3 = require('./DOMProperty');
    var DOMPropertyOperations = require('./DOMPropertyOperations');
    var EventPluginHub$4 = require('./EventPluginHub');
    var EventPluginRegistry$1 = require('./EventPluginRegistry');
    var ReactBrowserEventEmitter = require('./ReactBrowserEventEmitter');
    var ReactDOMComponentFlags$2 = require('./ReactDOMComponentFlags');
    var ReactDOMComponentTree$7 = require('./ReactDOMComponentTree');
    var ReactDOMInput = require('./ReactDOMInput');
    var ReactDOMOption = require('./ReactDOMOption');
    var ReactDOMSelect = require('./ReactDOMSelect');
    var ReactDOMTextarea = require('./ReactDOMTextarea');
    var ReactInstrumentation$5 = require('./ReactInstrumentation');
    var ReactMultiChild = require('./ReactMultiChild');
    var ReactServerRenderingTransaction = require('./ReactServerRenderingTransaction');

    var emptyFunction$6 = require('fbjs/lib/emptyFunction');
    var escapeTextContentForBrowser$2 = require('./escapeTextContentForBrowser');
    var invariant$19 = require('fbjs/lib/invariant');
    var isEventSupported$2 = require('./isEventSupported');
    var shallowEqual = require('fbjs/lib/shallowEqual');
    var validateDOMNesting = require('./validateDOMNesting');
    var warning$15 = require('fbjs/lib/warning');

    var Flags$1 = ReactDOMComponentFlags$2;
    var deleteListener$1 = EventPluginHub$4.deleteListener;
    var getNode = ReactDOMComponentTree$7.getNodeFromInstance;
    var listenTo$1 = ReactBrowserEventEmitter.listenTo;
    var registrationNameModules = EventPluginRegistry$1.registrationNameModules;

    // For quickly matching children type, to test if can be treated as content.
    var CONTENT_TYPES = { 'string': true, 'number': true };

    var STYLE = 'style';
    var HTML = '__html';
    var RESERVED_PROPS$1 = {
      children: null,
      dangerouslySetInnerHTML: null,
      suppressContentEditableWarning: null
    };

    // Node type for document fragments (Node.DOCUMENT_FRAGMENT_NODE).
    var DOC_FRAGMENT_TYPE = 11;

    function getDeclarationErrorAddendum$1(internalInstance) {
      if (internalInstance) {
        var owner = internalInstance._currentElement._owner || null;
        if (owner) {
          var name = owner.getName();
          if (name) {
            return ' This DOM node was rendered by `' + name + '`.';
          }
        }
      }
      return '';
    }

    function friendlyStringify(obj) {
      if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
        if (Array.isArray(obj)) {
          return '[' + obj.map(friendlyStringify).join(', ') + ']';
        } else {
          var pairs = [];
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              var keyEscaped = /^[a-z$_][\w$_]*$/i.test(key) ? key : JSON.stringify(key);
              pairs.push(keyEscaped + ': ' + friendlyStringify(obj[key]));
            }
          }
          return '{' + pairs.join(', ') + '}';
        }
      } else if (typeof obj === 'string') {
        return JSON.stringify(obj);
      } else if (typeof obj === 'function') {
        return '[function object]';
      }
      // Differs from JSON.stringify in that undefined because undefined and that
      // inf and nan don't become null
      return String(obj);
    }

    var styleMutationWarning = {};

    function checkAndWarnForMutatedStyle(style1, style2, component) {
      if (style1 == null || style2 == null) {
        return;
      }
      if (shallowEqual(style1, style2)) {
        return;
      }

      var componentName = component._tag;
      var owner = component._currentElement._owner;
      var ownerName;
      if (owner) {
        ownerName = owner.getName();
      }

      var hash = ownerName + '|' + componentName;

      if (styleMutationWarning.hasOwnProperty(hash)) {
        return;
      }

      styleMutationWarning[hash] = true;

      process.env.NODE_ENV !== 'production' ? warning$15(false, '`%s` was passed a style object that has previously been mutated. ' + 'Mutating `style` is deprecated. Consider cloning it beforehand. Check ' + 'the `render` %s. Previous style: %s. Mutated style: %s.', componentName, owner ? 'of `' + ownerName + '`' : 'using <' + componentName + '>', friendlyStringify(style1), friendlyStringify(style2)) : void 0;
    }

    /**
     * @param {object} component
     * @param {?object} props
     */
    function assertValidProps(component, props) {
      if (!props) {
        return;
      }
      // Note the use of `==` which checks for null or undefined.
      if (voidElementTags[component._tag]) {
        !(props.children == null && props.dangerouslySetInnerHTML == null) ? process.env.NODE_ENV !== 'production' ? invariant$19(false, '%s is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.%s', component._tag, component._currentElement._owner ? ' Check the render method of ' + component._currentElement._owner.getName() + '.' : '') : _prodInvariant$15('137', component._tag, component._currentElement._owner ? ' Check the render method of ' + component._currentElement._owner.getName() + '.' : '') : void 0;
      }
      if (props.dangerouslySetInnerHTML != null) {
        !(props.children == null) ? process.env.NODE_ENV !== 'production' ? invariant$19(false, 'Can only set one of `children` or `props.dangerouslySetInnerHTML`.') : _prodInvariant$15('60') : void 0;
        !(_typeof(props.dangerouslySetInnerHTML) === 'object' && HTML in props.dangerouslySetInnerHTML) ? process.env.NODE_ENV !== 'production' ? invariant$19(false, '`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://fb.me/react-invariant-dangerously-set-inner-html for more information.') : _prodInvariant$15('61') : void 0;
      }
      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning$15(props.innerHTML == null, 'Directly setting property `innerHTML` is not permitted. ' + 'For more information, lookup documentation on `dangerouslySetInnerHTML`.') : void 0;
        process.env.NODE_ENV !== 'production' ? warning$15(props.suppressContentEditableWarning || !props.contentEditable || props.children == null, 'A component is `contentEditable` and contains `children` managed by ' + 'React. It is now your responsibility to guarantee that none of ' + 'those nodes are unexpectedly modified or duplicated. This is ' + 'probably not intentional.') : void 0;
        process.env.NODE_ENV !== 'production' ? warning$15(props.onFocusIn == null && props.onFocusOut == null, 'React uses onFocus and onBlur instead of onFocusIn and onFocusOut. ' + 'All React events are normalized to bubble, so onFocusIn and onFocusOut ' + 'are not needed/supported by React.') : void 0;
      }
      !(props.style == null || _typeof(props.style) === 'object') ? process.env.NODE_ENV !== 'production' ? invariant$19(false, 'The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + \'em\'}} when using JSX.%s', getDeclarationErrorAddendum$1(component)) : _prodInvariant$15('62', getDeclarationErrorAddendum$1(component)) : void 0;
    }

    function enqueuePutListener(inst, registrationName, listener, transaction) {
      if (transaction instanceof ReactServerRenderingTransaction) {
        return;
      }
      if (process.env.NODE_ENV !== 'production') {
        // IE8 has no API for event capturing and the `onScroll` event doesn't
        // bubble.
        process.env.NODE_ENV !== 'production' ? warning$15(registrationName !== 'onScroll' || isEventSupported$2('scroll', true), 'This browser doesn\'t support the `onScroll` event') : void 0;
      }
      var containerInfo = inst._hostContainerInfo;
      var isDocumentFragment = containerInfo._node && containerInfo._node.nodeType === DOC_FRAGMENT_TYPE;
      var doc = isDocumentFragment ? containerInfo._node : containerInfo._ownerDocument;
      listenTo$1(registrationName, doc);
      transaction.getReactMountReady().enqueue(putListener$1, {
        inst: inst,
        registrationName: registrationName,
        listener: listener
      });
    }

    function putListener$1() {
      var listenerToPut = this;
      EventPluginHub$4.putListener(listenerToPut.inst, listenerToPut.registrationName, listenerToPut.listener);
    }

    function inputPostMount() {
      var inst = this;
      ReactDOMInput.postMountWrapper(inst);
    }

    function textareaPostMount() {
      var inst = this;
      ReactDOMTextarea.postMountWrapper(inst);
    }

    function optionPostMount() {
      var inst = this;
      ReactDOMOption.postMountWrapper(inst);
    }

    var setAndValidateContentChildDev = emptyFunction$6;
    if (process.env.NODE_ENV !== 'production') {
      setAndValidateContentChildDev = function setAndValidateContentChildDev(content) {
        var hasExistingContent = this._contentDebugID != null;
        var debugID = this._debugID;
        // This ID represents the inlined child that has no backing instance:
        var contentDebugID = -debugID;

        if (content == null) {
          if (hasExistingContent) {
            ReactInstrumentation$5.debugTool.onUnmountComponent(this._contentDebugID);
          }
          this._contentDebugID = null;
          return;
        }

        validateDOMNesting(null, String(content), this, this._ancestorInfo);
        this._contentDebugID = contentDebugID;
        if (hasExistingContent) {
          ReactInstrumentation$5.debugTool.onBeforeUpdateComponent(contentDebugID, content);
          ReactInstrumentation$5.debugTool.onUpdateComponent(contentDebugID);
        } else {
          ReactInstrumentation$5.debugTool.onBeforeMountComponent(contentDebugID, content, debugID);
          ReactInstrumentation$5.debugTool.onMountComponent(contentDebugID);
          ReactInstrumentation$5.debugTool.onSetChildren(debugID, [contentDebugID]);
        }
      };
    }

    // There are so many media events, it makes sense to just
    // maintain a list rather than create a `trapBubbledEvent` for each
    var mediaEvents = {
      topAbort: 'abort',
      topCanPlay: 'canplay',
      topCanPlayThrough: 'canplaythrough',
      topDurationChange: 'durationchange',
      topEmptied: 'emptied',
      topEncrypted: 'encrypted',
      topEnded: 'ended',
      topError: 'error',
      topLoadedData: 'loadeddata',
      topLoadedMetadata: 'loadedmetadata',
      topLoadStart: 'loadstart',
      topPause: 'pause',
      topPlay: 'play',
      topPlaying: 'playing',
      topProgress: 'progress',
      topRateChange: 'ratechange',
      topSeeked: 'seeked',
      topSeeking: 'seeking',
      topStalled: 'stalled',
      topSuspend: 'suspend',
      topTimeUpdate: 'timeupdate',
      topVolumeChange: 'volumechange',
      topWaiting: 'waiting'
    };

    function trapBubbledEventsLocal() {
      var inst = this;
      // If a component renders to null or if another component fatals and causes
      // the state of the tree to be corrupted, `node` here can be null.
      !inst._rootNodeID ? process.env.NODE_ENV !== 'production' ? invariant$19(false, 'Must be mounted to trap events') : _prodInvariant$15('63') : void 0;
      var node = getNode(inst);
      !node ? process.env.NODE_ENV !== 'production' ? invariant$19(false, 'trapBubbledEvent(...): Requires node to be rendered.') : _prodInvariant$15('64') : void 0;

      switch (inst._tag) {
        case 'iframe':
        case 'object':
          inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent('topLoad', 'load', node)];
          break;
        case 'video':
        case 'audio':

          inst._wrapperState.listeners = [];
          // Create listener for each media event
          for (var event in mediaEvents) {
            if (mediaEvents.hasOwnProperty(event)) {
              inst._wrapperState.listeners.push(ReactBrowserEventEmitter.trapBubbledEvent(event, mediaEvents[event], node));
            }
          }
          break;
        case 'source':
          inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent('topError', 'error', node)];
          break;
        case 'img':
          inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent('topError', 'error', node), ReactBrowserEventEmitter.trapBubbledEvent('topLoad', 'load', node)];
          break;
        case 'form':
          inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent('topReset', 'reset', node), ReactBrowserEventEmitter.trapBubbledEvent('topSubmit', 'submit', node)];
          break;
        case 'input':
        case 'select':
        case 'textarea':
          inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent('topInvalid', 'invalid', node)];
          break;
      }
    }

    function postUpdateSelectWrapper() {
      ReactDOMSelect.postUpdateWrapper(this);
    }

    // For HTML, certain tags should omit their close tag. We keep a whitelist for
    // those special-case tags.

    var omittedCloseTags = {
      'area': true,
      'base': true,
      'br': true,
      'col': true,
      'embed': true,
      'hr': true,
      'img': true,
      'input': true,
      'keygen': true,
      'link': true,
      'meta': true,
      'param': true,
      'source': true,
      'track': true,
      'wbr': true
    };

    var newlineEatingTags = {
      'listing': true,
      'pre': true,
      'textarea': true
    };

    // For HTML, certain tags cannot have children. This has the same purpose as
    // `omittedCloseTags` except that `menuitem` should still have its closing tag.

    var voidElementTags = _assign$6({
      'menuitem': true
    }, omittedCloseTags);

    // We accept any tag to be rendered but since this gets injected into arbitrary
    // HTML, we want to make sure that it's a safe tag.
    // http://www.w3.org/TR/REC-xml/#NT-Name

    var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/; // Simplified subset
    var validatedTagCache = {};
    var hasOwnProperty$2 = {}.hasOwnProperty;

    function validateDangerousTag(tag) {
      if (!hasOwnProperty$2.call(validatedTagCache, tag)) {
        !VALID_TAG_REGEX.test(tag) ? process.env.NODE_ENV !== 'production' ? invariant$19(false, 'Invalid tag: %s', tag) : _prodInvariant$15('65', tag) : void 0;
        validatedTagCache[tag] = true;
      }
    }

    function isCustomComponent(tagName, props) {
      return tagName.indexOf('-') >= 0 || props.is != null;
    }

    var globalIdCounter = 1;

    /**
     * Creates a new React class that is idempotent and capable of containing other
     * React components. It accepts event listeners and DOM properties that are
     * valid according to `DOMProperty`.
     *
     *  - Event listeners: `onClick`, `onMouseDown`, etc.
     *  - DOM properties: `className`, `name`, `title`, etc.
     *
     * The `style` property functions differently from the DOM API. It accepts an
     * object mapping of style properties to values.
     *
     * @constructor ReactDOMComponent
     * @extends ReactMultiChild
     */
    function ReactDOMComponent$1(element) {
      var tag = element.type;
      validateDangerousTag(tag);
      this._currentElement = element;
      this._tag = tag.toLowerCase();
      this._namespaceURI = null;
      this._renderedChildren = null;
      this._previousStyle = null;
      this._previousStyleCopy = null;
      this._hostNode = null;
      this._hostParent = null;
      this._rootNodeID = 0;
      this._domID = 0;
      this._hostContainerInfo = null;
      this._wrapperState = null;
      this._topLevelWrapper = null;
      this._flags = 0;
      if (process.env.NODE_ENV !== 'production') {
        this._ancestorInfo = null;
        setAndValidateContentChildDev.call(this, null);
      }
    }

    ReactDOMComponent$1.displayName = 'ReactDOMComponent';

    ReactDOMComponent$1.Mixin = {

      /**
       * Generates root tag markup then recurses. This method has side effects and
       * is not idempotent.
       *
       * @internal
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @param {?ReactDOMComponent} the parent component instance
       * @param {?object} info about the host container
       * @param {object} context
       * @return {string} The computed markup.
       */
      mountComponent: function mountComponent(transaction, hostParent, hostContainerInfo, context) {
        this._rootNodeID = globalIdCounter++;
        this._domID = hostContainerInfo._idCounter++;
        this._hostParent = hostParent;
        this._hostContainerInfo = hostContainerInfo;

        var props = this._currentElement.props;

        switch (this._tag) {
          case 'audio':
          case 'form':
          case 'iframe':
          case 'img':
          case 'link':
          case 'object':
          case 'source':
          case 'video':
            this._wrapperState = {
              listeners: null
            };
            transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
            break;
          case 'input':
            ReactDOMInput.mountWrapper(this, props, hostParent);
            props = ReactDOMInput.getHostProps(this, props);
            transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
            break;
          case 'option':
            ReactDOMOption.mountWrapper(this, props, hostParent);
            props = ReactDOMOption.getHostProps(this, props);
            break;
          case 'select':
            ReactDOMSelect.mountWrapper(this, props, hostParent);
            props = ReactDOMSelect.getHostProps(this, props);
            transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
            break;
          case 'textarea':
            ReactDOMTextarea.mountWrapper(this, props, hostParent);
            props = ReactDOMTextarea.getHostProps(this, props);
            transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
            break;
        }

        assertValidProps(this, props);

        // We create tags in the namespace of their parent container, except HTML
        // tags get no namespace.
        var namespaceURI;
        var parentTag;
        if (hostParent != null) {
          namespaceURI = hostParent._namespaceURI;
          parentTag = hostParent._tag;
        } else if (hostContainerInfo._tag) {
          namespaceURI = hostContainerInfo._namespaceURI;
          parentTag = hostContainerInfo._tag;
        }
        if (namespaceURI == null || namespaceURI === DOMNamespaces$3.svg && parentTag === 'foreignobject') {
          namespaceURI = DOMNamespaces$3.html;
        }
        if (namespaceURI === DOMNamespaces$3.html) {
          if (this._tag === 'svg') {
            namespaceURI = DOMNamespaces$3.svg;
          } else if (this._tag === 'math') {
            namespaceURI = DOMNamespaces$3.mathml;
          }
        }
        this._namespaceURI = namespaceURI;

        if (process.env.NODE_ENV !== 'production') {
          var parentInfo;
          if (hostParent != null) {
            parentInfo = hostParent._ancestorInfo;
          } else if (hostContainerInfo._tag) {
            parentInfo = hostContainerInfo._ancestorInfo;
          }
          if (parentInfo) {
            // parentInfo should always be present except for the top-level
            // component when server rendering
            validateDOMNesting(this._tag, null, this, parentInfo);
          }
          this._ancestorInfo = validateDOMNesting.updatedAncestorInfo(parentInfo, this._tag, this);
        }

        var mountImage;
        if (transaction.useCreateElement) {
          var ownerDocument = hostContainerInfo._ownerDocument;
          var el;
          if (namespaceURI === DOMNamespaces$3.html) {
            if (this._tag === 'script') {
              // Create the script via .innerHTML so its "parser-inserted" flag is
              // set to true and it does not execute
              var div = ownerDocument.createElement('div');
              var type = this._currentElement.type;
              div.innerHTML = '<' + type + '></' + type + '>';
              el = div.removeChild(div.firstChild);
            } else if (props.is) {
              el = ownerDocument.createElement(this._currentElement.type, props.is);
            } else {
              // Separate else branch instead of using `props.is || undefined` above becuase of a Firefox bug.
              // See discussion in https://github.com/facebook/react/pull/6896
              // and discussion in https://bugzilla.mozilla.org/show_bug.cgi?id=1276240
              el = ownerDocument.createElement(this._currentElement.type);
            }
          } else {
            el = ownerDocument.createElementNS(namespaceURI, this._currentElement.type);
          }
          ReactDOMComponentTree$7.precacheNode(this, el);
          this._flags |= Flags$1.hasCachedChildNodes;
          if (!this._hostParent) {
            DOMPropertyOperations.setAttributeForRoot(el);
          }
          this._updateDOMProperties(null, props, transaction);
          var lazyTree = DOMLazyTree$3(el);
          this._createInitialChildren(transaction, props, context, lazyTree);
          mountImage = lazyTree;
        } else {
          var tagOpen = this._createOpenTagMarkupAndPutListeners(transaction, props);
          var tagContent = this._createContentMarkup(transaction, props, context);
          if (!tagContent && omittedCloseTags[this._tag]) {
            mountImage = tagOpen + '/>';
          } else {
            mountImage = tagOpen + '>' + tagContent + '</' + this._currentElement.type + '>';
          }
        }

        switch (this._tag) {
          case 'input':
            transaction.getReactMountReady().enqueue(inputPostMount, this);
            if (props.autoFocus) {
              transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
            }
            break;
          case 'textarea':
            transaction.getReactMountReady().enqueue(textareaPostMount, this);
            if (props.autoFocus) {
              transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
            }
            break;
          case 'select':
            if (props.autoFocus) {
              transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
            }
            break;
          case 'button':
            if (props.autoFocus) {
              transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
            }
            break;
          case 'option':
            transaction.getReactMountReady().enqueue(optionPostMount, this);
            break;
        }

        return mountImage;
      },

      /**
       * Creates markup for the open tag and all attributes.
       *
       * This method has side effects because events get registered.
       *
       * Iterating over object properties is faster than iterating over arrays.
       * @see http://jsperf.com/obj-vs-arr-iteration
       *
       * @private
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @param {object} props
       * @return {string} Markup of opening tag.
       */
      _createOpenTagMarkupAndPutListeners: function _createOpenTagMarkupAndPutListeners(transaction, props) {
        var ret = '<' + this._currentElement.type;

        for (var propKey in props) {
          if (!props.hasOwnProperty(propKey)) {
            continue;
          }
          var propValue = props[propKey];
          if (propValue == null) {
            continue;
          }
          if (registrationNameModules.hasOwnProperty(propKey)) {
            if (propValue) {
              enqueuePutListener(this, propKey, propValue, transaction);
            }
          } else {
            if (propKey === STYLE) {
              if (propValue) {
                if (process.env.NODE_ENV !== 'production') {
                  // See `_updateDOMProperties`. style block
                  this._previousStyle = propValue;
                }
                propValue = this._previousStyleCopy = _assign$6({}, props.style);
              }
              propValue = CSSPropertyOperations.createMarkupForStyles(propValue, this);
            }
            var markup = null;
            if (this._tag != null && isCustomComponent(this._tag, props)) {
              if (!RESERVED_PROPS$1.hasOwnProperty(propKey)) {
                markup = DOMPropertyOperations.createMarkupForCustomAttribute(propKey, propValue);
              }
            } else {
              markup = DOMPropertyOperations.createMarkupForProperty(propKey, propValue);
            }
            if (markup) {
              ret += ' ' + markup;
            }
          }
        }

        // For static pages, no need to put React ID and checksum. Saves lots of
        // bytes.
        if (transaction.renderToStaticMarkup) {
          return ret;
        }

        if (!this._hostParent) {
          ret += ' ' + DOMPropertyOperations.createMarkupForRoot();
        }
        ret += ' ' + DOMPropertyOperations.createMarkupForID(this._domID);
        return ret;
      },

      /**
       * Creates markup for the content between the tags.
       *
       * @private
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @param {object} props
       * @param {object} context
       * @return {string} Content markup.
       */
      _createContentMarkup: function _createContentMarkup(transaction, props, context) {
        var ret = '';

        // Intentional use of != to avoid catching zero/false.
        var innerHTML = props.dangerouslySetInnerHTML;
        if (innerHTML != null) {
          if (innerHTML.__html != null) {
            ret = innerHTML.__html;
          }
        } else {
          var contentToUse = CONTENT_TYPES[_typeof(props.children)] ? props.children : null;
          var childrenToUse = contentToUse != null ? null : props.children;
          if (contentToUse != null) {
            // TODO: Validate that text is allowed as a child of this node
            ret = escapeTextContentForBrowser$2(contentToUse);
            if (process.env.NODE_ENV !== 'production') {
              setAndValidateContentChildDev.call(this, contentToUse);
            }
          } else if (childrenToUse != null) {
            var mountImages = this.mountChildren(childrenToUse, transaction, context);
            ret = mountImages.join('');
          }
        }
        if (newlineEatingTags[this._tag] && ret.charAt(0) === '\n') {
          // text/html ignores the first character in these tags if it's a newline
          // Prefer to break application/xml over text/html (for now) by adding
          // a newline specifically to get eaten by the parser. (Alternately for
          // textareas, replacing "^\n" with "\r\n" doesn't get eaten, and the first
          // \r is normalized out by HTMLTextAreaElement#value.)
          // See: <http://www.w3.org/TR/html-polyglot/#newlines-in-textarea-and-pre>
          // See: <http://www.w3.org/TR/html5/syntax.html#element-restrictions>
          // See: <http://www.w3.org/TR/html5/syntax.html#newlines>
          // See: Parsing of "textarea" "listing" and "pre" elements
          //  from <http://www.w3.org/TR/html5/syntax.html#parsing-main-inbody>
          return '\n' + ret;
        } else {
          return ret;
        }
      },

      _createInitialChildren: function _createInitialChildren(transaction, props, context, lazyTree) {
        // Intentional use of != to avoid catching zero/false.
        var innerHTML = props.dangerouslySetInnerHTML;
        if (innerHTML != null) {
          if (innerHTML.__html != null) {
            DOMLazyTree$3.queueHTML(lazyTree, innerHTML.__html);
          }
        } else {
          var contentToUse = CONTENT_TYPES[_typeof(props.children)] ? props.children : null;
          var childrenToUse = contentToUse != null ? null : props.children;
          // TODO: Validate that text is allowed as a child of this node
          if (contentToUse != null) {
            // Avoid setting textContent when the text is empty. In IE11 setting
            // textContent on a text area will cause the placeholder to not
            // show within the textarea until it has been focused and blurred again.
            // https://github.com/facebook/react/issues/6731#issuecomment-254874553
            if (contentToUse !== '') {
              if (process.env.NODE_ENV !== 'production') {
                setAndValidateContentChildDev.call(this, contentToUse);
              }
              DOMLazyTree$3.queueText(lazyTree, contentToUse);
            }
          } else if (childrenToUse != null) {
            var mountImages = this.mountChildren(childrenToUse, transaction, context);
            for (var i = 0; i < mountImages.length; i++) {
              DOMLazyTree$3.queueChild(lazyTree, mountImages[i]);
            }
          }
        }
      },

      /**
       * Receives a next element and updates the component.
       *
       * @internal
       * @param {ReactElement} nextElement
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @param {object} context
       */
      receiveComponent: function receiveComponent(nextElement, transaction, context) {
        var prevElement = this._currentElement;
        this._currentElement = nextElement;
        this.updateComponent(transaction, prevElement, nextElement, context);
      },

      /**
       * Updates a DOM component after it has already been allocated and
       * attached to the DOM. Reconciles the root DOM node, then recurses.
       *
       * @param {ReactReconcileTransaction} transaction
       * @param {ReactElement} prevElement
       * @param {ReactElement} nextElement
       * @internal
       * @overridable
       */
      updateComponent: function updateComponent(transaction, prevElement, nextElement, context) {
        var lastProps = prevElement.props;
        var nextProps = this._currentElement.props;

        switch (this._tag) {
          case 'input':
            lastProps = ReactDOMInput.getHostProps(this, lastProps);
            nextProps = ReactDOMInput.getHostProps(this, nextProps);
            break;
          case 'option':
            lastProps = ReactDOMOption.getHostProps(this, lastProps);
            nextProps = ReactDOMOption.getHostProps(this, nextProps);
            break;
          case 'select':
            lastProps = ReactDOMSelect.getHostProps(this, lastProps);
            nextProps = ReactDOMSelect.getHostProps(this, nextProps);
            break;
          case 'textarea':
            lastProps = ReactDOMTextarea.getHostProps(this, lastProps);
            nextProps = ReactDOMTextarea.getHostProps(this, nextProps);
            break;
        }

        assertValidProps(this, nextProps);
        this._updateDOMProperties(lastProps, nextProps, transaction);
        this._updateDOMChildren(lastProps, nextProps, transaction, context);

        switch (this._tag) {
          case 'input':
            // Update the wrapper around inputs *after* updating props. This has to
            // happen after `_updateDOMProperties`. Otherwise HTML5 input validations
            // raise warnings and prevent the new value from being assigned.
            ReactDOMInput.updateWrapper(this);
            break;
          case 'textarea':
            ReactDOMTextarea.updateWrapper(this);
            break;
          case 'select':
            // <select> value update needs to occur after <option> children
            // reconciliation
            transaction.getReactMountReady().enqueue(postUpdateSelectWrapper, this);
            break;
        }
      },

      /**
       * Reconciles the properties by detecting differences in property values and
       * updating the DOM as necessary. This function is probably the single most
       * critical path for performance optimization.
       *
       * TODO: Benchmark whether checking for changed values in memory actually
       *       improves performance (especially statically positioned elements).
       * TODO: Benchmark the effects of putting this at the top since 99% of props
       *       do not change for a given reconciliation.
       * TODO: Benchmark areas that can be improved with caching.
       *
       * @private
       * @param {object} lastProps
       * @param {object} nextProps
       * @param {?DOMElement} node
       */
      _updateDOMProperties: function _updateDOMProperties(lastProps, nextProps, transaction) {
        var propKey;
        var styleName;
        var styleUpdates;
        for (propKey in lastProps) {
          if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey) || lastProps[propKey] == null) {
            continue;
          }
          if (propKey === STYLE) {
            var lastStyle = this._previousStyleCopy;
            for (styleName in lastStyle) {
              if (lastStyle.hasOwnProperty(styleName)) {
                styleUpdates = styleUpdates || {};
                styleUpdates[styleName] = '';
              }
            }
            this._previousStyleCopy = null;
          } else if (registrationNameModules.hasOwnProperty(propKey)) {
            if (lastProps[propKey]) {
              // Only call deleteListener if there was a listener previously or
              // else willDeleteListener gets called when there wasn't actually a
              // listener (e.g., onClick={null})
              deleteListener$1(this, propKey);
            }
          } else if (isCustomComponent(this._tag, lastProps)) {
            if (!RESERVED_PROPS$1.hasOwnProperty(propKey)) {
              DOMPropertyOperations.deleteValueForAttribute(getNode(this), propKey);
            }
          } else if (DOMProperty$3.properties[propKey] || DOMProperty$3.isCustomAttribute(propKey)) {
            DOMPropertyOperations.deleteValueForProperty(getNode(this), propKey);
          }
        }
        for (propKey in nextProps) {
          var nextProp = nextProps[propKey];
          var lastProp = propKey === STYLE ? this._previousStyleCopy : lastProps != null ? lastProps[propKey] : undefined;
          if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp || nextProp == null && lastProp == null) {
            continue;
          }
          if (propKey === STYLE) {
            if (nextProp) {
              if (process.env.NODE_ENV !== 'production') {
                checkAndWarnForMutatedStyle(this._previousStyleCopy, this._previousStyle, this);
                this._previousStyle = nextProp;
              }
              nextProp = this._previousStyleCopy = _assign$6({}, nextProp);
            } else {
              this._previousStyleCopy = null;
            }
            if (lastProp) {
              // Unset styles on `lastProp` but not on `nextProp`.
              for (styleName in lastProp) {
                if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
                  styleUpdates = styleUpdates || {};
                  styleUpdates[styleName] = '';
                }
              }
              // Update styles that changed since `lastProp`.
              for (styleName in nextProp) {
                if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
                  styleUpdates = styleUpdates || {};
                  styleUpdates[styleName] = nextProp[styleName];
                }
              }
            } else {
              // Relies on `updateStylesByID` not mutating `styleUpdates`.
              styleUpdates = nextProp;
            }
          } else if (registrationNameModules.hasOwnProperty(propKey)) {
            if (nextProp) {
              enqueuePutListener(this, propKey, nextProp, transaction);
            } else if (lastProp) {
              deleteListener$1(this, propKey);
            }
          } else if (isCustomComponent(this._tag, nextProps)) {
            if (!RESERVED_PROPS$1.hasOwnProperty(propKey)) {
              DOMPropertyOperations.setValueForAttribute(getNode(this), propKey, nextProp);
            }
          } else if (DOMProperty$3.properties[propKey] || DOMProperty$3.isCustomAttribute(propKey)) {
            var node = getNode(this);
            // If we're updating to null or undefined, we should remove the property
            // from the DOM node instead of inadvertently setting to a string. This
            // brings us in line with the same behavior we have on initial render.
            if (nextProp != null) {
              DOMPropertyOperations.setValueForProperty(node, propKey, nextProp);
            } else {
              DOMPropertyOperations.deleteValueForProperty(node, propKey);
            }
          }
        }
        if (styleUpdates) {
          CSSPropertyOperations.setValueForStyles(getNode(this), styleUpdates, this);
        }
      },

      /**
       * Reconciles the children with the various properties that affect the
       * children content.
       *
       * @param {object} lastProps
       * @param {object} nextProps
       * @param {ReactReconcileTransaction} transaction
       * @param {object} context
       */
      _updateDOMChildren: function _updateDOMChildren(lastProps, nextProps, transaction, context) {
        var lastContent = CONTENT_TYPES[_typeof(lastProps.children)] ? lastProps.children : null;
        var nextContent = CONTENT_TYPES[_typeof(nextProps.children)] ? nextProps.children : null;

        var lastHtml = lastProps.dangerouslySetInnerHTML && lastProps.dangerouslySetInnerHTML.__html;
        var nextHtml = nextProps.dangerouslySetInnerHTML && nextProps.dangerouslySetInnerHTML.__html;

        // Note the use of `!=` which checks for null or undefined.
        var lastChildren = lastContent != null ? null : lastProps.children;
        var nextChildren = nextContent != null ? null : nextProps.children;

        // If we're switching from children to content/html or vice versa, remove
        // the old content
        var lastHasContentOrHtml = lastContent != null || lastHtml != null;
        var nextHasContentOrHtml = nextContent != null || nextHtml != null;
        if (lastChildren != null && nextChildren == null) {
          this.updateChildren(null, transaction, context);
        } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
          this.updateTextContent('');
          if (process.env.NODE_ENV !== 'production') {
            ReactInstrumentation$5.debugTool.onSetChildren(this._debugID, []);
          }
        }

        if (nextContent != null) {
          if (lastContent !== nextContent) {
            this.updateTextContent('' + nextContent);
            if (process.env.NODE_ENV !== 'production') {
              setAndValidateContentChildDev.call(this, nextContent);
            }
          }
        } else if (nextHtml != null) {
          if (lastHtml !== nextHtml) {
            this.updateMarkup('' + nextHtml);
          }
          if (process.env.NODE_ENV !== 'production') {
            ReactInstrumentation$5.debugTool.onSetChildren(this._debugID, []);
          }
        } else if (nextChildren != null) {
          if (process.env.NODE_ENV !== 'production') {
            setAndValidateContentChildDev.call(this, null);
          }

          this.updateChildren(nextChildren, transaction, context);
        }
      },

      getHostNode: function getHostNode() {
        return getNode(this);
      },

      /**
       * Destroys all event registrations for this instance. Does not remove from
       * the DOM. That must be done by the parent.
       *
       * @internal
       */
      unmountComponent: function unmountComponent(safely) {
        switch (this._tag) {
          case 'audio':
          case 'form':
          case 'iframe':
          case 'img':
          case 'link':
          case 'object':
          case 'source':
          case 'video':
            var listeners = this._wrapperState.listeners;
            if (listeners) {
              for (var i = 0; i < listeners.length; i++) {
                listeners[i].remove();
              }
            }
            break;
          case 'html':
          case 'head':
          case 'body':
            /**
             * Components like <html> <head> and <body> can't be removed or added
             * easily in a cross-browser way, however it's valuable to be able to
             * take advantage of React's reconciliation for styling and <title>
             * management. So we just document it and throw in dangerous cases.
             */
            process.env.NODE_ENV !== 'production' ? invariant$19(false, '<%s> tried to unmount. Because of cross-browser quirks it is impossible to unmount some top-level components (eg <html>, <head>, and <body>) reliably and efficiently. To fix this, have a single top-level component that never unmounts render these elements.', this._tag) : _prodInvariant$15('66', this._tag);
            break;
        }

        this.unmountChildren(safely);
        ReactDOMComponentTree$7.uncacheNode(this);
        EventPluginHub$4.deleteAllListeners(this);
        this._rootNodeID = 0;
        this._domID = 0;
        this._wrapperState = null;

        if (process.env.NODE_ENV !== 'production') {
          setAndValidateContentChildDev.call(this, null);
        }
      },

      getPublicInstance: function getPublicInstance() {
        return getNode(this);
      }

    };

    _assign$6(ReactDOMComponent$1.prototype, ReactDOMComponent$1.Mixin, ReactMultiChild.Mixin);

    module.exports = ReactDOMComponent$1;



    var ReactDOMComponent$2 = Object.freeze({

    });

    var _assign$7 = index;

    var DOMLazyTree$4 = DOMLazyTree_1;
    var ReactDOMComponentTree$8 = ReactDOMComponentTree_1;

    var ReactDOMEmptyComponent$1 = function ReactDOMEmptyComponent$1(instantiate) {
      // ReactCompositeComponent uses this:
      this._currentElement = null;
      // ReactDOMComponentTree uses these:
      this._hostNode = null;
      this._hostParent = null;
      this._hostContainerInfo = null;
      this._domID = 0;
    };
    _assign$7(ReactDOMEmptyComponent$1.prototype, {
      mountComponent: function mountComponent(transaction, hostParent, hostContainerInfo, context) {
        var domID = hostContainerInfo._idCounter++;
        this._domID = domID;
        this._hostParent = hostParent;
        this._hostContainerInfo = hostContainerInfo;

        var nodeValue = ' react-empty: ' + this._domID + ' ';
        if (transaction.useCreateElement) {
          var ownerDocument = hostContainerInfo._ownerDocument;
          var node = ownerDocument.createComment(nodeValue);
          ReactDOMComponentTree$8.precacheNode(this, node);
          return DOMLazyTree$4(node);
        } else {
          if (transaction.renderToStaticMarkup) {
            // Normally we'd insert a comment node, but since this is a situation
            // where React won't take over (static pages), we can simply return
            // nothing.
            return '';
          }
          return '<!--' + nodeValue + '-->';
        }
      },
      receiveComponent: function receiveComponent() {},
      getHostNode: function getHostNode() {
        return ReactDOMComponentTree$8.getNodeFromInstance(this);
      },
      unmountComponent: function unmountComponent() {
        ReactDOMComponentTree$8.uncacheNode(this);
      }
    });

    var ReactDOMEmptyComponent_1 = ReactDOMEmptyComponent$1;

    var _prodInvariant$16 = reactProdInvariant_1$2;

    var invariant$20 = invariant_1;

    /**
     * Return the lowest common ancestor of A and B, or null if they are in
     * different trees.
     */
    function getLowestCommonAncestor$1(instA, instB) {
      !('_hostNode' in instA) ? process.env.NODE_ENV !== 'production' ? invariant$20(false, 'getNodeFromInstance: Invalid argument.') : _prodInvariant$16('33') : void 0;
      !('_hostNode' in instB) ? process.env.NODE_ENV !== 'production' ? invariant$20(false, 'getNodeFromInstance: Invalid argument.') : _prodInvariant$16('33') : void 0;

      var depthA = 0;
      for (var tempA = instA; tempA; tempA = tempA._hostParent) {
        depthA++;
      }
      var depthB = 0;
      for (var tempB = instB; tempB; tempB = tempB._hostParent) {
        depthB++;
      }

      // If A is deeper, crawl up.
      while (depthA - depthB > 0) {
        instA = instA._hostParent;
        depthA--;
      }

      // If B is deeper, crawl up.
      while (depthB - depthA > 0) {
        instB = instB._hostParent;
        depthB--;
      }

      // Walk in lockstep until we find a match.
      var depth = depthA;
      while (depth--) {
        if (instA === instB) {
          return instA;
        }
        instA = instA._hostParent;
        instB = instB._hostParent;
      }
      return null;
    }

    /**
     * Return if A is an ancestor of B.
     */
    function isAncestor$1(instA, instB) {
      !('_hostNode' in instA) ? process.env.NODE_ENV !== 'production' ? invariant$20(false, 'isAncestor: Invalid argument.') : _prodInvariant$16('35') : void 0;
      !('_hostNode' in instB) ? process.env.NODE_ENV !== 'production' ? invariant$20(false, 'isAncestor: Invalid argument.') : _prodInvariant$16('35') : void 0;

      while (instB) {
        if (instB === instA) {
          return true;
        }
        instB = instB._hostParent;
      }
      return false;
    }

    /**
     * Return the parent instance of the passed-in instance.
     */
    function getParentInstance$1(inst) {
      !('_hostNode' in inst) ? process.env.NODE_ENV !== 'production' ? invariant$20(false, 'getParentInstance: Invalid argument.') : _prodInvariant$16('36') : void 0;

      return inst._hostParent;
    }

    /**
     * Simulates the traversal of a two-phase, capture/bubble event dispatch.
     */
    function traverseTwoPhase$1(inst, fn, arg) {
      var path = [];
      while (inst) {
        path.push(inst);
        inst = inst._hostParent;
      }
      var i;
      for (i = path.length; i-- > 0;) {
        fn(path[i], 'captured', arg);
      }
      for (i = 0; i < path.length; i++) {
        fn(path[i], 'bubbled', arg);
      }
    }

    /**
     * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
     * should would receive a `mouseEnter` or `mouseLeave` event.
     *
     * Does not invoke the callback on the nearest common ancestor because nothing
     * "entered" or "left" that element.
     */
    function traverseEnterLeave$1(from, to, fn, argFrom, argTo) {
      var common = from && to ? getLowestCommonAncestor$1(from, to) : null;
      var pathFrom = [];
      while (from && from !== common) {
        pathFrom.push(from);
        from = from._hostParent;
      }
      var pathTo = [];
      while (to && to !== common) {
        pathTo.push(to);
        to = to._hostParent;
      }
      var i;
      for (i = 0; i < pathFrom.length; i++) {
        fn(pathFrom[i], 'bubbled', argFrom);
      }
      for (i = pathTo.length; i-- > 0;) {
        fn(pathTo[i], 'captured', argTo);
      }
    }

    var ReactDOMTreeTraversal$1 = {
      isAncestor: isAncestor$1,
      getLowestCommonAncestor: getLowestCommonAncestor$1,
      getParentInstance: getParentInstance$1,
      traverseTwoPhase: traverseTwoPhase$1,
      traverseEnterLeave: traverseEnterLeave$1
    };

    var _assign$9 = index;

    var emptyFunction$7 = emptyFunction_1;
    var warning$16 = warning_1;

    var validateDOMNesting$2 = emptyFunction$7;

    if (process.env.NODE_ENV !== 'production') {
      // This validation code was written based on the HTML5 parsing spec:
      // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-scope
      //
      // Note: this does not catch all invalid nesting, nor does it try to (as it's
      // not clear what practical benefit doing so provides); instead, we warn only
      // for cases where the parser will give a parse tree differing from what React
      // intended. For example, <b><div></div></b> is invalid but we don't warn
      // because it still parses correctly; we do warn for other cases like nested
      // <p> tags where the beginning of the second element implicitly closes the
      // first, causing a confusing mess.

      // https://html.spec.whatwg.org/multipage/syntax.html#special
      var specialTags = ['address', 'applet', 'area', 'article', 'aside', 'base', 'basefont', 'bgsound', 'blockquote', 'body', 'br', 'button', 'caption', 'center', 'col', 'colgroup', 'dd', 'details', 'dir', 'div', 'dl', 'dt', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'iframe', 'img', 'input', 'isindex', 'li', 'link', 'listing', 'main', 'marquee', 'menu', 'menuitem', 'meta', 'nav', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'p', 'param', 'plaintext', 'pre', 'script', 'section', 'select', 'source', 'style', 'summary', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'track', 'ul', 'wbr', 'xmp'];

      // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-scope
      var inScopeTags = ['applet', 'caption', 'html', 'table', 'td', 'th', 'marquee', 'object', 'template',

      // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
      // TODO: Distinguish by namespace here -- for <title>, including it here
      // errs on the side of fewer warnings
      'foreignObject', 'desc', 'title'];

      // https://html.spec.whatwg.org/multipage/syntax.html#has-an-element-in-button-scope
      var buttonScopeTags = inScopeTags.concat(['button']);

      // https://html.spec.whatwg.org/multipage/syntax.html#generate-implied-end-tags
      var impliedEndTags = ['dd', 'dt', 'li', 'option', 'optgroup', 'p', 'rp', 'rt'];

      var emptyAncestorInfo = {
        current: null,

        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,

        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };

      var updatedAncestorInfo = function updatedAncestorInfo(oldInfo, tag, instance) {
        var ancestorInfo = _assign$9({}, oldInfo || emptyAncestorInfo);
        var info = { tag: tag, instance: instance };

        if (inScopeTags.indexOf(tag) !== -1) {
          ancestorInfo.aTagInScope = null;
          ancestorInfo.buttonTagInScope = null;
          ancestorInfo.nobrTagInScope = null;
        }
        if (buttonScopeTags.indexOf(tag) !== -1) {
          ancestorInfo.pTagInButtonScope = null;
        }

        // See rules for 'li', 'dd', 'dt' start tags in
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
        if (specialTags.indexOf(tag) !== -1 && tag !== 'address' && tag !== 'div' && tag !== 'p') {
          ancestorInfo.listItemTagAutoclosing = null;
          ancestorInfo.dlItemTagAutoclosing = null;
        }

        ancestorInfo.current = info;

        if (tag === 'form') {
          ancestorInfo.formTag = info;
        }
        if (tag === 'a') {
          ancestorInfo.aTagInScope = info;
        }
        if (tag === 'button') {
          ancestorInfo.buttonTagInScope = info;
        }
        if (tag === 'nobr') {
          ancestorInfo.nobrTagInScope = info;
        }
        if (tag === 'p') {
          ancestorInfo.pTagInButtonScope = info;
        }
        if (tag === 'li') {
          ancestorInfo.listItemTagAutoclosing = info;
        }
        if (tag === 'dd' || tag === 'dt') {
          ancestorInfo.dlItemTagAutoclosing = info;
        }

        return ancestorInfo;
      };

      /**
       * Returns whether
       */
      var isTagValidWithParent = function isTagValidWithParent(tag, parentTag) {
        // First, let's check if we're in an unusual parsing mode...
        switch (parentTag) {
          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inselect
          case 'select':
            return tag === 'option' || tag === 'optgroup' || tag === '#text';
          case 'optgroup':
            return tag === 'option' || tag === '#text';
          // Strictly speaking, seeing an <option> doesn't mean we're in a <select>
          // but
          case 'option':
            return tag === '#text';

          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intd
          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incaption
          // No special behavior since these rules fall back to "in body" mode for
          // all except special table nodes which cause bad parsing behavior anyway.

          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intr
          case 'tr':
            return tag === 'th' || tag === 'td' || tag === 'style' || tag === 'script' || tag === 'template';

          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intbody
          case 'tbody':
          case 'thead':
          case 'tfoot':
            return tag === 'tr' || tag === 'style' || tag === 'script' || tag === 'template';

          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-incolgroup
          case 'colgroup':
            return tag === 'col' || tag === 'template';

          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-intable
          case 'table':
            return tag === 'caption' || tag === 'colgroup' || tag === 'tbody' || tag === 'tfoot' || tag === 'thead' || tag === 'style' || tag === 'script' || tag === 'template';

          // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inhead
          case 'head':
            return tag === 'base' || tag === 'basefont' || tag === 'bgsound' || tag === 'link' || tag === 'meta' || tag === 'title' || tag === 'noscript' || tag === 'noframes' || tag === 'style' || tag === 'script' || tag === 'template';

          // https://html.spec.whatwg.org/multipage/semantics.html#the-html-element
          case 'html':
            return tag === 'head' || tag === 'body';
          case '#document':
            return tag === 'html';
        }

        // Probably in the "in body" parsing mode, so we outlaw only tag combos
        // where the parsing rules cause implicit opens or closes to be added.
        // https://html.spec.whatwg.org/multipage/syntax.html#parsing-main-inbody
        switch (tag) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            return parentTag !== 'h1' && parentTag !== 'h2' && parentTag !== 'h3' && parentTag !== 'h4' && parentTag !== 'h5' && parentTag !== 'h6';

          case 'rp':
          case 'rt':
            return impliedEndTags.indexOf(parentTag) === -1;

          case 'body':
          case 'caption':
          case 'col':
          case 'colgroup':
          case 'frame':
          case 'head':
          case 'html':
          case 'tbody':
          case 'td':
          case 'tfoot':
          case 'th':
          case 'thead':
          case 'tr':
            // These tags are only valid with a few parents that have special child
            // parsing rules -- if we're down here, then none of those matched and
            // so we allow it only if we don't know what the parent is, as all other
            // cases are invalid.
            return parentTag == null;
        }

        return true;
      };

      /**
       * Returns whether
       */
      var findInvalidAncestorForTag = function findInvalidAncestorForTag(tag, ancestorInfo) {
        switch (tag) {
          case 'address':
          case 'article':
          case 'aside':
          case 'blockquote':
          case 'center':
          case 'details':
          case 'dialog':
          case 'dir':
          case 'div':
          case 'dl':
          case 'fieldset':
          case 'figcaption':
          case 'figure':
          case 'footer':
          case 'header':
          case 'hgroup':
          case 'main':
          case 'menu':
          case 'nav':
          case 'ol':
          case 'p':
          case 'section':
          case 'summary':
          case 'ul':

          case 'pre':
          case 'listing':

          case 'table':

          case 'hr':

          case 'xmp':

          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            return ancestorInfo.pTagInButtonScope;

          case 'form':
            return ancestorInfo.formTag || ancestorInfo.pTagInButtonScope;

          case 'li':
            return ancestorInfo.listItemTagAutoclosing;

          case 'dd':
          case 'dt':
            return ancestorInfo.dlItemTagAutoclosing;

          case 'button':
            return ancestorInfo.buttonTagInScope;

          case 'a':
            // Spec says something about storing a list of markers, but it sounds
            // equivalent to this check.
            return ancestorInfo.aTagInScope;

          case 'nobr':
            return ancestorInfo.nobrTagInScope;
        }

        return null;
      };

      /**
       * Given a ReactCompositeComponent instance, return a list of its recursive
       * owners, starting at the root and ending with the instance itself.
       */
      var findOwnerStack = function findOwnerStack(instance) {
        if (!instance) {
          return [];
        }

        var stack = [];
        do {
          stack.push(instance);
        } while (instance = instance._currentElement._owner);
        stack.reverse();
        return stack;
      };

      var didWarn = {};

      validateDOMNesting$2 = function validateDOMNesting$2(childTag, childText, childInstance, ancestorInfo) {
        ancestorInfo = ancestorInfo || emptyAncestorInfo;
        var parentInfo = ancestorInfo.current;
        var parentTag = parentInfo && parentInfo.tag;

        if (childText != null) {
          process.env.NODE_ENV !== 'production' ? warning$16(childTag == null, 'validateDOMNesting: when childText is passed, childTag should be null') : void 0;
          childTag = '#text';
        }

        var invalidParent = isTagValidWithParent(childTag, parentTag) ? null : parentInfo;
        var invalidAncestor = invalidParent ? null : findInvalidAncestorForTag(childTag, ancestorInfo);
        var problematic = invalidParent || invalidAncestor;

        if (problematic) {
          var ancestorTag = problematic.tag;
          var ancestorInstance = problematic.instance;

          var childOwner = childInstance && childInstance._currentElement._owner;
          var ancestorOwner = ancestorInstance && ancestorInstance._currentElement._owner;

          var childOwners = findOwnerStack(childOwner);
          var ancestorOwners = findOwnerStack(ancestorOwner);

          var minStackLen = Math.min(childOwners.length, ancestorOwners.length);
          var i;

          var deepestCommon = -1;
          for (i = 0; i < minStackLen; i++) {
            if (childOwners[i] === ancestorOwners[i]) {
              deepestCommon = i;
            } else {
              break;
            }
          }

          var UNKNOWN = '(unknown)';
          var childOwnerNames = childOwners.slice(deepestCommon + 1).map(function (inst) {
            return inst.getName() || UNKNOWN;
          });
          var ancestorOwnerNames = ancestorOwners.slice(deepestCommon + 1).map(function (inst) {
            return inst.getName() || UNKNOWN;
          });
          var ownerInfo = [].concat(
          // If the parent and child instances have a common owner ancestor, start
          // with that -- otherwise we just start with the parent's owners.
          deepestCommon !== -1 ? childOwners[deepestCommon].getName() || UNKNOWN : [], ancestorOwnerNames, ancestorTag,
          // If we're warning about an invalid (non-parent) ancestry, add '...'
          invalidAncestor ? ['...'] : [], childOwnerNames, childTag).join(' > ');

          var warnKey = !!invalidParent + '|' + childTag + '|' + ancestorTag + '|' + ownerInfo;
          if (didWarn[warnKey]) {
            return;
          }
          didWarn[warnKey] = true;

          var tagDisplayName = childTag;
          var whitespaceInfo = '';
          if (childTag === '#text') {
            if (/\S/.test(childText)) {
              tagDisplayName = 'Text nodes';
            } else {
              tagDisplayName = 'Whitespace text nodes';
              whitespaceInfo = ' Make sure you don\'t have any extra whitespace between tags on ' + 'each line of your source code.';
            }
          } else {
            tagDisplayName = '<' + childTag + '>';
          }

          if (invalidParent) {
            var info = '';
            if (ancestorTag === 'table' && childTag === 'tr') {
              info += ' Add a <tbody> to your code to match the DOM tree generated by ' + 'the browser.';
            }
            process.env.NODE_ENV !== 'production' ? warning$16(false, 'validateDOMNesting(...): %s cannot appear as a child of <%s>.%s ' + 'See %s.%s', tagDisplayName, ancestorTag, whitespaceInfo, ownerInfo, info) : void 0;
          } else {
            process.env.NODE_ENV !== 'production' ? warning$16(false, 'validateDOMNesting(...): %s cannot appear as a descendant of ' + '<%s>. See %s.', tagDisplayName, ancestorTag, ownerInfo) : void 0;
          }
        }
      };

      validateDOMNesting$2.updatedAncestorInfo = updatedAncestorInfo;

      // For testing
      validateDOMNesting$2.isTagValidInContext = function (tag, ancestorInfo) {
        ancestorInfo = ancestorInfo || emptyAncestorInfo;
        var parentInfo = ancestorInfo.current;
        var parentTag = parentInfo && parentInfo.tag;
        return isTagValidWithParent(tag, parentTag) && !findInvalidAncestorForTag(tag, ancestorInfo);
      };
    }

    var validateDOMNesting_1 = validateDOMNesting$2;

    var _prodInvariant$17 = reactProdInvariant_1$2;
    var _assign$8 = index;

    var DOMChildrenOperations$3 = DOMChildrenOperations_1;
    var DOMLazyTree$5 = DOMLazyTree_1;
    var ReactDOMComponentTree$9 = ReactDOMComponentTree_1;

    var escapeTextContentForBrowser$3 = escapeTextContentForBrowser_1;
    var invariant$21 = invariant_1;
    var validateDOMNesting$1 = validateDOMNesting_1;

    /**
     * Text nodes violate a couple assumptions that React makes about components:
     *
     *  - When mounting text into the DOM, adjacent text nodes are merged.
     *  - Text nodes cannot be assigned a React root ID.
     *
     * This component is used to wrap strings between comment nodes so that they
     * can undergo the same reconciliation that is applied to elements.
     *
     * TODO: Investigate representing React components in the DOM with text nodes.
     *
     * @class ReactDOMTextComponent
     * @extends ReactComponent
     * @internal
     */
    var ReactDOMTextComponent$1 = function ReactDOMTextComponent$1(text) {
      // TODO: This is really a ReactText (ReactNode), not a ReactElement
      this._currentElement = text;
      this._stringText = '' + text;
      // ReactDOMComponentTree uses these:
      this._hostNode = null;
      this._hostParent = null;

      // Properties
      this._domID = 0;
      this._mountIndex = 0;
      this._closingComment = null;
      this._commentNodes = null;
    };

    _assign$8(ReactDOMTextComponent$1.prototype, {

      /**
       * Creates the markup for this text node. This node is not intended to have
       * any features besides containing text content.
       *
       * @param {ReactReconcileTransaction|ReactServerRenderingTransaction} transaction
       * @return {string} Markup for this text node.
       * @internal
       */
      mountComponent: function mountComponent(transaction, hostParent, hostContainerInfo, context) {
        if (process.env.NODE_ENV !== 'production') {
          var parentInfo;
          if (hostParent != null) {
            parentInfo = hostParent._ancestorInfo;
          } else if (hostContainerInfo != null) {
            parentInfo = hostContainerInfo._ancestorInfo;
          }
          if (parentInfo) {
            // parentInfo should always be present except for the top-level
            // component when server rendering
            validateDOMNesting$1(null, this._stringText, this, parentInfo);
          }
        }

        var domID = hostContainerInfo._idCounter++;
        var openingValue = ' react-text: ' + domID + ' ';
        var closingValue = ' /react-text ';
        this._domID = domID;
        this._hostParent = hostParent;
        if (transaction.useCreateElement) {
          var ownerDocument = hostContainerInfo._ownerDocument;
          var openingComment = ownerDocument.createComment(openingValue);
          var closingComment = ownerDocument.createComment(closingValue);
          var lazyTree = DOMLazyTree$5(ownerDocument.createDocumentFragment());
          DOMLazyTree$5.queueChild(lazyTree, DOMLazyTree$5(openingComment));
          if (this._stringText) {
            DOMLazyTree$5.queueChild(lazyTree, DOMLazyTree$5(ownerDocument.createTextNode(this._stringText)));
          }
          DOMLazyTree$5.queueChild(lazyTree, DOMLazyTree$5(closingComment));
          ReactDOMComponentTree$9.precacheNode(this, openingComment);
          this._closingComment = closingComment;
          return lazyTree;
        } else {
          var escapedText = escapeTextContentForBrowser$3(this._stringText);

          if (transaction.renderToStaticMarkup) {
            // Normally we'd wrap this between comment nodes for the reasons stated
            // above, but since this is a situation where React won't take over
            // (static pages), we can simply return the text as it is.
            return escapedText;
          }

          return '<!--' + openingValue + '-->' + escapedText + '<!--' + closingValue + '-->';
        }
      },

      /**
       * Updates this component by updating the text content.
       *
       * @param {ReactText} nextText The next text content
       * @param {ReactReconcileTransaction} transaction
       * @internal
       */
      receiveComponent: function receiveComponent(nextText, transaction) {
        if (nextText !== this._currentElement) {
          this._currentElement = nextText;
          var nextStringText = '' + nextText;
          if (nextStringText !== this._stringText) {
            // TODO: Save this as pending props and use performUpdateIfNecessary
            // and/or updateComponent to do the actual update for consistency with
            // other component types?
            this._stringText = nextStringText;
            var commentNodes = this.getHostNode();
            DOMChildrenOperations$3.replaceDelimitedText(commentNodes[0], commentNodes[1], nextStringText);
          }
        }
      },

      getHostNode: function getHostNode() {
        var hostNode = this._commentNodes;
        if (hostNode) {
          return hostNode;
        }
        if (!this._closingComment) {
          var openingComment = ReactDOMComponentTree$9.getNodeFromInstance(this);
          var node = openingComment.nextSibling;
          while (true) {
            !(node != null) ? process.env.NODE_ENV !== 'production' ? invariant$21(false, 'Missing closing comment for text component %s', this._domID) : _prodInvariant$17('67', this._domID) : void 0;
            if (node.nodeType === 8 && node.nodeValue === ' /react-text ') {
              this._closingComment = node;
              break;
            }
            node = node.nextSibling;
          }
        }
        hostNode = [this._hostNode, this._closingComment];
        this._commentNodes = hostNode;
        return hostNode;
      },

      unmountComponent: function unmountComponent() {
        this._closingComment = null;
        this._commentNodes = null;
        ReactDOMComponentTree$9.uncacheNode(this);
      }

    });

    var ReactDOMTextComponent_1 = ReactDOMTextComponent$1;

    var _assign$10 = index;

    var ReactUpdates$3 = ReactUpdates_1;
    var Transaction$3 = Transaction$1;

    var emptyFunction$8 = emptyFunction_1;

    var RESET_BATCHED_UPDATES = {
      initialize: emptyFunction$8,
      close: function close() {
        ReactDefaultBatchingStrategy$1.isBatchingUpdates = false;
      }
    };

    var FLUSH_BATCHED_UPDATES = {
      initialize: emptyFunction$8,
      close: ReactUpdates$3.flushBatchedUpdates.bind(ReactUpdates$3)
    };

    var TRANSACTION_WRAPPERS$1 = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

    function ReactDefaultBatchingStrategyTransaction() {
      this.reinitializeTransaction();
    }

    _assign$10(ReactDefaultBatchingStrategyTransaction.prototype, Transaction$3, {
      getTransactionWrappers: function getTransactionWrappers() {
        return TRANSACTION_WRAPPERS$1;
      }
    });

    var transaction = new ReactDefaultBatchingStrategyTransaction();

    var ReactDefaultBatchingStrategy$1 = {
      isBatchingUpdates: false,

      /**
       * Call the provided function in a context within which calls to `setState`
       * and friends are batched such that components aren't updated unnecessarily.
       */
      batchedUpdates: function batchedUpdates(callback, a, b, c, d, e) {
        var alreadyBatchingUpdates = ReactDefaultBatchingStrategy$1.isBatchingUpdates;

        ReactDefaultBatchingStrategy$1.isBatchingUpdates = true;

        // The code is written this way to avoid extra allocations
        if (alreadyBatchingUpdates) {
          return callback(a, b, c, d, e);
        } else {
          return transaction.perform(callback, null, a, b, c, d, e);
        }
      }
    };

    var ReactDefaultBatchingStrategy_1 = ReactDefaultBatchingStrategy$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * @typechecks
     */

    var emptyFunction$9 = emptyFunction_1;

    /**
     * Upstream version of event listener. Does not take into account specific
     * nature of platform.
     */
    var EventListener$1 = {
      /**
       * Listen to DOM events during the bubble phase.
       *
       * @param {DOMEventTarget} target DOM element to register listener on.
       * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
       * @param {function} callback Callback function.
       * @return {object} Object with a `remove` method.
       */
      listen: function listen(target, eventType, callback) {
        if (target.addEventListener) {
          target.addEventListener(eventType, callback, false);
          return {
            remove: function remove() {
              target.removeEventListener(eventType, callback, false);
            }
          };
        } else if (target.attachEvent) {
          target.attachEvent('on' + eventType, callback);
          return {
            remove: function remove() {
              target.detachEvent('on' + eventType, callback);
            }
          };
        }
      },

      /**
       * Listen to DOM events during the capture phase.
       *
       * @param {DOMEventTarget} target DOM element to register listener on.
       * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
       * @param {function} callback Callback function.
       * @return {object} Object with a `remove` method.
       */
      capture: function capture(target, eventType, callback) {
        if (target.addEventListener) {
          target.addEventListener(eventType, callback, true);
          return {
            remove: function remove() {
              target.removeEventListener(eventType, callback, true);
            }
          };
        } else {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Attempted to listen to events during the capture phase on a ' + 'browser that does not support the capture phase. Your application ' + 'will not receive some events.');
          }
          return {
            remove: emptyFunction$9
          };
        }
      },

      registerDefault: function registerDefault() {}
    };

    var EventListener_1 = EventListener$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    /**
     * Gets the scroll position of the supplied element or window.
     *
     * The return values are unbounded, unlike `getScrollPosition`. This means they
     * may be negative or exceed the element boundaries (which is possible using
     * inertial scrolling).
     *
     * @param {DOMWindow|DOMElement} scrollable
     * @return {object} Map with `x` and `y` keys.
     */

    function getUnboundedScrollPosition$1(scrollable) {
      if (scrollable === window) {
        return {
          x: window.pageXOffset || document.documentElement.scrollLeft,
          y: window.pageYOffset || document.documentElement.scrollTop
        };
      }
      return {
        x: scrollable.scrollLeft,
        y: scrollable.scrollTop
      };
    }

    var getUnboundedScrollPosition_1 = getUnboundedScrollPosition$1;

    var _assign$11 = index;

    var EventListener = EventListener_1;
    var ExecutionEnvironment$11 = ExecutionEnvironment_1;
    var PooledClass$6 = PooledClass_1$2;
    var ReactDOMComponentTree$10 = ReactDOMComponentTree_1;
    var ReactUpdates$4 = ReactUpdates_1;

    var getEventTarget$3 = getEventTarget_1;
    var getUnboundedScrollPosition = getUnboundedScrollPosition_1;

    /**
     * Find the deepest React component completely containing the root of the
     * passed-in instance (for use when entire React trees are nested within each
     * other). If React trees are not nested, returns null.
     */
    function findParent(inst) {
      // TODO: It may be a good idea to cache this to prevent unnecessary DOM
      // traversal, but caching is difficult to do correctly without using a
      // mutation observer to listen for all DOM changes.
      while (inst._hostParent) {
        inst = inst._hostParent;
      }
      var rootNode = ReactDOMComponentTree$10.getNodeFromInstance(inst);
      var container = rootNode.parentNode;
      return ReactDOMComponentTree$10.getClosestInstanceFromNode(container);
    }

    // Used to store ancestor hierarchy in top level callback
    function TopLevelCallbackBookKeeping(topLevelType, nativeEvent) {
      this.topLevelType = topLevelType;
      this.nativeEvent = nativeEvent;
      this.ancestors = [];
    }
    _assign$11(TopLevelCallbackBookKeeping.prototype, {
      destructor: function destructor() {
        this.topLevelType = null;
        this.nativeEvent = null;
        this.ancestors.length = 0;
      }
    });
    PooledClass$6.addPoolingTo(TopLevelCallbackBookKeeping, PooledClass$6.twoArgumentPooler);

    function handleTopLevelImpl(bookKeeping) {
      var nativeEventTarget = getEventTarget$3(bookKeeping.nativeEvent);
      var targetInst = ReactDOMComponentTree$10.getClosestInstanceFromNode(nativeEventTarget);

      // Loop through the hierarchy, in case there's any nested components.
      // It's important that we build the array of ancestors before calling any
      // event handlers, because event handlers can modify the DOM, leading to
      // inconsistencies with ReactMount's node cache. See #1105.
      var ancestor = targetInst;
      do {
        bookKeeping.ancestors.push(ancestor);
        ancestor = ancestor && findParent(ancestor);
      } while (ancestor);

      for (var i = 0; i < bookKeeping.ancestors.length; i++) {
        targetInst = bookKeeping.ancestors[i];
        ReactEventListener$1._handleTopLevel(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget$3(bookKeeping.nativeEvent));
      }
    }

    function scrollValueMonitor(cb) {
      var scrollPosition = getUnboundedScrollPosition(window);
      cb(scrollPosition);
    }

    var ReactEventListener$1 = {
      _enabled: true,
      _handleTopLevel: null,

      WINDOW_HANDLE: ExecutionEnvironment$11.canUseDOM ? window : null,

      setHandleTopLevel: function setHandleTopLevel(handleTopLevel) {
        ReactEventListener$1._handleTopLevel = handleTopLevel;
      },

      setEnabled: function setEnabled(enabled) {
        ReactEventListener$1._enabled = !!enabled;
      },

      isEnabled: function isEnabled() {
        return ReactEventListener$1._enabled;
      },

      /**
       * Traps top-level events by using event bubbling.
       *
       * @param {string} topLevelType Record from `EventConstants`.
       * @param {string} handlerBaseName Event name (e.g. "click").
       * @param {object} element Element on which to attach listener.
       * @return {?object} An object with a remove function which will forcefully
       *                  remove the listener.
       * @internal
       */
      trapBubbledEvent: function trapBubbledEvent(topLevelType, handlerBaseName, element) {
        if (!element) {
          return null;
        }
        return EventListener.listen(element, handlerBaseName, ReactEventListener$1.dispatchEvent.bind(null, topLevelType));
      },

      /**
       * Traps a top-level event by using event capturing.
       *
       * @param {string} topLevelType Record from `EventConstants`.
       * @param {string} handlerBaseName Event name (e.g. "click").
       * @param {object} element Element on which to attach listener.
       * @return {?object} An object with a remove function which will forcefully
       *                  remove the listener.
       * @internal
       */
      trapCapturedEvent: function trapCapturedEvent(topLevelType, handlerBaseName, element) {
        if (!element) {
          return null;
        }
        return EventListener.capture(element, handlerBaseName, ReactEventListener$1.dispatchEvent.bind(null, topLevelType));
      },

      monitorScrollValue: function monitorScrollValue(refresh) {
        var callback = scrollValueMonitor.bind(null, refresh);
        EventListener.listen(window, 'scroll', callback);
      },

      dispatchEvent: function dispatchEvent(topLevelType, nativeEvent) {
        if (!ReactEventListener$1._enabled) {
          return;
        }

        var bookKeeping = TopLevelCallbackBookKeeping.getPooled(topLevelType, nativeEvent);
        try {
          // Event queue being processed in the same cycle allows
          // `preventDefault`.
          ReactUpdates$4.batchedUpdates(handleTopLevelImpl, bookKeeping);
        } finally {
          TopLevelCallbackBookKeeping.release(bookKeeping);
        }
      }
    };

    var ReactEventListener_1 = ReactEventListener$1;

    var _prodInvariant$18 = reactProdInvariant_1$2;

    var invariant$22 = invariant_1;

    var injected = false;

    var ReactComponentEnvironment$1 = {

      /**
       * Optionally injectable hook for swapping out mount images in the middle of
       * the tree.
       */
      replaceNodeWithMarkup: null,

      /**
       * Optionally injectable hook for processing a queue of child updates. Will
       * later move into MultiChildComponents.
       */
      processChildrenUpdates: null,

      injection: {
        injectEnvironment: function injectEnvironment(environment) {
          !!injected ? process.env.NODE_ENV !== 'production' ? invariant$22(false, 'ReactCompositeComponent: injectEnvironment() can only be called once.') : _prodInvariant$18('104') : void 0;
          ReactComponentEnvironment$1.replaceNodeWithMarkup = environment.replaceNodeWithMarkup;
          ReactComponentEnvironment$1.processChildrenUpdates = environment.processChildrenUpdates;
          injected = true;
        }
      }

    };

    var ReactComponentEnvironment_1 = ReactComponentEnvironment$1;

    /**
     * Copyright 2014-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var emptyComponentFactory;

    var ReactEmptyComponentInjection = {
      injectEmptyComponentFactory: function injectEmptyComponentFactory(factory) {
        emptyComponentFactory = factory;
      }
    };

    var ReactEmptyComponent$1 = {
      create: function create(instantiate) {
        return emptyComponentFactory(instantiate);
      }
    };

    ReactEmptyComponent$1.injection = ReactEmptyComponentInjection;

    var ReactEmptyComponent_1 = ReactEmptyComponent$1;

    var _prodInvariant$19 = reactProdInvariant_1$2;

    var invariant$23 = invariant_1;

    /**
     * Injectable ordering of event plugins.
     */
    var eventPluginOrder = null;

    /**
     * Injectable mapping from names to event plugin modules.
     */
    var namesToPlugins = {};

    /**
     * Recomputes the plugin list using the injected plugins and plugin ordering.
     *
     * @private
     */
    function recomputePluginOrdering() {
      if (!eventPluginOrder) {
        // Wait until an `eventPluginOrder` is injected.
        return;
      }
      for (var pluginName in namesToPlugins) {
        var pluginModule = namesToPlugins[pluginName];
        var pluginIndex = eventPluginOrder.indexOf(pluginName);
        !(pluginIndex > -1) ? process.env.NODE_ENV !== 'production' ? invariant$23(false, 'EventPluginRegistry: Cannot inject event plugins that do not exist in the plugin ordering, `%s`.', pluginName) : _prodInvariant$19('96', pluginName) : void 0;
        if (EventPluginRegistry$3.plugins[pluginIndex]) {
          continue;
        }
        !pluginModule.extractEvents ? process.env.NODE_ENV !== 'production' ? invariant$23(false, 'EventPluginRegistry: Event plugins must implement an `extractEvents` method, but `%s` does not.', pluginName) : _prodInvariant$19('97', pluginName) : void 0;
        EventPluginRegistry$3.plugins[pluginIndex] = pluginModule;
        var publishedEvents = pluginModule.eventTypes;
        for (var eventName in publishedEvents) {
          !publishEventForPlugin(publishedEvents[eventName], pluginModule, eventName) ? process.env.NODE_ENV !== 'production' ? invariant$23(false, 'EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.', eventName, pluginName) : _prodInvariant$19('98', eventName, pluginName) : void 0;
        }
      }
    }

    /**
     * Publishes an event so that it can be dispatched by the supplied plugin.
     *
     * @param {object} dispatchConfig Dispatch configuration for the event.
     * @param {object} PluginModule Plugin publishing the event.
     * @return {boolean} True if the event was successfully published.
     * @private
     */
    function publishEventForPlugin(dispatchConfig, pluginModule, eventName) {
      !!EventPluginRegistry$3.eventNameDispatchConfigs.hasOwnProperty(eventName) ? process.env.NODE_ENV !== 'production' ? invariant$23(false, 'EventPluginHub: More than one plugin attempted to publish the same event name, `%s`.', eventName) : _prodInvariant$19('99', eventName) : void 0;
      EventPluginRegistry$3.eventNameDispatchConfigs[eventName] = dispatchConfig;

      var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
      if (phasedRegistrationNames) {
        for (var phaseName in phasedRegistrationNames) {
          if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
            var phasedRegistrationName = phasedRegistrationNames[phaseName];
            publishRegistrationName(phasedRegistrationName, pluginModule, eventName);
          }
        }
        return true;
      } else if (dispatchConfig.registrationName) {
        publishRegistrationName(dispatchConfig.registrationName, pluginModule, eventName);
        return true;
      }
      return false;
    }

    /**
     * Publishes a registration name that is used to identify dispatched events and
     * can be used with `EventPluginHub.putListener` to register listeners.
     *
     * @param {string} registrationName Registration name to add.
     * @param {object} PluginModule Plugin publishing the event.
     * @private
     */
    function publishRegistrationName(registrationName, pluginModule, eventName) {
      !!EventPluginRegistry$3.registrationNameModules[registrationName] ? process.env.NODE_ENV !== 'production' ? invariant$23(false, 'EventPluginHub: More than one plugin attempted to publish the same registration name, `%s`.', registrationName) : _prodInvariant$19('100', registrationName) : void 0;
      EventPluginRegistry$3.registrationNameModules[registrationName] = pluginModule;
      EventPluginRegistry$3.registrationNameDependencies[registrationName] = pluginModule.eventTypes[eventName].dependencies;

      if (process.env.NODE_ENV !== 'production') {
        var lowerCasedName = registrationName.toLowerCase();
        EventPluginRegistry$3.possibleRegistrationNames[lowerCasedName] = registrationName;

        if (registrationName === 'onDoubleClick') {
          EventPluginRegistry$3.possibleRegistrationNames.ondblclick = registrationName;
        }
      }
    }

    /**
     * Registers plugins so that they can extract and dispatch events.
     *
     * @see {EventPluginHub}
     */
    var EventPluginRegistry$3 = {

      /**
       * Ordered list of injected plugins.
       */
      plugins: [],

      /**
       * Mapping from event name to dispatch config
       */
      eventNameDispatchConfigs: {},

      /**
       * Mapping from registration name to plugin module
       */
      registrationNameModules: {},

      /**
       * Mapping from registration name to event name
       */
      registrationNameDependencies: {},

      /**
       * Mapping from lowercase registration names to the properly cased version,
       * used to warn in the case of missing event handlers. Available
       * only in __DEV__.
       * @type {Object}
       */
      possibleRegistrationNames: process.env.NODE_ENV !== 'production' ? {} : null,
      // Trust the developer to only use possibleRegistrationNames in __DEV__

      /**
       * Injects an ordering of plugins (by plugin name). This allows the ordering
       * to be decoupled from injection of the actual plugins so that ordering is
       * always deterministic regardless of packaging, on-the-fly injection, etc.
       *
       * @param {array} InjectedEventPluginOrder
       * @internal
       * @see {EventPluginHub.injection.injectEventPluginOrder}
       */
      injectEventPluginOrder: function injectEventPluginOrder(injectedEventPluginOrder) {
        !!eventPluginOrder ? process.env.NODE_ENV !== 'production' ? invariant$23(false, 'EventPluginRegistry: Cannot inject event plugin ordering more than once. You are likely trying to load more than one copy of React.') : _prodInvariant$19('101') : void 0;
        // Clone the ordering so it cannot be dynamically mutated.
        eventPluginOrder = Array.prototype.slice.call(injectedEventPluginOrder);
        recomputePluginOrdering();
      },

      /**
       * Injects plugins to be used by `EventPluginHub`. The plugin names must be
       * in the ordering injected by `injectEventPluginOrder`.
       *
       * Plugins can be injected as part of page initialization or on-the-fly.
       *
       * @param {object} injectedNamesToPlugins Map from names to plugin modules.
       * @internal
       * @see {EventPluginHub.injection.injectEventPluginsByName}
       */
      injectEventPluginsByName: function injectEventPluginsByName(injectedNamesToPlugins) {
        var isOrderingDirty = false;
        for (var pluginName in injectedNamesToPlugins) {
          if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
            continue;
          }
          var pluginModule = injectedNamesToPlugins[pluginName];
          if (!namesToPlugins.hasOwnProperty(pluginName) || namesToPlugins[pluginName] !== pluginModule) {
            !!namesToPlugins[pluginName] ? process.env.NODE_ENV !== 'production' ? invariant$23(false, 'EventPluginRegistry: Cannot inject two different event plugins using the same name, `%s`.', pluginName) : _prodInvariant$19('102', pluginName) : void 0;
            namesToPlugins[pluginName] = pluginModule;
            isOrderingDirty = true;
          }
        }
        if (isOrderingDirty) {
          recomputePluginOrdering();
        }
      },

      /**
       * Looks up the plugin for the supplied event.
       *
       * @param {object} event A synthetic event.
       * @return {?object} The plugin that created the supplied event.
       * @internal
       */
      getPluginModuleForEvent: function getPluginModuleForEvent(event) {
        var dispatchConfig = event.dispatchConfig;
        if (dispatchConfig.registrationName) {
          return EventPluginRegistry$3.registrationNameModules[dispatchConfig.registrationName] || null;
        }
        if (dispatchConfig.phasedRegistrationNames !== undefined) {
          // pulling phasedRegistrationNames out of dispatchConfig helps Flow see
          // that it is not undefined.
          var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;

          for (var phase in phasedRegistrationNames) {
            if (!phasedRegistrationNames.hasOwnProperty(phase)) {
              continue;
            }
            var pluginModule = EventPluginRegistry$3.registrationNameModules[phasedRegistrationNames[phase]];
            if (pluginModule) {
              return pluginModule;
            }
          }
        }
        return null;
      },

      /**
       * Exposed for unit testing.
       * @private
       */
      _resetEventPlugins: function _resetEventPlugins() {
        eventPluginOrder = null;
        for (var pluginName in namesToPlugins) {
          if (namesToPlugins.hasOwnProperty(pluginName)) {
            delete namesToPlugins[pluginName];
          }
        }
        EventPluginRegistry$3.plugins.length = 0;

        var eventNameDispatchConfigs = EventPluginRegistry$3.eventNameDispatchConfigs;
        for (var eventName in eventNameDispatchConfigs) {
          if (eventNameDispatchConfigs.hasOwnProperty(eventName)) {
            delete eventNameDispatchConfigs[eventName];
          }
        }

        var registrationNameModules = EventPluginRegistry$3.registrationNameModules;
        for (var registrationName in registrationNameModules) {
          if (registrationNameModules.hasOwnProperty(registrationName)) {
            delete registrationNameModules[registrationName];
          }
        }

        if (process.env.NODE_ENV !== 'production') {
          var possibleRegistrationNames = EventPluginRegistry$3.possibleRegistrationNames;
          for (var lowerCasedName in possibleRegistrationNames) {
            if (possibleRegistrationNames.hasOwnProperty(lowerCasedName)) {
              delete possibleRegistrationNames[lowerCasedName];
            }
          }
        }
      }

    };

    var EventPluginRegistry_1 = EventPluginRegistry$3;

    var EventPluginHub$6 = require$$0$5;

    function runEventQueueInBatch(events) {
      EventPluginHub$6.enqueueEvents(events);
      EventPluginHub$6.processEventQueue(false);
    }

    var ReactEventEmitterMixin$1 = {

      /**
       * Streams a fired top-level event to `EventPluginHub` where plugins have the
       * opportunity to create `ReactEvent`s to be dispatched.
       */
      handleTopLevel: function handleTopLevel(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var events = EventPluginHub$6.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
        runEventQueueInBatch(events);
      }
    };

    var ReactEventEmitterMixin_1 = ReactEventEmitterMixin$1;

    var ExecutionEnvironment$12 = ExecutionEnvironment_1;

    /**
     * Generate a mapping of standard vendor prefixes using the defined style property and event name.
     *
     * @param {string} styleProp
     * @param {string} eventName
     * @returns {object}
     */
    function makePrefixMap(styleProp, eventName) {
      var prefixes = {};

      prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
      prefixes['Webkit' + styleProp] = 'webkit' + eventName;
      prefixes['Moz' + styleProp] = 'moz' + eventName;
      prefixes['ms' + styleProp] = 'MS' + eventName;
      prefixes['O' + styleProp] = 'o' + eventName.toLowerCase();

      return prefixes;
    }

    /**
     * A list of event names to a configurable list of vendor prefixes.
     */
    var vendorPrefixes = {
      animationend: makePrefixMap('Animation', 'AnimationEnd'),
      animationiteration: makePrefixMap('Animation', 'AnimationIteration'),
      animationstart: makePrefixMap('Animation', 'AnimationStart'),
      transitionend: makePrefixMap('Transition', 'TransitionEnd')
    };

    /**
     * Event names that have already been detected and prefixed (if applicable).
     */
    var prefixedEventNames = {};

    /**
     * Element to check for prefixes on.
     */
    var style = {};

    /**
     * Bootstrap if a DOM exists.
     */
    if (ExecutionEnvironment$12.canUseDOM) {
      style = document.createElement('div').style;

      // On some platforms, in particular some releases of Android 4.x,
      // the un-prefixed "animation" and "transition" properties are defined on the
      // style object but the events that fire will still be prefixed, so we need
      // to check if the un-prefixed events are usable, and if not remove them from the map.
      if (!('AnimationEvent' in window)) {
        delete vendorPrefixes.animationend.animation;
        delete vendorPrefixes.animationiteration.animation;
        delete vendorPrefixes.animationstart.animation;
      }

      // Same as above
      if (!('TransitionEvent' in window)) {
        delete vendorPrefixes.transitionend.transition;
      }
    }

    /**
     * Attempts to determine the correct vendor prefixed event name.
     *
     * @param {string} eventName
     * @returns {string}
     */
    function getVendorPrefixedEventName$1(eventName) {
      if (prefixedEventNames[eventName]) {
        return prefixedEventNames[eventName];
      } else if (!vendorPrefixes[eventName]) {
        return eventName;
      }

      var prefixMap = vendorPrefixes[eventName];

      for (var styleProp in prefixMap) {
        if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
          return prefixedEventNames[eventName] = prefixMap[styleProp];
        }
      }

      return '';
    }

    var getVendorPrefixedEventName_1 = getVendorPrefixedEventName$1;

    var _assign$12 = index;

    var EventPluginRegistry$2 = EventPluginRegistry_1;
    var ReactEventEmitterMixin = ReactEventEmitterMixin_1;
    var ViewportMetrics$2 = ViewportMetrics_1;

    var getVendorPrefixedEventName = getVendorPrefixedEventName_1;
    var isEventSupported$3 = isEventSupported_1;

    /**
     * Summary of `ReactBrowserEventEmitter` event handling:
     *
     *  - Top-level delegation is used to trap most native browser events. This
     *    may only occur in the main thread and is the responsibility of
     *    ReactEventListener, which is injected and can therefore support pluggable
     *    event sources. This is the only work that occurs in the main thread.
     *
     *  - We normalize and de-duplicate events to account for browser quirks. This
     *    may be done in the worker thread.
     *
     *  - Forward these native events (with the associated top-level type used to
     *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
     *    to extract any synthetic events.
     *
     *  - The `EventPluginHub` will then process each event by annotating them with
     *    "dispatches", a sequence of listeners and IDs that care about that event.
     *
     *  - The `EventPluginHub` then dispatches the events.
     *
     * Overview of React and the event system:
     *
     * +------------+    .
     * |    DOM     |    .
     * +------------+    .
     *       |           .
     *       v           .
     * +------------+    .
     * | ReactEvent |    .
     * |  Listener  |    .
     * +------------+    .                         +-----------+
     *       |           .               +--------+|SimpleEvent|
     *       |           .               |         |Plugin     |
     * +-----|------+    .               v         +-----------+
     * |     |      |    .    +--------------+                    +------------+
     * |     +-----------.--->|EventPluginHub|                    |    Event   |
     * |            |    .    |              |     +-----------+  | Propagators|
     * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
     * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
     * |            |    .    |              |     +-----------+  |  utilities |
     * |     +-----------.--->|              |                    +------------+
     * |     |      |    .    +--------------+
     * +-----|------+    .                ^        +-----------+
     *       |           .                |        |Enter/Leave|
     *       +           .                +-------+|Plugin     |
     * +-------------+   .                         +-----------+
     * | application |   .
     * |-------------|   .
     * |             |   .
     * |             |   .
     * +-------------+   .
     *                   .
     *    React Core     .  General Purpose Event Plugin System
     */

    var hasEventPageXY;
    var alreadyListeningTo = {};
    var isMonitoringScrollValue = false;
    var reactTopListenersCounter = 0;

    // For events like 'submit' which don't consistently bubble (which we trap at a
    // lower node than `document`), binding at `document` would cause duplicate
    // events so we don't include them here
    var topEventMapping = {
      topAbort: 'abort',
      topAnimationEnd: getVendorPrefixedEventName('animationend') || 'animationend',
      topAnimationIteration: getVendorPrefixedEventName('animationiteration') || 'animationiteration',
      topAnimationStart: getVendorPrefixedEventName('animationstart') || 'animationstart',
      topBlur: 'blur',
      topCanPlay: 'canplay',
      topCanPlayThrough: 'canplaythrough',
      topChange: 'change',
      topClick: 'click',
      topCompositionEnd: 'compositionend',
      topCompositionStart: 'compositionstart',
      topCompositionUpdate: 'compositionupdate',
      topContextMenu: 'contextmenu',
      topCopy: 'copy',
      topCut: 'cut',
      topDoubleClick: 'dblclick',
      topDrag: 'drag',
      topDragEnd: 'dragend',
      topDragEnter: 'dragenter',
      topDragExit: 'dragexit',
      topDragLeave: 'dragleave',
      topDragOver: 'dragover',
      topDragStart: 'dragstart',
      topDrop: 'drop',
      topDurationChange: 'durationchange',
      topEmptied: 'emptied',
      topEncrypted: 'encrypted',
      topEnded: 'ended',
      topError: 'error',
      topFocus: 'focus',
      topInput: 'input',
      topKeyDown: 'keydown',
      topKeyPress: 'keypress',
      topKeyUp: 'keyup',
      topLoadedData: 'loadeddata',
      topLoadedMetadata: 'loadedmetadata',
      topLoadStart: 'loadstart',
      topMouseDown: 'mousedown',
      topMouseMove: 'mousemove',
      topMouseOut: 'mouseout',
      topMouseOver: 'mouseover',
      topMouseUp: 'mouseup',
      topPaste: 'paste',
      topPause: 'pause',
      topPlay: 'play',
      topPlaying: 'playing',
      topProgress: 'progress',
      topRateChange: 'ratechange',
      topScroll: 'scroll',
      topSeeked: 'seeked',
      topSeeking: 'seeking',
      topSelectionChange: 'selectionchange',
      topStalled: 'stalled',
      topSuspend: 'suspend',
      topTextInput: 'textInput',
      topTimeUpdate: 'timeupdate',
      topTouchCancel: 'touchcancel',
      topTouchEnd: 'touchend',
      topTouchMove: 'touchmove',
      topTouchStart: 'touchstart',
      topTransitionEnd: getVendorPrefixedEventName('transitionend') || 'transitionend',
      topVolumeChange: 'volumechange',
      topWaiting: 'waiting',
      topWheel: 'wheel'
    };

    /**
     * To ensure no conflicts with other potential React instances on the page
     */
    var topListenersIDKey = '_reactListenersID' + String(Math.random()).slice(2);

    function getListeningForDocument(mountAt) {
      // In IE8, `mountAt` is a host object and doesn't have `hasOwnProperty`
      // directly.
      if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
        mountAt[topListenersIDKey] = reactTopListenersCounter++;
        alreadyListeningTo[mountAt[topListenersIDKey]] = {};
      }
      return alreadyListeningTo[mountAt[topListenersIDKey]];
    }

    /**
     * `ReactBrowserEventEmitter` is used to attach top-level event listeners. For
     * example:
     *
     *   EventPluginHub.putListener('myID', 'onClick', myFunction);
     *
     * This would allocate a "registration" of `('onClick', myFunction)` on 'myID'.
     *
     * @internal
     */
    var ReactBrowserEventEmitter$2 = _assign$12({}, ReactEventEmitterMixin, {

      /**
       * Injectable event backend
       */
      ReactEventListener: null,

      injection: {
        /**
         * @param {object} ReactEventListener
         */
        injectReactEventListener: function injectReactEventListener(ReactEventListener) {
          ReactEventListener.setHandleTopLevel(ReactBrowserEventEmitter$2.handleTopLevel);
          ReactBrowserEventEmitter$2.ReactEventListener = ReactEventListener;
        }
      },

      /**
       * Sets whether or not any created callbacks should be enabled.
       *
       * @param {boolean} enabled True if callbacks should be enabled.
       */
      setEnabled: function setEnabled(enabled) {
        if (ReactBrowserEventEmitter$2.ReactEventListener) {
          ReactBrowserEventEmitter$2.ReactEventListener.setEnabled(enabled);
        }
      },

      /**
       * @return {boolean} True if callbacks are enabled.
       */
      isEnabled: function isEnabled() {
        return !!(ReactBrowserEventEmitter$2.ReactEventListener && ReactBrowserEventEmitter$2.ReactEventListener.isEnabled());
      },

      /**
       * We listen for bubbled touch events on the document object.
       *
       * Firefox v8.01 (and possibly others) exhibited strange behavior when
       * mounting `onmousemove` events at some node that was not the document
       * element. The symptoms were that if your mouse is not moving over something
       * contained within that mount point (for example on the background) the
       * top-level listeners for `onmousemove` won't be called. However, if you
       * register the `mousemove` on the document object, then it will of course
       * catch all `mousemove`s. This along with iOS quirks, justifies restricting
       * top-level listeners to the document object only, at least for these
       * movement types of events and possibly all events.
       *
       * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
       *
       * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
       * they bubble to document.
       *
       * @param {string} registrationName Name of listener (e.g. `onClick`).
       * @param {object} contentDocumentHandle Document which owns the container
       */
      listenTo: function listenTo(registrationName, contentDocumentHandle) {
        var mountAt = contentDocumentHandle;
        var isListening = getListeningForDocument(mountAt);
        var dependencies = EventPluginRegistry$2.registrationNameDependencies[registrationName];

        for (var i = 0; i < dependencies.length; i++) {
          var dependency = dependencies[i];
          if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
            if (dependency === 'topWheel') {
              if (isEventSupported$3('wheel')) {
                ReactBrowserEventEmitter$2.ReactEventListener.trapBubbledEvent('topWheel', 'wheel', mountAt);
              } else if (isEventSupported$3('mousewheel')) {
                ReactBrowserEventEmitter$2.ReactEventListener.trapBubbledEvent('topWheel', 'mousewheel', mountAt);
              } else {
                // Firefox needs to capture a different mouse scroll event.
                // @see http://www.quirksmode.org/dom/events/tests/scroll.html
                ReactBrowserEventEmitter$2.ReactEventListener.trapBubbledEvent('topWheel', 'DOMMouseScroll', mountAt);
              }
            } else if (dependency === 'topScroll') {

              if (isEventSupported$3('scroll', true)) {
                ReactBrowserEventEmitter$2.ReactEventListener.trapCapturedEvent('topScroll', 'scroll', mountAt);
              } else {
                ReactBrowserEventEmitter$2.ReactEventListener.trapBubbledEvent('topScroll', 'scroll', ReactBrowserEventEmitter$2.ReactEventListener.WINDOW_HANDLE);
              }
            } else if (dependency === 'topFocus' || dependency === 'topBlur') {

              if (isEventSupported$3('focus', true)) {
                ReactBrowserEventEmitter$2.ReactEventListener.trapCapturedEvent('topFocus', 'focus', mountAt);
                ReactBrowserEventEmitter$2.ReactEventListener.trapCapturedEvent('topBlur', 'blur', mountAt);
              } else if (isEventSupported$3('focusin')) {
                // IE has `focusin` and `focusout` events which bubble.
                // @see http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
                ReactBrowserEventEmitter$2.ReactEventListener.trapBubbledEvent('topFocus', 'focusin', mountAt);
                ReactBrowserEventEmitter$2.ReactEventListener.trapBubbledEvent('topBlur', 'focusout', mountAt);
              }

              // to make sure blur and focus event listeners are only attached once
              isListening.topBlur = true;
              isListening.topFocus = true;
            } else if (topEventMapping.hasOwnProperty(dependency)) {
              ReactBrowserEventEmitter$2.ReactEventListener.trapBubbledEvent(dependency, topEventMapping[dependency], mountAt);
            }

            isListening[dependency] = true;
          }
        }
      },

      trapBubbledEvent: function trapBubbledEvent(topLevelType, handlerBaseName, handle) {
        return ReactBrowserEventEmitter$2.ReactEventListener.trapBubbledEvent(topLevelType, handlerBaseName, handle);
      },

      trapCapturedEvent: function trapCapturedEvent(topLevelType, handlerBaseName, handle) {
        return ReactBrowserEventEmitter$2.ReactEventListener.trapCapturedEvent(topLevelType, handlerBaseName, handle);
      },

      /**
       * Protect against document.createEvent() returning null
       * Some popup blocker extensions appear to do this:
       * https://github.com/facebook/react/issues/6887
       */
      supportsEventPageXY: function supportsEventPageXY() {
        if (!document.createEvent) {
          return false;
        }
        var ev = document.createEvent('MouseEvent');
        return ev != null && 'pageX' in ev;
      },

      /**
       * Listens to window scroll and resize events. We cache scroll values so that
       * application code can access them without triggering reflows.
       *
       * ViewportMetrics is only used by SyntheticMouse/TouchEvent and only when
       * pageX/pageY isn't supported (legacy browsers).
       *
       * NOTE: Scroll events do not bubble.
       *
       * @see http://www.quirksmode.org/dom/events/scroll.html
       */
      ensureScrollValueMonitoring: function ensureScrollValueMonitoring() {
        if (hasEventPageXY === undefined) {
          hasEventPageXY = ReactBrowserEventEmitter$2.supportsEventPageXY();
        }
        if (!hasEventPageXY && !isMonitoringScrollValue) {
          var refresh = ViewportMetrics$2.refreshScrollValues;
          ReactBrowserEventEmitter$2.ReactEventListener.monitorScrollValue(refresh);
          isMonitoringScrollValue = true;
        }
      }

    });

    var ReactBrowserEventEmitter_1 = ReactBrowserEventEmitter$2;

    var _prodInvariant$20 = reactProdInvariant_1$2;

    var invariant$24 = invariant_1;

    var genericComponentClass = null;
    var textComponentClass = null;

    var ReactHostComponentInjection = {
      // This accepts a class that receives the tag string. This is a catch all
      // that can render any kind of tag.
      injectGenericComponentClass: function injectGenericComponentClass(componentClass) {
        genericComponentClass = componentClass;
      },
      // This accepts a text component class that takes the text string to be
      // rendered as props.
      injectTextComponentClass: function injectTextComponentClass(componentClass) {
        textComponentClass = componentClass;
      }
    };

    /**
     * Get a host internal component class for a specific tag.
     *
     * @param {ReactElement} element The element to create.
     * @return {function} The internal class constructor function.
     */
    function createInternalComponent(element) {
      !genericComponentClass ? process.env.NODE_ENV !== 'production' ? invariant$24(false, 'There is no registered component for the tag %s', element.type) : _prodInvariant$20('111', element.type) : void 0;
      return new genericComponentClass(element);
    }

    /**
     * @param {ReactText} text
     * @return {ReactComponent}
     */
    function createInstanceForText(text) {
      return new textComponentClass(text);
    }

    /**
     * @param {ReactComponent} component
     * @return {boolean}
     */
    function isTextComponent(component) {
      return component instanceof textComponentClass;
    }

    var ReactHostComponent$1 = {
      createInternalComponent: createInternalComponent,
      createInstanceForText: createInstanceForText,
      isTextComponent: isTextComponent,
      injection: ReactHostComponentInjection
    };

    var ReactHostComponent_1 = ReactHostComponent$1;

    var DOMProperty$4 = DOMProperty_1;
    var EventPluginHub$5 = require$$0$5;
    var EventPluginUtils$3 = EventPluginUtils_1;
    var ReactComponentEnvironment = ReactComponentEnvironment_1;
    var ReactEmptyComponent = ReactEmptyComponent_1;
    var ReactBrowserEventEmitter$1 = ReactBrowserEventEmitter_1;
    var ReactHostComponent = ReactHostComponent_1;
    var ReactUpdates$5 = ReactUpdates_1;

    var ReactInjection$1 = {
      Component: ReactComponentEnvironment.injection,
      DOMProperty: DOMProperty$4.injection,
      EmptyComponent: ReactEmptyComponent.injection,
      EventPluginHub: EventPluginHub$5.injection,
      EventPluginUtils: EventPluginUtils$3.injection,
      EventEmitter: ReactBrowserEventEmitter$1.injection,
      HostComponent: ReactHostComponent.injection,
      Updates: ReactUpdates$5.injection
    };

    var ReactInjection_1 = ReactInjection$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /**
     * Given any node return the first leaf node without children.
     *
     * @param {DOMElement|DOMTextNode} node
     * @return {DOMElement|DOMTextNode}
     */

    function getLeafNode(node) {
      while (node && node.firstChild) {
        node = node.firstChild;
      }
      return node;
    }

    /**
     * Get the next sibling within a container. This will walk up the
     * DOM if a node's siblings have been exhausted.
     *
     * @param {DOMElement|DOMTextNode} node
     * @return {?DOMElement|DOMTextNode}
     */
    function getSiblingNode(node) {
      while (node) {
        if (node.nextSibling) {
          return node.nextSibling;
        }
        node = node.parentNode;
      }
    }

    /**
     * Get object describing the nodes which contain characters at offset.
     *
     * @param {DOMElement|DOMTextNode} root
     * @param {number} offset
     * @return {?object}
     */
    function getNodeForCharacterOffset$1(root, offset) {
      var node = getLeafNode(root);
      var nodeStart = 0;
      var nodeEnd = 0;

      while (node) {
        if (node.nodeType === 3) {
          nodeEnd = nodeStart + node.textContent.length;

          if (nodeStart <= offset && nodeEnd >= offset) {
            return {
              node: node,
              offset: offset - nodeStart
            };
          }

          nodeStart = nodeEnd;
        }

        node = getLeafNode(getSiblingNode(node));
      }
    }

    var getNodeForCharacterOffset_1 = getNodeForCharacterOffset$1;

    var ExecutionEnvironment$14 = ExecutionEnvironment_1;

    var contentKey = null;

    /**
     * Gets the key used to access text content on a DOM node.
     *
     * @return {?string} Key used to access text content.
     * @internal
     */
    function getTextContentAccessor$1() {
      if (!contentKey && ExecutionEnvironment$14.canUseDOM) {
        // Prefer textContent to innerText because many browsers support both but
        // SVG <text> elements don't support innerText even when <div> does.
        contentKey = 'textContent' in document.documentElement ? 'textContent' : 'innerText';
      }
      return contentKey;
    }

    var getTextContentAccessor_1 = getTextContentAccessor$1;

    var ExecutionEnvironment$13 = ExecutionEnvironment_1;

    var getNodeForCharacterOffset = getNodeForCharacterOffset_1;
    var getTextContentAccessor = getTextContentAccessor_1;

    /**
     * While `isCollapsed` is available on the Selection object and `collapsed`
     * is available on the Range object, IE11 sometimes gets them wrong.
     * If the anchor/focus nodes and offsets are the same, the range is collapsed.
     */
    function isCollapsed(anchorNode, anchorOffset, focusNode, focusOffset) {
      return anchorNode === focusNode && anchorOffset === focusOffset;
    }

    /**
     * Get the appropriate anchor and focus node/offset pairs for IE.
     *
     * The catch here is that IE's selection API doesn't provide information
     * about whether the selection is forward or backward, so we have to
     * behave as though it's always forward.
     *
     * IE text differs from modern selection in that it behaves as though
     * block elements end with a new line. This means character offsets will
     * differ between the two APIs.
     *
     * @param {DOMElement} node
     * @return {object}
     */
    function getIEOffsets(node) {
      var selection = document.selection;
      var selectedRange = selection.createRange();
      var selectedLength = selectedRange.text.length;

      // Duplicate selection so we can move range without breaking user selection.
      var fromStart = selectedRange.duplicate();
      fromStart.moveToElementText(node);
      fromStart.setEndPoint('EndToStart', selectedRange);

      var startOffset = fromStart.text.length;
      var endOffset = startOffset + selectedLength;

      return {
        start: startOffset,
        end: endOffset
      };
    }

    /**
     * @param {DOMElement} node
     * @return {?object}
     */
    function getModernOffsets(node) {
      var selection = window.getSelection && window.getSelection();

      if (!selection || selection.rangeCount === 0) {
        return null;
      }

      var anchorNode = selection.anchorNode;
      var anchorOffset = selection.anchorOffset;
      var focusNode = selection.focusNode;
      var focusOffset = selection.focusOffset;

      var currentRange = selection.getRangeAt(0);

      // In Firefox, range.startContainer and range.endContainer can be "anonymous
      // divs", e.g. the up/down buttons on an <input type="number">. Anonymous
      // divs do not seem to expose properties, triggering a "Permission denied
      // error" if any of its properties are accessed. The only seemingly possible
      // way to avoid erroring is to access a property that typically works for
      // non-anonymous divs and catch any error that may otherwise arise. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=208427
      try {
        /* eslint-disable no-unused-expressions */
        currentRange.startContainer.nodeType;
        currentRange.endContainer.nodeType;
        /* eslint-enable no-unused-expressions */
      } catch (e) {
        return null;
      }

      // If the node and offset values are the same, the selection is collapsed.
      // `Selection.isCollapsed` is available natively, but IE sometimes gets
      // this value wrong.
      var isSelectionCollapsed = isCollapsed(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);

      var rangeLength = isSelectionCollapsed ? 0 : currentRange.toString().length;

      var tempRange = currentRange.cloneRange();
      tempRange.selectNodeContents(node);
      tempRange.setEnd(currentRange.startContainer, currentRange.startOffset);

      var isTempRangeCollapsed = isCollapsed(tempRange.startContainer, tempRange.startOffset, tempRange.endContainer, tempRange.endOffset);

      var start = isTempRangeCollapsed ? 0 : tempRange.toString().length;
      var end = start + rangeLength;

      // Detect whether the selection is backward.
      var detectionRange = document.createRange();
      detectionRange.setStart(anchorNode, anchorOffset);
      detectionRange.setEnd(focusNode, focusOffset);
      var isBackward = detectionRange.collapsed;

      return {
        start: isBackward ? end : start,
        end: isBackward ? start : end
      };
    }

    /**
     * @param {DOMElement|DOMTextNode} node
     * @param {object} offsets
     */
    function setIEOffsets(node, offsets) {
      var range = document.selection.createRange().duplicate();
      var start, end;

      if (offsets.end === undefined) {
        start = offsets.start;
        end = start;
      } else if (offsets.start > offsets.end) {
        start = offsets.end;
        end = offsets.start;
      } else {
        start = offsets.start;
        end = offsets.end;
      }

      range.moveToElementText(node);
      range.moveStart('character', start);
      range.setEndPoint('EndToStart', range);
      range.moveEnd('character', end - start);
      range.select();
    }

    /**
     * In modern non-IE browsers, we can support both forward and backward
     * selections.
     *
     * Note: IE10+ supports the Selection object, but it does not support
     * the `extend` method, which means that even in modern IE, it's not possible
     * to programmatically create a backward selection. Thus, for all IE
     * versions, we use the old IE API to create our selections.
     *
     * @param {DOMElement|DOMTextNode} node
     * @param {object} offsets
     */
    function setModernOffsets(node, offsets) {
      if (!window.getSelection) {
        return;
      }

      var selection = window.getSelection();
      var length = node[getTextContentAccessor()].length;
      var start = Math.min(offsets.start, length);
      var end = offsets.end === undefined ? start : Math.min(offsets.end, length);

      // IE 11 uses modern selection, but doesn't support the extend method.
      // Flip backward selections, so we can set with a single range.
      if (!selection.extend && start > end) {
        var temp = end;
        end = start;
        start = temp;
      }

      var startMarker = getNodeForCharacterOffset(node, start);
      var endMarker = getNodeForCharacterOffset(node, end);

      if (startMarker && endMarker) {
        var range = document.createRange();
        range.setStart(startMarker.node, startMarker.offset);
        selection.removeAllRanges();

        if (start > end) {
          selection.addRange(range);
          selection.extend(endMarker.node, endMarker.offset);
        } else {
          range.setEnd(endMarker.node, endMarker.offset);
          selection.addRange(range);
        }
      }
    }

    var useIEOffsets = ExecutionEnvironment$13.canUseDOM && 'selection' in document && !('getSelection' in window);

    var ReactDOMSelection$1 = {
      /**
       * @param {DOMElement} node
       */
      getOffsets: useIEOffsets ? getIEOffsets : getModernOffsets,

      /**
       * @param {DOMElement|DOMTextNode} node
       * @param {object} offsets
       */
      setOffsets: useIEOffsets ? setIEOffsets : setModernOffsets
    };

    var ReactDOMSelection_1 = ReactDOMSelection$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    /**
     * @param {*} object The object to check.
     * @return {boolean} Whether or not the object is a DOM node.
     */

    function isNode$2(object) {
      return !!(object && (typeof Node === 'function' ? object instanceof Node : (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string'));
    }

    module.exports = isNode$2;



    var isNode$3 = Object.freeze({

    });

    var require$$0$17 = ( isNode$3 && isNode$3['default'] ) || isNode$3;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    var isNode$1 = require$$0$17;

    /**
     * @param {*} object The object to check.
     * @return {boolean} Whether or not the object is a DOM text node.
     */
    function isTextNode$1(object) {
      return isNode$1(object) && object.nodeType == 3;
    }

    var isTextNode_1 = isTextNode$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    var isTextNode = isTextNode_1;

    /*eslint-disable no-bitwise */

    /**
     * Checks if a given DOM node contains or is another DOM node.
     */
    function containsNode$1(outerNode, innerNode) {
      if (!outerNode || !innerNode) {
        return false;
      } else if (outerNode === innerNode) {
        return true;
      } else if (isTextNode(outerNode)) {
        return false;
      } else if (isTextNode(innerNode)) {
        return containsNode$1(outerNode, innerNode.parentNode);
      } else if ('contains' in outerNode) {
        return outerNode.contains(innerNode);
      } else if (outerNode.compareDocumentPosition) {
        return !!(outerNode.compareDocumentPosition(innerNode) & 16);
      } else {
        return false;
      }
    }

    var containsNode_1 = containsNode$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /**
     * @param {DOMElement} node input/textarea to focus
     */

    function focusNode$1(node) {
      // IE8 can throw "Can't move focus to the control because it is invisible,
      // not enabled, or of a type that does not accept the focus." for all kinds of
      // reasons that are too expensive and fragile to test.
      try {
        node.focus();
      } catch (e) {}
    }

    var focusNode_1 = focusNode$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    /* eslint-disable fb-www/typeof-undefined */

    /**
     * Same as document.activeElement but wraps in a try-catch block. In IE it is
     * not safe to call document.activeElement if there is nothing focused.
     *
     * The activeElement will be null only if the document or document body is not
     * yet defined.
     */

    function getActiveElement$1() /*?DOMElement*/{
      if (typeof document === 'undefined') {
        return null;
      }
      try {
        return document.activeElement || document.body;
      } catch (e) {
        return document.body;
      }
    }

    var getActiveElement_1 = getActiveElement$1;

    var ReactDOMSelection = ReactDOMSelection_1;

    var containsNode = containsNode_1;
    var focusNode = focusNode_1;
    var getActiveElement = getActiveElement_1;

    function isInDocument(node) {
      return containsNode(document.documentElement, node);
    }

    /**
     * @ReactInputSelection: React input selection module. Based on Selection.js,
     * but modified to be suitable for react and has a couple of bug fixes (doesn't
     * assume buttons have range selections allowed).
     * Input selection module for React.
     */
    var ReactInputSelection$1 = {

      hasSelectionCapabilities: function hasSelectionCapabilities(elem) {
        var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
        return nodeName && (nodeName === 'input' && elem.type === 'text' || nodeName === 'textarea' || elem.contentEditable === 'true');
      },

      getSelectionInformation: function getSelectionInformation() {
        var focusedElem = getActiveElement();
        return {
          focusedElem: focusedElem,
          selectionRange: ReactInputSelection$1.hasSelectionCapabilities(focusedElem) ? ReactInputSelection$1.getSelection(focusedElem) : null
        };
      },

      /**
       * @restoreSelection: If any selection information was potentially lost,
       * restore it. This is useful when performing operations that could remove dom
       * nodes and place them back in, resulting in focus being lost.
       */
      restoreSelection: function restoreSelection(priorSelectionInformation) {
        var curFocusedElem = getActiveElement();
        var priorFocusedElem = priorSelectionInformation.focusedElem;
        var priorSelectionRange = priorSelectionInformation.selectionRange;
        if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
          if (ReactInputSelection$1.hasSelectionCapabilities(priorFocusedElem)) {
            ReactInputSelection$1.setSelection(priorFocusedElem, priorSelectionRange);
          }
          focusNode(priorFocusedElem);
        }
      },

      /**
       * @getSelection: Gets the selection bounds of a focused textarea, input or
       * contentEditable node.
       * -@input: Look up selection bounds of this input
       * -@return {start: selectionStart, end: selectionEnd}
       */
      getSelection: function getSelection(input) {
        var selection;

        if ('selectionStart' in input) {
          // Modern browser with input or textarea.
          selection = {
            start: input.selectionStart,
            end: input.selectionEnd
          };
        } else if (document.selection && input.nodeName && input.nodeName.toLowerCase() === 'input') {
          // IE8 input.
          var range = document.selection.createRange();
          // There can only be one selection per document in IE, so it must
          // be in our element.
          if (range.parentElement() === input) {
            selection = {
              start: -range.moveStart('character', -input.value.length),
              end: -range.moveEnd('character', -input.value.length)
            };
          }
        } else {
          // Content editable or old IE textarea.
          selection = ReactDOMSelection.getOffsets(input);
        }

        return selection || { start: 0, end: 0 };
      },

      /**
       * @setSelection: Sets the selection bounds of a textarea or input and focuses
       * the input.
       * -@input     Set selection bounds of this input or textarea
       * -@offsets   Object of same form that is returned from get*
       */
      setSelection: function setSelection(input, offsets) {
        var start = offsets.start;
        var end = offsets.end;
        if (end === undefined) {
          end = start;
        }

        if ('selectionStart' in input) {
          input.selectionStart = start;
          input.selectionEnd = Math.min(end, input.value.length);
        } else if (document.selection && input.nodeName && input.nodeName.toLowerCase() === 'input') {
          var range = input.createTextRange();
          range.collapse(true);
          range.moveStart('character', start);
          range.moveEnd('character', end - start);
          range.select();
        } else {
          ReactDOMSelection.setOffsets(input, offsets);
        }
      }
    };

    var ReactInputSelection_1 = ReactInputSelection$1;

    /**
     * Copyright 2015-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var _prodInvariant$21 = require('./reactProdInvariant');

    var ReactCurrentOwner$3 = require('react/lib/ReactCurrentOwner');
    var ReactInstanceMap = require('./ReactInstanceMap');
    var ReactInstrumentation$7 = require('./ReactInstrumentation');
    var ReactUpdates$6 = require('./ReactUpdates');

    var invariant$25 = require('fbjs/lib/invariant');
    var warning$17 = require('fbjs/lib/warning');

    function enqueueUpdate$1(internalInstance) {
      ReactUpdates$6.enqueueUpdate(internalInstance);
    }

    function formatUnexpectedArgument(arg) {
      var type = typeof arg === 'undefined' ? 'undefined' : _typeof(arg);
      if (type !== 'object') {
        return type;
      }
      var displayName = arg.constructor && arg.constructor.name || type;
      var keys = Object.keys(arg);
      if (keys.length > 0 && keys.length < 20) {
        return displayName + ' (keys: ' + keys.join(', ') + ')';
      }
      return displayName;
    }

    function getInternalInstanceReadyForUpdate(publicInstance, callerName) {
      var internalInstance = ReactInstanceMap.get(publicInstance);
      if (!internalInstance) {
        if (process.env.NODE_ENV !== 'production') {
          var ctor = publicInstance.constructor;
          // Only warn when we have a callerName. Otherwise we should be silent.
          // We're probably calling from enqueueCallback. We don't want to warn
          // there because we already warned for the corresponding lifecycle method.
          process.env.NODE_ENV !== 'production' ? warning$17(!callerName, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, ctor && (ctor.displayName || ctor.name) || 'ReactClass') : void 0;
        }
        return null;
      }

      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning$17(ReactCurrentOwner$3.current == null, '%s(...): Cannot update during an existing state transition (such as ' + 'within `render` or another component\'s constructor). Render methods ' + 'should be a pure function of props and state; constructor ' + 'side-effects are an anti-pattern, but can be moved to ' + '`componentWillMount`.', callerName) : void 0;
      }

      return internalInstance;
    }

    /**
     * ReactUpdateQueue allows for state updates to be scheduled into a later
     * reconciliation step.
     */
    var ReactUpdateQueue$1 = {

      /**
       * Checks whether or not this composite component is mounted.
       * @param {ReactClass} publicInstance The instance we want to test.
       * @return {boolean} True if mounted, false otherwise.
       * @protected
       * @final
       */
      isMounted: function isMounted(publicInstance) {
        if (process.env.NODE_ENV !== 'production') {
          var owner = ReactCurrentOwner$3.current;
          if (owner !== null) {
            process.env.NODE_ENV !== 'production' ? warning$17(owner._warnedAboutRefsInRender, '%s is accessing isMounted inside its render() function. ' + 'render() should be a pure function of props and state. It should ' + 'never access something that requires stale data from the previous ' + 'render, such as refs. Move this logic to componentDidMount and ' + 'componentDidUpdate instead.', owner.getName() || 'A component') : void 0;
            owner._warnedAboutRefsInRender = true;
          }
        }
        var internalInstance = ReactInstanceMap.get(publicInstance);
        if (internalInstance) {
          // During componentWillMount and render this will still be null but after
          // that will always render to something. At least for now. So we can use
          // this hack.
          return !!internalInstance._renderedComponent;
        } else {
          return false;
        }
      },

      /**
       * Enqueue a callback that will be executed after all the pending updates
       * have processed.
       *
       * @param {ReactClass} publicInstance The instance to use as `this` context.
       * @param {?function} callback Called after state is updated.
       * @param {string} callerName Name of the calling function in the public API.
       * @internal
       */
      enqueueCallback: function enqueueCallback(publicInstance, callback, callerName) {
        ReactUpdateQueue$1.validateCallback(callback, callerName);
        var internalInstance = getInternalInstanceReadyForUpdate(publicInstance);

        // Previously we would throw an error if we didn't have an internal
        // instance. Since we want to make it a no-op instead, we mirror the same
        // behavior we have in other enqueue* methods.
        // We also need to ignore callbacks in componentWillMount. See
        // enqueueUpdates.
        if (!internalInstance) {
          return null;
        }

        if (internalInstance._pendingCallbacks) {
          internalInstance._pendingCallbacks.push(callback);
        } else {
          internalInstance._pendingCallbacks = [callback];
        }
        // TODO: The callback here is ignored when setState is called from
        // componentWillMount. Either fix it or disallow doing so completely in
        // favor of getInitialState. Alternatively, we can disallow
        // componentWillMount during server-side rendering.
        enqueueUpdate$1(internalInstance);
      },

      enqueueCallbackInternal: function enqueueCallbackInternal(internalInstance, callback) {
        if (internalInstance._pendingCallbacks) {
          internalInstance._pendingCallbacks.push(callback);
        } else {
          internalInstance._pendingCallbacks = [callback];
        }
        enqueueUpdate$1(internalInstance);
      },

      /**
       * Forces an update. This should only be invoked when it is known with
       * certainty that we are **not** in a DOM transaction.
       *
       * You may want to call this when you know that some deeper aspect of the
       * component's state has changed but `setState` was not called.
       *
       * This will not invoke `shouldComponentUpdate`, but it will invoke
       * `componentWillUpdate` and `componentDidUpdate`.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @internal
       */
      enqueueForceUpdate: function enqueueForceUpdate(publicInstance) {
        var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'forceUpdate');

        if (!internalInstance) {
          return;
        }

        internalInstance._pendingForceUpdate = true;

        enqueueUpdate$1(internalInstance);
      },

      /**
       * Replaces all of the state. Always use this or `setState` to mutate state.
       * You should treat `this.state` as immutable.
       *
       * There is no guarantee that `this.state` will be immediately updated, so
       * accessing `this.state` after calling this method may return the old value.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} completeState Next state.
       * @internal
       */
      enqueueReplaceState: function enqueueReplaceState(publicInstance, completeState) {
        var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'replaceState');

        if (!internalInstance) {
          return;
        }

        internalInstance._pendingStateQueue = [completeState];
        internalInstance._pendingReplaceState = true;

        enqueueUpdate$1(internalInstance);
      },

      /**
       * Sets a subset of the state. This only exists because _pendingState is
       * internal. This provides a merging strategy that is not available to deep
       * properties which is confusing. TODO: Expose pendingState or don't use it
       * during the merge.
       *
       * @param {ReactClass} publicInstance The instance that should rerender.
       * @param {object} partialState Next partial state to be merged with state.
       * @internal
       */
      enqueueSetState: function enqueueSetState(publicInstance, partialState) {
        if (process.env.NODE_ENV !== 'production') {
          ReactInstrumentation$7.debugTool.onSetState();
          process.env.NODE_ENV !== 'production' ? warning$17(partialState != null, 'setState(...): You passed an undefined or null state object; ' + 'instead, use forceUpdate().') : void 0;
        }

        var internalInstance = getInternalInstanceReadyForUpdate(publicInstance, 'setState');

        if (!internalInstance) {
          return;
        }

        var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
        queue.push(partialState);

        enqueueUpdate$1(internalInstance);
      },

      enqueueElementInternal: function enqueueElementInternal(internalInstance, nextElement, nextContext) {
        internalInstance._pendingElement = nextElement;
        // TODO: introduce _pendingContext instead of setting it directly.
        internalInstance._context = nextContext;
        enqueueUpdate$1(internalInstance);
      },

      validateCallback: function validateCallback(callback, callerName) {
        !(!callback || typeof callback === 'function') ? process.env.NODE_ENV !== 'production' ? invariant$25(false, '%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.', callerName, formatUnexpectedArgument(callback)) : _prodInvariant$21('122', callerName, formatUnexpectedArgument(callback)) : void 0;
      }

    };

    module.exports = ReactUpdateQueue$1;



    var ReactUpdateQueue$2 = Object.freeze({

    });

    var require$$7$1 = ( ReactUpdateQueue$2 && ReactUpdateQueue$2['default'] ) || ReactUpdateQueue$2;

    var _assign$13 = index;

    var CallbackQueue$2 = CallbackQueue_1;
    var PooledClass$7 = PooledClass_1$2;
    var ReactBrowserEventEmitter$3 = ReactBrowserEventEmitter_1;
    var ReactInputSelection = ReactInputSelection_1;
    var ReactInstrumentation$6 = ReactInstrumentation$2;
    var Transaction$4 = Transaction$1;
    var ReactUpdateQueue = require$$7$1;

    /**
     * Ensures that, when possible, the selection range (currently selected text
     * input) is not disturbed by performing the transaction.
     */
    var SELECTION_RESTORATION = {
      /**
       * @return {Selection} Selection information.
       */
      initialize: ReactInputSelection.getSelectionInformation,
      /**
       * @param {Selection} sel Selection information returned from `initialize`.
       */
      close: ReactInputSelection.restoreSelection
    };

    /**
     * Suppresses events (blur/focus) that could be inadvertently dispatched due to
     * high level DOM manipulations (like temporarily removing a text input from the
     * DOM).
     */
    var EVENT_SUPPRESSION = {
      /**
       * @return {boolean} The enabled status of `ReactBrowserEventEmitter` before
       * the reconciliation.
       */
      initialize: function initialize() {
        var currentlyEnabled = ReactBrowserEventEmitter$3.isEnabled();
        ReactBrowserEventEmitter$3.setEnabled(false);
        return currentlyEnabled;
      },

      /**
       * @param {boolean} previouslyEnabled Enabled status of
       *   `ReactBrowserEventEmitter` before the reconciliation occurred. `close`
       *   restores the previous value.
       */
      close: function close(previouslyEnabled) {
        ReactBrowserEventEmitter$3.setEnabled(previouslyEnabled);
      }
    };

    /**
     * Provides a queue for collecting `componentDidMount` and
     * `componentDidUpdate` callbacks during the transaction.
     */
    var ON_DOM_READY_QUEUEING = {
      /**
       * Initializes the internal `onDOMReady` queue.
       */
      initialize: function initialize() {
        this.reactMountReady.reset();
      },

      /**
       * After DOM is flushed, invoke all registered `onDOMReady` callbacks.
       */
      close: function close() {
        this.reactMountReady.notifyAll();
      }
    };

    /**
     * Executed within the scope of the `Transaction` instance. Consider these as
     * being member methods, but with an implied ordering while being isolated from
     * each other.
     */
    var TRANSACTION_WRAPPERS$2 = [SELECTION_RESTORATION, EVENT_SUPPRESSION, ON_DOM_READY_QUEUEING];

    if (process.env.NODE_ENV !== 'production') {
      TRANSACTION_WRAPPERS$2.push({
        initialize: ReactInstrumentation$6.debugTool.onBeginFlush,
        close: ReactInstrumentation$6.debugTool.onEndFlush
      });
    }

    /**
     * Currently:
     * - The order that these are listed in the transaction is critical:
     * - Suppresses events.
     * - Restores selection range.
     *
     * Future:
     * - Restore document/overflow scroll positions that were unintentionally
     *   modified via DOM insertions above the top viewport boundary.
     * - Implement/integrate with customized constraint based layout system and keep
     *   track of which dimensions must be remeasured.
     *
     * @class ReactReconcileTransaction
     */
    function ReactReconcileTransaction$1(useCreateElement) {
      this.reinitializeTransaction();
      // Only server-side rendering really needs this option (see
      // `ReactServerRendering`), but server-side uses
      // `ReactServerRenderingTransaction` instead. This option is here so that it's
      // accessible and defaults to false when `ReactDOMComponent` and
      // `ReactDOMTextComponent` checks it in `mountComponent`.`
      this.renderToStaticMarkup = false;
      this.reactMountReady = CallbackQueue$2.getPooled(null);
      this.useCreateElement = useCreateElement;
    }

    var Mixin = {
      /**
       * @see Transaction
       * @abstract
       * @final
       * @return {array<object>} List of operation wrap procedures.
       *   TODO: convert to array<TransactionWrapper>
       */
      getTransactionWrappers: function getTransactionWrappers() {
        return TRANSACTION_WRAPPERS$2;
      },

      /**
       * @return {object} The queue to collect `onDOMReady` callbacks with.
       */
      getReactMountReady: function getReactMountReady() {
        return this.reactMountReady;
      },

      /**
       * @return {object} The queue to collect React async events.
       */
      getUpdateQueue: function getUpdateQueue() {
        return ReactUpdateQueue;
      },

      /**
       * Save current transaction state -- if the return value from this method is
       * passed to `rollback`, the transaction will be reset to that state.
       */
      checkpoint: function checkpoint() {
        // reactMountReady is the our only stateful wrapper
        return this.reactMountReady.checkpoint();
      },

      rollback: function rollback(checkpoint) {
        this.reactMountReady.rollback(checkpoint);
      },

      /**
       * `PooledClass` looks for this, and will invoke this before allowing this
       * instance to be reused.
       */
      destructor: function destructor() {
        CallbackQueue$2.release(this.reactMountReady);
        this.reactMountReady = null;
      }
    };

    _assign$13(ReactReconcileTransaction$1.prototype, Transaction$4, Mixin);

    PooledClass$7.addPoolingTo(ReactReconcileTransaction$1);

    var ReactReconcileTransaction_1 = ReactReconcileTransaction$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var NS = {
      xlink: 'http://www.w3.org/1999/xlink',
      xml: 'http://www.w3.org/XML/1998/namespace'
    };

    // We use attributes for everything SVG so let's avoid some duplication and run
    // code instead.
    // The following are all specified in the HTML config already so we exclude here.
    // - class (as className)
    // - color
    // - height
    // - id
    // - lang
    // - max
    // - media
    // - method
    // - min
    // - name
    // - style
    // - target
    // - type
    // - width
    var ATTRS = {
      accentHeight: 'accent-height',
      accumulate: 0,
      additive: 0,
      alignmentBaseline: 'alignment-baseline',
      allowReorder: 'allowReorder',
      alphabetic: 0,
      amplitude: 0,
      arabicForm: 'arabic-form',
      ascent: 0,
      attributeName: 'attributeName',
      attributeType: 'attributeType',
      autoReverse: 'autoReverse',
      azimuth: 0,
      baseFrequency: 'baseFrequency',
      baseProfile: 'baseProfile',
      baselineShift: 'baseline-shift',
      bbox: 0,
      begin: 0,
      bias: 0,
      by: 0,
      calcMode: 'calcMode',
      capHeight: 'cap-height',
      clip: 0,
      clipPath: 'clip-path',
      clipRule: 'clip-rule',
      clipPathUnits: 'clipPathUnits',
      colorInterpolation: 'color-interpolation',
      colorInterpolationFilters: 'color-interpolation-filters',
      colorProfile: 'color-profile',
      colorRendering: 'color-rendering',
      contentScriptType: 'contentScriptType',
      contentStyleType: 'contentStyleType',
      cursor: 0,
      cx: 0,
      cy: 0,
      d: 0,
      decelerate: 0,
      descent: 0,
      diffuseConstant: 'diffuseConstant',
      direction: 0,
      display: 0,
      divisor: 0,
      dominantBaseline: 'dominant-baseline',
      dur: 0,
      dx: 0,
      dy: 0,
      edgeMode: 'edgeMode',
      elevation: 0,
      enableBackground: 'enable-background',
      end: 0,
      exponent: 0,
      externalResourcesRequired: 'externalResourcesRequired',
      fill: 0,
      fillOpacity: 'fill-opacity',
      fillRule: 'fill-rule',
      filter: 0,
      filterRes: 'filterRes',
      filterUnits: 'filterUnits',
      floodColor: 'flood-color',
      floodOpacity: 'flood-opacity',
      focusable: 0,
      fontFamily: 'font-family',
      fontSize: 'font-size',
      fontSizeAdjust: 'font-size-adjust',
      fontStretch: 'font-stretch',
      fontStyle: 'font-style',
      fontVariant: 'font-variant',
      fontWeight: 'font-weight',
      format: 0,
      from: 0,
      fx: 0,
      fy: 0,
      g1: 0,
      g2: 0,
      glyphName: 'glyph-name',
      glyphOrientationHorizontal: 'glyph-orientation-horizontal',
      glyphOrientationVertical: 'glyph-orientation-vertical',
      glyphRef: 'glyphRef',
      gradientTransform: 'gradientTransform',
      gradientUnits: 'gradientUnits',
      hanging: 0,
      horizAdvX: 'horiz-adv-x',
      horizOriginX: 'horiz-origin-x',
      ideographic: 0,
      imageRendering: 'image-rendering',
      'in': 0,
      in2: 0,
      intercept: 0,
      k: 0,
      k1: 0,
      k2: 0,
      k3: 0,
      k4: 0,
      kernelMatrix: 'kernelMatrix',
      kernelUnitLength: 'kernelUnitLength',
      kerning: 0,
      keyPoints: 'keyPoints',
      keySplines: 'keySplines',
      keyTimes: 'keyTimes',
      lengthAdjust: 'lengthAdjust',
      letterSpacing: 'letter-spacing',
      lightingColor: 'lighting-color',
      limitingConeAngle: 'limitingConeAngle',
      local: 0,
      markerEnd: 'marker-end',
      markerMid: 'marker-mid',
      markerStart: 'marker-start',
      markerHeight: 'markerHeight',
      markerUnits: 'markerUnits',
      markerWidth: 'markerWidth',
      mask: 0,
      maskContentUnits: 'maskContentUnits',
      maskUnits: 'maskUnits',
      mathematical: 0,
      mode: 0,
      numOctaves: 'numOctaves',
      offset: 0,
      opacity: 0,
      operator: 0,
      order: 0,
      orient: 0,
      orientation: 0,
      origin: 0,
      overflow: 0,
      overlinePosition: 'overline-position',
      overlineThickness: 'overline-thickness',
      paintOrder: 'paint-order',
      panose1: 'panose-1',
      pathLength: 'pathLength',
      patternContentUnits: 'patternContentUnits',
      patternTransform: 'patternTransform',
      patternUnits: 'patternUnits',
      pointerEvents: 'pointer-events',
      points: 0,
      pointsAtX: 'pointsAtX',
      pointsAtY: 'pointsAtY',
      pointsAtZ: 'pointsAtZ',
      preserveAlpha: 'preserveAlpha',
      preserveAspectRatio: 'preserveAspectRatio',
      primitiveUnits: 'primitiveUnits',
      r: 0,
      radius: 0,
      refX: 'refX',
      refY: 'refY',
      renderingIntent: 'rendering-intent',
      repeatCount: 'repeatCount',
      repeatDur: 'repeatDur',
      requiredExtensions: 'requiredExtensions',
      requiredFeatures: 'requiredFeatures',
      restart: 0,
      result: 0,
      rotate: 0,
      rx: 0,
      ry: 0,
      scale: 0,
      seed: 0,
      shapeRendering: 'shape-rendering',
      slope: 0,
      spacing: 0,
      specularConstant: 'specularConstant',
      specularExponent: 'specularExponent',
      speed: 0,
      spreadMethod: 'spreadMethod',
      startOffset: 'startOffset',
      stdDeviation: 'stdDeviation',
      stemh: 0,
      stemv: 0,
      stitchTiles: 'stitchTiles',
      stopColor: 'stop-color',
      stopOpacity: 'stop-opacity',
      strikethroughPosition: 'strikethrough-position',
      strikethroughThickness: 'strikethrough-thickness',
      string: 0,
      stroke: 0,
      strokeDasharray: 'stroke-dasharray',
      strokeDashoffset: 'stroke-dashoffset',
      strokeLinecap: 'stroke-linecap',
      strokeLinejoin: 'stroke-linejoin',
      strokeMiterlimit: 'stroke-miterlimit',
      strokeOpacity: 'stroke-opacity',
      strokeWidth: 'stroke-width',
      surfaceScale: 'surfaceScale',
      systemLanguage: 'systemLanguage',
      tableValues: 'tableValues',
      targetX: 'targetX',
      targetY: 'targetY',
      textAnchor: 'text-anchor',
      textDecoration: 'text-decoration',
      textRendering: 'text-rendering',
      textLength: 'textLength',
      to: 0,
      transform: 0,
      u1: 0,
      u2: 0,
      underlinePosition: 'underline-position',
      underlineThickness: 'underline-thickness',
      unicode: 0,
      unicodeBidi: 'unicode-bidi',
      unicodeRange: 'unicode-range',
      unitsPerEm: 'units-per-em',
      vAlphabetic: 'v-alphabetic',
      vHanging: 'v-hanging',
      vIdeographic: 'v-ideographic',
      vMathematical: 'v-mathematical',
      values: 0,
      vectorEffect: 'vector-effect',
      version: 0,
      vertAdvY: 'vert-adv-y',
      vertOriginX: 'vert-origin-x',
      vertOriginY: 'vert-origin-y',
      viewBox: 'viewBox',
      viewTarget: 'viewTarget',
      visibility: 0,
      widths: 0,
      wordSpacing: 'word-spacing',
      writingMode: 'writing-mode',
      x: 0,
      xHeight: 'x-height',
      x1: 0,
      x2: 0,
      xChannelSelector: 'xChannelSelector',
      xlinkActuate: 'xlink:actuate',
      xlinkArcrole: 'xlink:arcrole',
      xlinkHref: 'xlink:href',
      xlinkRole: 'xlink:role',
      xlinkShow: 'xlink:show',
      xlinkTitle: 'xlink:title',
      xlinkType: 'xlink:type',
      xmlBase: 'xml:base',
      xmlns: 0,
      xmlnsXlink: 'xmlns:xlink',
      xmlLang: 'xml:lang',
      xmlSpace: 'xml:space',
      y: 0,
      y1: 0,
      y2: 0,
      yChannelSelector: 'yChannelSelector',
      z: 0,
      zoomAndPan: 'zoomAndPan'
    };

    var SVGDOMPropertyConfig$1 = {
      Properties: {},
      DOMAttributeNamespaces: {
        xlinkActuate: NS.xlink,
        xlinkArcrole: NS.xlink,
        xlinkHref: NS.xlink,
        xlinkRole: NS.xlink,
        xlinkShow: NS.xlink,
        xlinkTitle: NS.xlink,
        xlinkType: NS.xlink,
        xmlBase: NS.xml,
        xmlLang: NS.xml,
        xmlSpace: NS.xml
      },
      DOMAttributeNames: {}
    };

    Object.keys(ATTRS).forEach(function (key) {
      SVGDOMPropertyConfig$1.Properties[key] = 0;
      if (ATTRS[key]) {
        SVGDOMPropertyConfig$1.DOMAttributeNames[key] = ATTRS[key];
      }
    });

    var SVGDOMPropertyConfig_1 = SVGDOMPropertyConfig$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     * 
     */

    /*eslint-disable no-self-compare */

    var hasOwnProperty$3 = Object.prototype.hasOwnProperty;

    /**
     * inlined Object.is polyfill to avoid requiring consumers ship their own
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
    function is$1(x, y) {
      // SameValue algorithm
      if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        // Added the nonzero y check to make Flow happy, but it is redundant
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
      } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
      }
    }

    /**
     * Performs equality by iterating through keys on an object and returning false
     * when any key has values which are not strictly equal between the arguments.
     * Returns true when the values of all keys are strictly equal.
     */
    function shallowEqual$2(objA, objB) {
      if (is$1(objA, objB)) {
        return true;
      }

      if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
        return false;
      }

      var keysA = Object.keys(objA);
      var keysB = Object.keys(objB);

      if (keysA.length !== keysB.length) {
        return false;
      }

      // Test for A's keys different from B.
      for (var i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty$3.call(objB, keysA[i]) || !is$1(objA[keysA[i]], objB[keysA[i]])) {
          return false;
        }
      }

      return true;
    }

    module.exports = shallowEqual$2;



    var shallowEqual$3 = Object.freeze({

    });

    var require$$0$19 = ( shallowEqual$3 && shallowEqual$3['default'] ) || shallowEqual$3;

    var EventPropagators$4 = EventPropagators_1;
    var ExecutionEnvironment$15 = ExecutionEnvironment_1;
    var ReactDOMComponentTree$11 = ReactDOMComponentTree_1;
    var ReactInputSelection$2 = ReactInputSelection_1;
    var SyntheticEvent$3 = SyntheticEvent_1;

    var getActiveElement$2 = getActiveElement_1;
    var isTextInputElement$2 = isTextInputElement_1;
    var shallowEqual$1 = require$$0$19;

    var skipSelectionChangeEvent = ExecutionEnvironment$15.canUseDOM && 'documentMode' in document && document.documentMode <= 11;

    var eventTypes$3 = {
      select: {
        phasedRegistrationNames: {
          bubbled: 'onSelect',
          captured: 'onSelectCapture'
        },
        dependencies: ['topBlur', 'topContextMenu', 'topFocus', 'topKeyDown', 'topKeyUp', 'topMouseDown', 'topMouseUp', 'topSelectionChange']
      }
    };

    var activeElement$1 = null;
    var activeElementInst$1 = null;
    var lastSelection = null;
    var mouseDown = false;

    // Track whether a listener exists for this plugin. If none exist, we do
    // not extract events. See #3639.
    var hasListener = false;

    /**
     * Get an object which is a unique representation of the current selection.
     *
     * The return value will not be consistent across nodes or browsers, but
     * two identical selections on the same node will return identical objects.
     *
     * @param {DOMElement} node
     * @return {object}
     */
    function getSelection$1(node) {
      if ('selectionStart' in node && ReactInputSelection$2.hasSelectionCapabilities(node)) {
        return {
          start: node.selectionStart,
          end: node.selectionEnd
        };
      } else if (window.getSelection) {
        var selection = window.getSelection();
        return {
          anchorNode: selection.anchorNode,
          anchorOffset: selection.anchorOffset,
          focusNode: selection.focusNode,
          focusOffset: selection.focusOffset
        };
      } else if (document.selection) {
        var range = document.selection.createRange();
        return {
          parentElement: range.parentElement(),
          text: range.text,
          top: range.boundingTop,
          left: range.boundingLeft
        };
      }
    }

    /**
     * Poll selection to see whether it's changed.
     *
     * @param {object} nativeEvent
     * @return {?SyntheticEvent}
     */
    function constructSelectEvent(nativeEvent, nativeEventTarget) {
      // Ensure we have the right element, and that the user is not dragging a
      // selection (this matches native `select` event behavior). In HTML5, select
      // fires only on input and textarea thus if there's no focused element we
      // won't dispatch.
      if (mouseDown || activeElement$1 == null || activeElement$1 !== getActiveElement$2()) {
        return null;
      }

      // Only fire when selection has actually changed.
      var currentSelection = getSelection$1(activeElement$1);
      if (!lastSelection || !shallowEqual$1(lastSelection, currentSelection)) {
        lastSelection = currentSelection;

        var syntheticEvent = SyntheticEvent$3.getPooled(eventTypes$3.select, activeElementInst$1, nativeEvent, nativeEventTarget);

        syntheticEvent.type = 'select';
        syntheticEvent.target = activeElement$1;

        EventPropagators$4.accumulateTwoPhaseDispatches(syntheticEvent);

        return syntheticEvent;
      }

      return null;
    }

    /**
     * This plugin creates an `onSelect` event that normalizes select events
     * across form elements.
     *
     * Supported elements are:
     * - input (see `isTextInputElement`)
     * - textarea
     * - contentEditable
     *
     * This differs from native browser implementations in the following ways:
     * - Fires on contentEditable fields as well as inputs.
     * - Fires for collapsed selection.
     * - Fires after user input.
     */
    var SelectEventPlugin$1 = {

      eventTypes: eventTypes$3,

      extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        if (!hasListener) {
          return null;
        }

        var targetNode = targetInst ? ReactDOMComponentTree$11.getNodeFromInstance(targetInst) : window;

        switch (topLevelType) {
          // Track the input node that has focus.
          case 'topFocus':
            if (isTextInputElement$2(targetNode) || targetNode.contentEditable === 'true') {
              activeElement$1 = targetNode;
              activeElementInst$1 = targetInst;
              lastSelection = null;
            }
            break;
          case 'topBlur':
            activeElement$1 = null;
            activeElementInst$1 = null;
            lastSelection = null;
            break;

          // Don't fire the event while the user is dragging. This matches the
          // semantics of the native select event.
          case 'topMouseDown':
            mouseDown = true;
            break;
          case 'topContextMenu':
          case 'topMouseUp':
            mouseDown = false;
            return constructSelectEvent(nativeEvent, nativeEventTarget);

          // Chrome and IE fire non-standard event when selection is changed (and
          // sometimes when it hasn't). IE's event fires out of order with respect
          // to key and input events on deletion, so we discard it.
          //
          // Firefox doesn't support selectionchange, so check selection status
          // after each key entry. The selection changes after keydown and before
          // keyup, but we check on keydown as well in the case of holding down a
          // key, when multiple keydown events are fired but only one keyup is.
          // This is also our approach for IE handling, for the reason above.
          case 'topSelectionChange':
            if (skipSelectionChangeEvent) {
              break;
            }
          // falls through
          case 'topKeyDown':
          case 'topKeyUp':
            return constructSelectEvent(nativeEvent, nativeEventTarget);
        }

        return null;
      },

      didPutListener: function didPutListener(inst, registrationName, listener) {
        if (registrationName === 'onSelect') {
          hasListener = true;
        }
      }
    };

    var SelectEventPlugin_1 = SelectEventPlugin$1;

    var SyntheticEvent$5 = SyntheticEvent_1;

    /**
     * @interface Event
     * @see http://www.w3.org/TR/css3-animations/#AnimationEvent-interface
     * @see https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent
     */
    var AnimationEventInterface = {
      animationName: null,
      elapsedTime: null,
      pseudoElement: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticEvent}
     */
    function SyntheticAnimationEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticEvent$5.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$5.augmentClass(SyntheticAnimationEvent$1, AnimationEventInterface);

    var SyntheticAnimationEvent_1 = SyntheticAnimationEvent$1;

    var SyntheticEvent$6 = SyntheticEvent_1;

    /**
     * @interface Event
     * @see http://www.w3.org/TR/clipboard-apis/
     */
    var ClipboardEventInterface = {
      clipboardData: function clipboardData(event) {
        return 'clipboardData' in event ? event.clipboardData : window.clipboardData;
      }
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticClipboardEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticEvent$6.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$6.augmentClass(SyntheticClipboardEvent$1, ClipboardEventInterface);

    var SyntheticClipboardEvent_1 = SyntheticClipboardEvent$1;

    var SyntheticUIEvent$3 = SyntheticUIEvent_1;

    /**
     * @interface FocusEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var FocusEventInterface = {
      relatedTarget: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticFocusEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticUIEvent$3.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticUIEvent$3.augmentClass(SyntheticFocusEvent$1, FocusEventInterface);

    var SyntheticFocusEvent_1 = SyntheticFocusEvent$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /**
     * `charCode` represents the actual "character code" and is safe to use with
     * `String.fromCharCode`. As such, only keys that correspond to printable
     * characters produce a valid `charCode`, the only exception to this is Enter.
     * The Tab-key is considered non-printable and does not have a `charCode`,
     * presumably because it does not produce a tab-character in browsers.
     *
     * @param {object} nativeEvent Native browser event.
     * @return {number} Normalized `charCode` property.
     */

    function getEventCharCode$2(nativeEvent) {
      var charCode;
      var keyCode = nativeEvent.keyCode;

      if ('charCode' in nativeEvent) {
        charCode = nativeEvent.charCode;

        // FF does not set `charCode` for the Enter-key, check against `keyCode`.
        if (charCode === 0 && keyCode === 13) {
          charCode = 13;
        }
      } else {
        // IE8 does not implement `charCode`, but `keyCode` has the correct value.
        charCode = keyCode;
      }

      // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
      // Must not discard the (non-)printable Enter-key.
      if (charCode >= 32 || charCode === 13) {
        return charCode;
      }

      return 0;
    }

    var getEventCharCode_1 = getEventCharCode$2;

    var getEventCharCode$3 = getEventCharCode_1;

    /**
     * Normalization of deprecated HTML5 `key` values
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
     */
    var normalizeKey = {
      'Esc': 'Escape',
      'Spacebar': ' ',
      'Left': 'ArrowLeft',
      'Up': 'ArrowUp',
      'Right': 'ArrowRight',
      'Down': 'ArrowDown',
      'Del': 'Delete',
      'Win': 'OS',
      'Menu': 'ContextMenu',
      'Apps': 'ContextMenu',
      'Scroll': 'ScrollLock',
      'MozPrintableKey': 'Unidentified'
    };

    /**
     * Translation from legacy `keyCode` to HTML5 `key`
     * Only special keys supported, all others depend on keyboard layout or browser
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
     */
    var translateToKey = {
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      45: 'Insert',
      46: 'Delete',
      112: 'F1', 113: 'F2', 114: 'F3', 115: 'F4', 116: 'F5', 117: 'F6',
      118: 'F7', 119: 'F8', 120: 'F9', 121: 'F10', 122: 'F11', 123: 'F12',
      144: 'NumLock',
      145: 'ScrollLock',
      224: 'Meta'
    };

    /**
     * @param {object} nativeEvent Native browser event.
     * @return {string} Normalized `key` property.
     */
    function getEventKey$1(nativeEvent) {
      if (nativeEvent.key) {
        // Normalize inconsistent values reported by browsers due to
        // implementations of a working draft specification.

        // FireFox implements `key` but returns `MozPrintableKey` for all
        // printable characters (normalized to `Unidentified`), ignore it.
        var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
        if (key !== 'Unidentified') {
          return key;
        }
      }

      // Browser does not implement `key`, polyfill as much of it as we can.
      if (nativeEvent.type === 'keypress') {
        var charCode = getEventCharCode$3(nativeEvent);

        // The enter-key is technically both printable and non-printable and can
        // thus be captured by `keypress`, no other non-printable key should.
        return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
      }
      if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
        // While user keyboard layout determines the actual meaning of each
        // `keyCode` value, almost all function keys have a universal value.
        return translateToKey[nativeEvent.keyCode] || 'Unidentified';
      }
      return '';
    }

    var getEventKey_1 = getEventKey$1;

    var SyntheticUIEvent$4 = SyntheticUIEvent_1;

    var getEventCharCode$1 = getEventCharCode_1;
    var getEventKey = getEventKey_1;
    var getEventModifierState$2 = getEventModifierState_1;

    /**
     * @interface KeyboardEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var KeyboardEventInterface = {
      key: getEventKey,
      location: null,
      ctrlKey: null,
      shiftKey: null,
      altKey: null,
      metaKey: null,
      repeat: null,
      locale: null,
      getModifierState: getEventModifierState$2,
      // Legacy Interface
      charCode: function charCode(event) {
        // `charCode` is the result of a KeyPress event and represents the value of
        // the actual printable character.

        // KeyPress is deprecated, but its replacement is not yet final and not
        // implemented in any major browser. Only KeyPress has charCode.
        if (event.type === 'keypress') {
          return getEventCharCode$1(event);
        }
        return 0;
      },
      keyCode: function keyCode(event) {
        // `keyCode` is the result of a KeyDown/Up event and represents the value of
        // physical keyboard key.

        // The actual meaning of the value depends on the users' keyboard layout
        // which cannot be detected. Assuming that it is a US keyboard layout
        // provides a surprisingly accurate mapping for US and European users.
        // Due to this, it is left to the user to implement at this time.
        if (event.type === 'keydown' || event.type === 'keyup') {
          return event.keyCode;
        }
        return 0;
      },
      which: function which(event) {
        // `which` is an alias for either `keyCode` or `charCode` depending on the
        // type of the event.
        if (event.type === 'keypress') {
          return getEventCharCode$1(event);
        }
        if (event.type === 'keydown' || event.type === 'keyup') {
          return event.keyCode;
        }
        return 0;
      }
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticKeyboardEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticUIEvent$4.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticUIEvent$4.augmentClass(SyntheticKeyboardEvent$1, KeyboardEventInterface);

    var SyntheticKeyboardEvent_1 = SyntheticKeyboardEvent$1;

    var SyntheticMouseEvent$3 = SyntheticMouseEvent_1;

    /**
     * @interface DragEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var DragEventInterface = {
      dataTransfer: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticDragEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticMouseEvent$3.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticMouseEvent$3.augmentClass(SyntheticDragEvent$1, DragEventInterface);

    var SyntheticDragEvent_1 = SyntheticDragEvent$1;

    var SyntheticUIEvent$5 = SyntheticUIEvent_1;

    var getEventModifierState$3 = getEventModifierState_1;

    /**
     * @interface TouchEvent
     * @see http://www.w3.org/TR/touch-events/
     */
    var TouchEventInterface = {
      touches: null,
      targetTouches: null,
      changedTouches: null,
      altKey: null,
      metaKey: null,
      ctrlKey: null,
      shiftKey: null,
      getModifierState: getEventModifierState$3
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticTouchEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticUIEvent$5.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticUIEvent$5.augmentClass(SyntheticTouchEvent$1, TouchEventInterface);

    var SyntheticTouchEvent_1 = SyntheticTouchEvent$1;

    var SyntheticEvent$7 = SyntheticEvent_1;

    /**
     * @interface Event
     * @see http://www.w3.org/TR/2009/WD-css3-transitions-20090320/#transition-events-
     * @see https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent
     */
    var TransitionEventInterface = {
      propertyName: null,
      elapsedTime: null,
      pseudoElement: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticEvent}
     */
    function SyntheticTransitionEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticEvent$7.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent$7.augmentClass(SyntheticTransitionEvent$1, TransitionEventInterface);

    var SyntheticTransitionEvent_1 = SyntheticTransitionEvent$1;

    var SyntheticMouseEvent$4 = SyntheticMouseEvent_1;

    /**
     * @interface WheelEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var WheelEventInterface = {
      deltaX: function deltaX(event) {
        return 'deltaX' in event ? event.deltaX :
        // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
        'wheelDeltaX' in event ? -event.wheelDeltaX : 0;
      },
      deltaY: function deltaY(event) {
        return 'deltaY' in event ? event.deltaY :
        // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
        'wheelDeltaY' in event ? -event.wheelDeltaY :
        // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
        'wheelDelta' in event ? -event.wheelDelta : 0;
      },
      deltaZ: null,

      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticMouseEvent}
     */
    function SyntheticWheelEvent$1(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
      return SyntheticMouseEvent$4.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticMouseEvent$4.augmentClass(SyntheticWheelEvent$1, WheelEventInterface);

    var SyntheticWheelEvent_1 = SyntheticWheelEvent$1;

    var _prodInvariant$22 = reactProdInvariant_1$2;

    var EventListener$2 = EventListener_1;
    var EventPropagators$5 = EventPropagators_1;
    var ReactDOMComponentTree$12 = ReactDOMComponentTree_1;
    var SyntheticAnimationEvent = SyntheticAnimationEvent_1;
    var SyntheticClipboardEvent = SyntheticClipboardEvent_1;
    var SyntheticEvent$4 = SyntheticEvent_1;
    var SyntheticFocusEvent = SyntheticFocusEvent_1;
    var SyntheticKeyboardEvent = SyntheticKeyboardEvent_1;
    var SyntheticMouseEvent$2 = SyntheticMouseEvent_1;
    var SyntheticDragEvent = SyntheticDragEvent_1;
    var SyntheticTouchEvent = SyntheticTouchEvent_1;
    var SyntheticTransitionEvent = SyntheticTransitionEvent_1;
    var SyntheticUIEvent$2 = SyntheticUIEvent_1;
    var SyntheticWheelEvent = SyntheticWheelEvent_1;

    var emptyFunction$10 = emptyFunction_1;
    var getEventCharCode = getEventCharCode_1;
    var invariant$26 = invariant_1;

    /**
     * Turns
     * ['abort', ...]
     * into
     * eventTypes = {
     *   'abort': {
     *     phasedRegistrationNames: {
     *       bubbled: 'onAbort',
     *       captured: 'onAbortCapture',
     *     },
     *     dependencies: ['topAbort'],
     *   },
     *   ...
     * };
     * topLevelEventsToDispatchConfig = {
     *   'topAbort': { sameConfig }
     * };
     */
    var eventTypes$4 = {};
    var topLevelEventsToDispatchConfig = {};
    ['abort', 'animationEnd', 'animationIteration', 'animationStart', 'blur', 'canPlay', 'canPlayThrough', 'click', 'contextMenu', 'copy', 'cut', 'doubleClick', 'drag', 'dragEnd', 'dragEnter', 'dragExit', 'dragLeave', 'dragOver', 'dragStart', 'drop', 'durationChange', 'emptied', 'encrypted', 'ended', 'error', 'focus', 'input', 'invalid', 'keyDown', 'keyPress', 'keyUp', 'load', 'loadedData', 'loadedMetadata', 'loadStart', 'mouseDown', 'mouseMove', 'mouseOut', 'mouseOver', 'mouseUp', 'paste', 'pause', 'play', 'playing', 'progress', 'rateChange', 'reset', 'scroll', 'seeked', 'seeking', 'stalled', 'submit', 'suspend', 'timeUpdate', 'touchCancel', 'touchEnd', 'touchMove', 'touchStart', 'transitionEnd', 'volumeChange', 'waiting', 'wheel'].forEach(function (event) {
      var capitalizedEvent = event[0].toUpperCase() + event.slice(1);
      var onEvent = 'on' + capitalizedEvent;
      var topEvent = 'top' + capitalizedEvent;

      var type = {
        phasedRegistrationNames: {
          bubbled: onEvent,
          captured: onEvent + 'Capture'
        },
        dependencies: [topEvent]
      };
      eventTypes$4[event] = type;
      topLevelEventsToDispatchConfig[topEvent] = type;
    });

    var onClickListeners = {};

    function getDictionaryKey$1(inst) {
      // Prevents V8 performance issue:
      // https://github.com/facebook/react/pull/7232
      return '.' + inst._rootNodeID;
    }

    function isInteractive$1(tag) {
      return tag === 'button' || tag === 'input' || tag === 'select' || tag === 'textarea';
    }

    var SimpleEventPlugin$1 = {

      eventTypes: eventTypes$4,

      extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
        if (!dispatchConfig) {
          return null;
        }
        var EventConstructor;
        switch (topLevelType) {
          case 'topAbort':
          case 'topCanPlay':
          case 'topCanPlayThrough':
          case 'topDurationChange':
          case 'topEmptied':
          case 'topEncrypted':
          case 'topEnded':
          case 'topError':
          case 'topInput':
          case 'topInvalid':
          case 'topLoad':
          case 'topLoadedData':
          case 'topLoadedMetadata':
          case 'topLoadStart':
          case 'topPause':
          case 'topPlay':
          case 'topPlaying':
          case 'topProgress':
          case 'topRateChange':
          case 'topReset':
          case 'topSeeked':
          case 'topSeeking':
          case 'topStalled':
          case 'topSubmit':
          case 'topSuspend':
          case 'topTimeUpdate':
          case 'topVolumeChange':
          case 'topWaiting':
            // HTML Events
            // @see http://www.w3.org/TR/html5/index.html#events-0
            EventConstructor = SyntheticEvent$4;
            break;
          case 'topKeyPress':
            // Firefox creates a keypress event for function keys too. This removes
            // the unwanted keypress events. Enter is however both printable and
            // non-printable. One would expect Tab to be as well (but it isn't).
            if (getEventCharCode(nativeEvent) === 0) {
              return null;
            }
          /* falls through */
          case 'topKeyDown':
          case 'topKeyUp':
            EventConstructor = SyntheticKeyboardEvent;
            break;
          case 'topBlur':
          case 'topFocus':
            EventConstructor = SyntheticFocusEvent;
            break;
          case 'topClick':
            // Firefox creates a click event on right mouse clicks. This removes the
            // unwanted click events.
            if (nativeEvent.button === 2) {
              return null;
            }
          /* falls through */
          case 'topDoubleClick':
          case 'topMouseDown':
          case 'topMouseMove':
          case 'topMouseUp':
          // TODO: Disabled elements should not respond to mouse events
          /* falls through */
          case 'topMouseOut':
          case 'topMouseOver':
          case 'topContextMenu':
            EventConstructor = SyntheticMouseEvent$2;
            break;
          case 'topDrag':
          case 'topDragEnd':
          case 'topDragEnter':
          case 'topDragExit':
          case 'topDragLeave':
          case 'topDragOver':
          case 'topDragStart':
          case 'topDrop':
            EventConstructor = SyntheticDragEvent;
            break;
          case 'topTouchCancel':
          case 'topTouchEnd':
          case 'topTouchMove':
          case 'topTouchStart':
            EventConstructor = SyntheticTouchEvent;
            break;
          case 'topAnimationEnd':
          case 'topAnimationIteration':
          case 'topAnimationStart':
            EventConstructor = SyntheticAnimationEvent;
            break;
          case 'topTransitionEnd':
            EventConstructor = SyntheticTransitionEvent;
            break;
          case 'topScroll':
            EventConstructor = SyntheticUIEvent$2;
            break;
          case 'topWheel':
            EventConstructor = SyntheticWheelEvent;
            break;
          case 'topCopy':
          case 'topCut':
          case 'topPaste':
            EventConstructor = SyntheticClipboardEvent;
            break;
        }
        !EventConstructor ? process.env.NODE_ENV !== 'production' ? invariant$26(false, 'SimpleEventPlugin: Unhandled event type, `%s`.', topLevelType) : _prodInvariant$22('86', topLevelType) : void 0;
        var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
        EventPropagators$5.accumulateTwoPhaseDispatches(event);
        return event;
      },

      didPutListener: function didPutListener(inst, registrationName, listener) {
        // Mobile Safari does not fire properly bubble click events on
        // non-interactive elements, which means delegated click listeners do not
        // fire. The workaround for this bug involves attaching an empty click
        // listener on the target node.
        // http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
        if (registrationName === 'onClick' && !isInteractive$1(inst._tag)) {
          var key = getDictionaryKey$1(inst);
          var node = ReactDOMComponentTree$12.getNodeFromInstance(inst);
          if (!onClickListeners[key]) {
            onClickListeners[key] = EventListener$2.listen(node, 'click', emptyFunction$10);
          }
        }
      },

      willDeleteListener: function willDeleteListener(inst, registrationName) {
        if (registrationName === 'onClick' && !isInteractive$1(inst._tag)) {
          var key = getDictionaryKey$1(inst);
          onClickListeners[key].remove();
          delete onClickListeners[key];
        }
      }

    };

    var SimpleEventPlugin_1 = SimpleEventPlugin$1;

    var require$$17$1 = ( BeforeInputEventPlugin$2 && BeforeInputEventPlugin$2['default'] ) || BeforeInputEventPlugin$2;

    var require$$11 = ( ReactDOMComponent$2 && ReactDOMComponent$2['default'] ) || ReactDOMComponent$2;

    var ARIADOMPropertyConfig = ARIADOMPropertyConfig_1;
    var BeforeInputEventPlugin = require$$17$1;
    var ChangeEventPlugin = ChangeEventPlugin_1;
    var DefaultEventPluginOrder = DefaultEventPluginOrder_1;
    var EnterLeaveEventPlugin = EnterLeaveEventPlugin_1;
    var HTMLDOMPropertyConfig = HTMLDOMPropertyConfig_1;
    var ReactComponentBrowserEnvironment = ReactComponentBrowserEnvironment_1;
    var ReactDOMComponent = require$$11;
    var ReactDOMComponentTree$2 = ReactDOMComponentTree_1;
    var ReactDOMEmptyComponent = ReactDOMEmptyComponent_1;
    var ReactDOMTreeTraversal = ReactDOMTreeTraversal$1;
    var ReactDOMTextComponent = ReactDOMTextComponent_1;
    var ReactDefaultBatchingStrategy = ReactDefaultBatchingStrategy_1;
    var ReactEventListener = ReactEventListener_1;
    var ReactInjection = ReactInjection_1;
    var ReactReconcileTransaction = ReactReconcileTransaction_1;
    var SVGDOMPropertyConfig = SVGDOMPropertyConfig_1;
    var SelectEventPlugin = SelectEventPlugin_1;
    var SimpleEventPlugin = SimpleEventPlugin_1;

    var alreadyInjected = false;

    function inject() {
      if (alreadyInjected) {
        // TODO: This is currently true because these injections are shared between
        // the client and the server package. They should be built independently
        // and not share any injection state. Then this problem will be solved.
        return;
      }
      alreadyInjected = true;

      ReactInjection.EventEmitter.injectReactEventListener(ReactEventListener);

      /**
       * Inject modules for resolving DOM hierarchy and plugin ordering.
       */
      ReactInjection.EventPluginHub.injectEventPluginOrder(DefaultEventPluginOrder);
      ReactInjection.EventPluginUtils.injectComponentTree(ReactDOMComponentTree$2);
      ReactInjection.EventPluginUtils.injectTreeTraversal(ReactDOMTreeTraversal);

      /**
       * Some important event plugins included by default (without having to require
       * them).
       */
      ReactInjection.EventPluginHub.injectEventPluginsByName({
        SimpleEventPlugin: SimpleEventPlugin,
        EnterLeaveEventPlugin: EnterLeaveEventPlugin,
        ChangeEventPlugin: ChangeEventPlugin,
        SelectEventPlugin: SelectEventPlugin,
        BeforeInputEventPlugin: BeforeInputEventPlugin
      });

      ReactInjection.HostComponent.injectGenericComponentClass(ReactDOMComponent);

      ReactInjection.HostComponent.injectTextComponentClass(ReactDOMTextComponent);

      ReactInjection.DOMProperty.injectDOMPropertyConfig(ARIADOMPropertyConfig);
      ReactInjection.DOMProperty.injectDOMPropertyConfig(HTMLDOMPropertyConfig);
      ReactInjection.DOMProperty.injectDOMPropertyConfig(SVGDOMPropertyConfig);

      ReactInjection.EmptyComponent.injectEmptyComponentFactory(function (instantiate) {
        return new ReactDOMEmptyComponent(instantiate);
      });

      ReactInjection.Updates.injectReconcileTransaction(ReactReconcileTransaction);
      ReactInjection.Updates.injectBatchingStrategy(ReactDefaultBatchingStrategy);

      ReactInjection.Component.injectEnvironment(ReactComponentBrowserEnvironment);
    }

    var ReactDefaultInjection$1 = {
      inject: inject
    };

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    /**
     * Keeps track of the current owner.
     *
     * The current owner is the component who should own any components that are
     * currently being constructed.
     */

    var ReactCurrentOwner$5 = {

      /**
       * @internal
       * @type {ReactComponent}
       */
      current: null

    };

    var ReactCurrentOwner_1 = ReactCurrentOwner$5;

    var validateDOMNesting$3 = validateDOMNesting_1;

    var DOC_NODE_TYPE$1 = 9;

    function ReactDOMContainerInfo$1(topLevelWrapper, node) {
      var info = {
        _topLevelWrapper: topLevelWrapper,
        _idCounter: 1,
        _ownerDocument: node ? node.nodeType === DOC_NODE_TYPE$1 ? node : node.ownerDocument : null,
        _node: node,
        _tag: node ? node.nodeName.toLowerCase() : null,
        _namespaceURI: node ? node.namespaceURI : null
      };
      if (process.env.NODE_ENV !== 'production') {
        info._ancestorInfo = node ? validateDOMNesting$3.updatedAncestorInfo(null, info._tag, null) : null;
      }
      return info;
    }

    var ReactDOMContainerInfo_1 = ReactDOMContainerInfo$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var ReactDOMFeatureFlags$1 = {
      useCreateElement: true,
      useFiber: false
    };

    var ReactDOMFeatureFlags_1 = ReactDOMFeatureFlags$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /**
     * `ReactInstanceMap` maintains a mapping from a public facing stateful
     * instance (key) and the internal representation (value). This allows public
     * methods to accept the user facing instance as an argument and map them back
     * to internal methods.
     */

    // TODO: Replace this with ES6: var ReactInstanceMap = new Map();

    var ReactInstanceMap$2 = {

      /**
       * This API should be called `delete` but we'd have to make sure to always
       * transform these to strings for IE support. When this transform is fully
       * supported we can rename it.
       */
      remove: function remove(key) {
        key._reactInternalInstance = undefined;
      },

      get: function get(key) {
        return key._reactInternalInstance;
      },

      has: function has(key) {
        return key._reactInternalInstance !== undefined;
      },

      set: function set(key, value) {
        key._reactInternalInstance = value;
      }

    };

    var ReactInstanceMap_1 = ReactInstanceMap$2;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    var MOD = 65521;

    // adler32 is not cryptographically strong, and is only used to sanity check that
    // markup generated on the server matches the markup generated on the client.
    // This implementation (a modified version of the SheetJS version) has been optimized
    // for our use case, at the expense of conforming to the adler32 specification
    // for non-ascii inputs.
    function adler32$1(data) {
      var a = 1;
      var b = 0;
      var i = 0;
      var l = data.length;
      var m = l & ~0x3;
      while (i < m) {
        var n = Math.min(i + 4096, m);
        for (; i < n; i += 4) {
          b += (a += data.charCodeAt(i)) + (a += data.charCodeAt(i + 1)) + (a += data.charCodeAt(i + 2)) + (a += data.charCodeAt(i + 3));
        }
        a %= MOD;
        b %= MOD;
      }
      for (; i < l; i++) {
        b += a += data.charCodeAt(i);
      }
      a %= MOD;
      b %= MOD;
      return a | b << 16;
    }

    var adler32_1 = adler32$1;

    var adler32 = adler32_1;

    var TAG_END = /\/?>/;
    var COMMENT_START = /^<\!\-\-/;

    var ReactMarkupChecksum$1 = {
      CHECKSUM_ATTR_NAME: 'data-react-checksum',

      /**
       * @param {string} markup Markup string
       * @return {string} Markup string with checksum attribute attached
       */
      addChecksumToMarkup: function addChecksumToMarkup(markup) {
        var checksum = adler32(markup);

        // Add checksum (handle both parent tags, comments and self-closing tags)
        if (COMMENT_START.test(markup)) {
          return markup;
        } else {
          return markup.replace(TAG_END, ' ' + ReactMarkupChecksum$1.CHECKSUM_ATTR_NAME + '="' + checksum + '"$&');
        }
      },

      /**
       * @param {string} markup to use
       * @param {DOMElement} element root React element
       * @returns {boolean} whether or not the markup is the same
       */
      canReuseMarkup: function canReuseMarkup(markup, element) {
        var existingChecksum = element.getAttribute(ReactMarkupChecksum$1.CHECKSUM_ATTR_NAME);
        existingChecksum = existingChecksum && parseInt(existingChecksum, 10);
        var markupChecksum = adler32(markup);
        return markupChecksum === existingChecksum;
      }
    };

    var ReactMarkupChecksum_1 = ReactMarkupChecksum$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var _prodInvariant$24 = require('./reactProdInvariant');
    var _assign$14 = require('object-assign');

    var ReactCompositeComponent = require('./ReactCompositeComponent');
    var ReactEmptyComponent$2 = require('./ReactEmptyComponent');
    var ReactHostComponent$2 = require('./ReactHostComponent');

    var getNextDebugID = require('./getNextDebugID');
    var invariant$28 = require('fbjs/lib/invariant');
    var warning$19 = require('fbjs/lib/warning');

    // To avoid a cyclic dependency, we create the final class in this module
    var ReactCompositeComponentWrapper = function ReactCompositeComponentWrapper(element) {
      this.construct(element);
    };
    _assign$14(ReactCompositeComponentWrapper.prototype, ReactCompositeComponent, {
      _instantiateReactComponent: instantiateReactComponent$1
    });

    function getDeclarationErrorAddendum$2(owner) {
      if (owner) {
        var name = owner.getName();
        if (name) {
          return ' Check the render method of `' + name + '`.';
        }
      }
      return '';
    }

    /**
     * Check if the type reference is a known internal type. I.e. not a user
     * provided composite type.
     *
     * @param {function} type
     * @return {boolean} Returns true if this is a valid internal type.
     */
    function isInternalComponentType(type) {
      return typeof type === 'function' && typeof type.prototype !== 'undefined' && typeof type.prototype.mountComponent === 'function' && typeof type.prototype.receiveComponent === 'function';
    }

    /**
     * Given a ReactNode, create an instance that will actually be mounted.
     *
     * @param {ReactNode} node
     * @param {boolean} shouldHaveDebugID
     * @return {object} A new instance of the element's constructor.
     * @protected
     */
    function instantiateReactComponent$1(node, shouldHaveDebugID) {
      var instance;

      if (node === null || node === false) {
        instance = ReactEmptyComponent$2.create(instantiateReactComponent$1);
      } else if ((typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object') {
        var element = node;
        var type = element.type;
        if (typeof type !== 'function' && typeof type !== 'string') {
          var info = '';
          if (process.env.NODE_ENV !== 'production') {
            if (type === undefined || (typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object' && type !== null && Object.keys(type).length === 0) {
              info += ' You likely forgot to export your component from the file ' + 'it\'s defined in.';
            }
          }
          info += getDeclarationErrorAddendum$2(element._owner);
          process.env.NODE_ENV !== 'production' ? invariant$28(false, 'Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s', type == null ? type : typeof type === 'undefined' ? 'undefined' : _typeof(type), info) : _prodInvariant$24('130', type == null ? type : typeof type === 'undefined' ? 'undefined' : _typeof(type), info);
        }

        // Special case string values
        if (typeof element.type === 'string') {
          instance = ReactHostComponent$2.createInternalComponent(element);
        } else if (isInternalComponentType(element.type)) {
          // This is temporarily available for custom components that are not string
          // representations. I.e. ART. Once those are updated to use the string
          // representation, we can drop this code path.
          instance = new element.type(element);

          // We renamed this. Allow the old name for compat. :(
          if (!instance.getHostNode) {
            instance.getHostNode = instance.getNativeNode;
          }
        } else {
          instance = new ReactCompositeComponentWrapper(element);
        }
      } else if (typeof node === 'string' || typeof node === 'number') {
        instance = ReactHostComponent$2.createInstanceForText(node);
      } else {
        process.env.NODE_ENV !== 'production' ? invariant$28(false, 'Encountered invalid React node of type %s', typeof node === 'undefined' ? 'undefined' : _typeof(node)) : _prodInvariant$24('131', typeof node === 'undefined' ? 'undefined' : _typeof(node));
      }

      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning$19(typeof instance.mountComponent === 'function' && typeof instance.receiveComponent === 'function' && typeof instance.getHostNode === 'function' && typeof instance.unmountComponent === 'function', 'Only React Components can be mounted.') : void 0;
      }

      // These two fields are used by the DOM and ART diffing algorithms
      // respectively. Instead of using expandos on components, we should be
      // storing the state needed by the diffing algorithms elsewhere.
      instance._mountIndex = 0;
      instance._mountImage = null;

      if (process.env.NODE_ENV !== 'production') {
        instance._debugID = shouldHaveDebugID ? getNextDebugID() : 0;
      }

      // Internal instances should fully constructed at this point, so they should
      // not get any new fields added to them at this point.
      if (process.env.NODE_ENV !== 'production') {
        if (Object.preventExtensions) {
          Object.preventExtensions(instance);
        }
      }

      return instance;
    }

    module.exports = instantiateReactComponent$1;



    var instantiateReactComponent$2 = Object.freeze({

    });

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    /**
     * Given a `prevElement` and `nextElement`, determines if the existing
     * instance should be updated as opposed to being destroyed or replaced by a new
     * instance. Both arguments are elements. This ensures that this logic can
     * operate on stateless trees without any backing instance.
     *
     * @param {?object} prevElement
     * @param {?object} nextElement
     * @return {boolean} True if the existing instance should be updated.
     * @protected
     */

    function shouldUpdateReactComponent$1(prevElement, nextElement) {
      var prevEmpty = prevElement === null || prevElement === false;
      var nextEmpty = nextElement === null || nextElement === false;
      if (prevEmpty || nextEmpty) {
        return prevEmpty === nextEmpty;
      }

      var prevType = typeof prevElement === 'undefined' ? 'undefined' : _typeof(prevElement);
      var nextType = typeof nextElement === 'undefined' ? 'undefined' : _typeof(nextElement);
      if (prevType === 'string' || prevType === 'number') {
        return nextType === 'string' || nextType === 'number';
      } else {
        return nextType === 'object' && prevElement.type === nextElement.type && prevElement.key === nextElement.key;
      }
    }

    module.exports = shouldUpdateReactComponent$1;



    var shouldUpdateReactComponent$2 = Object.freeze({

    });

    var require$$4$5 = ( instantiateReactComponent$2 && instantiateReactComponent$2['default'] ) || instantiateReactComponent$2;

    var require$$1$17 = ( shouldUpdateReactComponent$2 && shouldUpdateReactComponent$2['default'] ) || shouldUpdateReactComponent$2;

    var _prodInvariant$23 = reactProdInvariant_1$2;

    var DOMLazyTree$6 = DOMLazyTree_1;
    var DOMProperty$5 = DOMProperty_1;
    var React$3 = React_1;
    var ReactBrowserEventEmitter$4 = ReactBrowserEventEmitter_1;
    var ReactCurrentOwner$4 = ReactCurrentOwner_1;
    var ReactDOMComponentTree$13 = ReactDOMComponentTree_1;
    var ReactDOMContainerInfo = ReactDOMContainerInfo_1;
    var ReactDOMFeatureFlags = ReactDOMFeatureFlags_1;
    var ReactFeatureFlags$2 = ReactFeatureFlags_1;
    var ReactInstanceMap$1 = ReactInstanceMap_1;
    var ReactInstrumentation$8 = ReactInstrumentation$2;
    var ReactMarkupChecksum = ReactMarkupChecksum_1;
    var ReactReconciler$3 = ReactReconciler_1;
    var ReactUpdateQueue$3 = require$$7$1;
    var ReactUpdates$7 = ReactUpdates_1;

    var emptyObject$4 = emptyObject_1;
    var instantiateReactComponent = require$$4$5;
    var invariant$27 = invariant_1;
    var setInnerHTML$4 = setInnerHTML_1;
    var shouldUpdateReactComponent = require$$1$17;
    var warning$18 = warning_1;

    var ATTR_NAME$1 = DOMProperty$5.ID_ATTRIBUTE_NAME;
    var ROOT_ATTR_NAME = DOMProperty$5.ROOT_ATTRIBUTE_NAME;

    var ELEMENT_NODE_TYPE$1 = 1;
    var DOC_NODE_TYPE = 9;
    var DOCUMENT_FRAGMENT_NODE_TYPE$1 = 11;

    var instancesByReactRootID = {};

    /**
     * Finds the index of the first character
     * that's not common between the two given strings.
     *
     * @return {number} the index of the character where the strings diverge
     */
    function firstDifferenceIndex(string1, string2) {
      var minLen = Math.min(string1.length, string2.length);
      for (var i = 0; i < minLen; i++) {
        if (string1.charAt(i) !== string2.charAt(i)) {
          return i;
        }
      }
      return string1.length === string2.length ? -1 : minLen;
    }

    /**
     * @param {DOMElement|DOMDocument} container DOM element that may contain
     * a React component
     * @return {?*} DOM element that may have the reactRoot ID, or null.
     */
    function getReactRootElementInContainer(container) {
      if (!container) {
        return null;
      }

      if (container.nodeType === DOC_NODE_TYPE) {
        return container.documentElement;
      } else {
        return container.firstChild;
      }
    }

    function internalGetID(node) {
      // If node is something like a window, document, or text node, none of
      // which support attributes or a .getAttribute method, gracefully return
      // the empty string, as if the attribute were missing.
      return node.getAttribute && node.getAttribute(ATTR_NAME$1) || '';
    }

    /**
     * Mounts this component and inserts it into the DOM.
     *
     * @param {ReactComponent} componentInstance The instance to mount.
     * @param {DOMElement} container DOM element to mount into.
     * @param {ReactReconcileTransaction} transaction
     * @param {boolean} shouldReuseMarkup If true, do not insert markup
     */
    function mountComponentIntoNode(wrapperInstance, container, transaction, shouldReuseMarkup, context) {
      var markerName;
      if (ReactFeatureFlags$2.logTopLevelRenders) {
        var wrappedElement = wrapperInstance._currentElement.props.child;
        var type = wrappedElement.type;
        markerName = 'React mount: ' + (typeof type === 'string' ? type : type.displayName || type.name);
        console.time(markerName);
      }

      var markup = ReactReconciler$3.mountComponent(wrapperInstance, transaction, null, ReactDOMContainerInfo(wrapperInstance, container), context, 0 /* parentDebugID */
      );

      if (markerName) {
        console.timeEnd(markerName);
      }

      wrapperInstance._renderedComponent._topLevelWrapper = wrapperInstance;
      ReactMount$1._mountImageIntoNode(markup, container, wrapperInstance, shouldReuseMarkup, transaction);
    }

    /**
     * Batched mount.
     *
     * @param {ReactComponent} componentInstance The instance to mount.
     * @param {DOMElement} container DOM element to mount into.
     * @param {boolean} shouldReuseMarkup If true, do not insert markup
     */
    function batchedMountComponentIntoNode(componentInstance, container, shouldReuseMarkup, context) {
      var transaction = ReactUpdates$7.ReactReconcileTransaction.getPooled(
      /* useCreateElement */
      !shouldReuseMarkup && ReactDOMFeatureFlags.useCreateElement);
      transaction.perform(mountComponentIntoNode, null, componentInstance, container, transaction, shouldReuseMarkup, context);
      ReactUpdates$7.ReactReconcileTransaction.release(transaction);
    }

    /**
     * Unmounts a component and removes it from the DOM.
     *
     * @param {ReactComponent} instance React component instance.
     * @param {DOMElement} container DOM element to unmount from.
     * @final
     * @internal
     * @see {ReactMount.unmountComponentAtNode}
     */
    function unmountComponentFromNode(instance, container, safely) {
      if (process.env.NODE_ENV !== 'production') {
        ReactInstrumentation$8.debugTool.onBeginFlush();
      }
      ReactReconciler$3.unmountComponent(instance, safely);
      if (process.env.NODE_ENV !== 'production') {
        ReactInstrumentation$8.debugTool.onEndFlush();
      }

      if (container.nodeType === DOC_NODE_TYPE) {
        container = container.documentElement;
      }

      // http://jsperf.com/emptying-a-node
      while (container.lastChild) {
        container.removeChild(container.lastChild);
      }
    }

    /**
     * True if the supplied DOM node has a direct React-rendered child that is
     * not a React root element. Useful for warning in `render`,
     * `unmountComponentAtNode`, etc.
     *
     * @param {?DOMElement} node The candidate DOM node.
     * @return {boolean} True if the DOM element contains a direct child that was
     * rendered by React but is not a root element.
     * @internal
     */
    function hasNonRootReactChild(container) {
      var rootEl = getReactRootElementInContainer(container);
      if (rootEl) {
        var inst = ReactDOMComponentTree$13.getInstanceFromNode(rootEl);
        return !!(inst && inst._hostParent);
      }
    }

    /**
     * True if the supplied DOM node is a React DOM element and
     * it has been rendered by another copy of React.
     *
     * @param {?DOMElement} node The candidate DOM node.
     * @return {boolean} True if the DOM has been rendered by another copy of React
     * @internal
     */
    function nodeIsRenderedByOtherInstance(container) {
      var rootEl = getReactRootElementInContainer(container);
      return !!(rootEl && isReactNode(rootEl) && !ReactDOMComponentTree$13.getInstanceFromNode(rootEl));
    }

    /**
     * True if the supplied DOM node is a valid node element.
     *
     * @param {?DOMElement} node The candidate DOM node.
     * @return {boolean} True if the DOM is a valid DOM node.
     * @internal
     */
    function isValidContainer(node) {
      return !!(node && (node.nodeType === ELEMENT_NODE_TYPE$1 || node.nodeType === DOC_NODE_TYPE || node.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE$1));
    }

    /**
     * True if the supplied DOM node is a valid React node element.
     *
     * @param {?DOMElement} node The candidate DOM node.
     * @return {boolean} True if the DOM is a valid React DOM node.
     * @internal
     */
    function isReactNode(node) {
      return isValidContainer(node) && (node.hasAttribute(ROOT_ATTR_NAME) || node.hasAttribute(ATTR_NAME$1));
    }

    function getHostRootInstanceInContainer(container) {
      var rootEl = getReactRootElementInContainer(container);
      var prevHostInstance = rootEl && ReactDOMComponentTree$13.getInstanceFromNode(rootEl);
      return prevHostInstance && !prevHostInstance._hostParent ? prevHostInstance : null;
    }

    function getTopLevelWrapperInContainer(container) {
      var root = getHostRootInstanceInContainer(container);
      return root ? root._hostContainerInfo._topLevelWrapper : null;
    }

    /**
     * Temporary (?) hack so that we can store all top-level pending updates on
     * composites instead of having to worry about different types of components
     * here.
     */
    var topLevelRootCounter = 1;
    var TopLevelWrapper = function TopLevelWrapper() {
      this.rootID = topLevelRootCounter++;
    };
    TopLevelWrapper.prototype.isReactComponent = {};
    if (process.env.NODE_ENV !== 'production') {
      TopLevelWrapper.displayName = 'TopLevelWrapper';
    }
    TopLevelWrapper.prototype.render = function () {
      return this.props.child;
    };
    TopLevelWrapper.isReactTopLevelWrapper = true;

    /**
     * Mounting is the process of initializing a React component by creating its
     * representative DOM elements and inserting them into a supplied `container`.
     * Any prior content inside `container` is destroyed in the process.
     *
     *   ReactMount.render(
     *     component,
     *     document.getElementById('container')
     *   );
     *
     *   <div id="container">                   <-- Supplied `container`.
     *     <div data-reactid=".3">              <-- Rendered reactRoot of React
     *       // ...                                 component.
     *     </div>
     *   </div>
     *
     * Inside of `container`, the first element rendered is the "reactRoot".
     */
    var ReactMount$1 = {

      TopLevelWrapper: TopLevelWrapper,

      /**
       * Used by devtools. The keys are not important.
       */
      _instancesByReactRootID: instancesByReactRootID,

      /**
       * This is a hook provided to support rendering React components while
       * ensuring that the apparent scroll position of its `container` does not
       * change.
       *
       * @param {DOMElement} container The `container` being rendered into.
       * @param {function} renderCallback This must be called once to do the render.
       */
      scrollMonitor: function scrollMonitor(container, renderCallback) {
        renderCallback();
      },

      /**
       * Take a component that's already mounted into the DOM and replace its props
       * @param {ReactComponent} prevComponent component instance already in the DOM
       * @param {ReactElement} nextElement component instance to render
       * @param {DOMElement} container container to render into
       * @param {?function} callback function triggered on completion
       */
      _updateRootComponent: function _updateRootComponent(prevComponent, nextElement, nextContext, container, callback) {
        ReactMount$1.scrollMonitor(container, function () {
          ReactUpdateQueue$3.enqueueElementInternal(prevComponent, nextElement, nextContext);
          if (callback) {
            ReactUpdateQueue$3.enqueueCallbackInternal(prevComponent, callback);
          }
        });

        return prevComponent;
      },

      /**
       * Render a new component into the DOM. Hooked by hooks!
       *
       * @param {ReactElement} nextElement element to render
       * @param {DOMElement} container container to render into
       * @param {boolean} shouldReuseMarkup if we should skip the markup insertion
       * @return {ReactComponent} nextComponent
       */
      _renderNewRootComponent: function _renderNewRootComponent(nextElement, container, shouldReuseMarkup, context) {
        // Various parts of our code (such as ReactCompositeComponent's
        // _renderValidatedComponent) assume that calls to render aren't nested;
        // verify that that's the case.
        process.env.NODE_ENV !== 'production' ? warning$18(ReactCurrentOwner$4.current == null, '_renderNewRootComponent(): Render methods should be a pure function ' + 'of props and state; triggering nested component updates from ' + 'render is not allowed. If necessary, trigger nested updates in ' + 'componentDidUpdate. Check the render method of %s.', ReactCurrentOwner$4.current && ReactCurrentOwner$4.current.getName() || 'ReactCompositeComponent') : void 0;

        !isValidContainer(container) ? process.env.NODE_ENV !== 'production' ? invariant$27(false, '_registerComponent(...): Target container is not a DOM element.') : _prodInvariant$23('37') : void 0;

        ReactBrowserEventEmitter$4.ensureScrollValueMonitoring();
        var componentInstance = instantiateReactComponent(nextElement, false);

        // The initial render is synchronous but any updates that happen during
        // rendering, in componentWillMount or componentDidMount, will be batched
        // according to the current batching strategy.

        ReactUpdates$7.batchedUpdates(batchedMountComponentIntoNode, componentInstance, container, shouldReuseMarkup, context);

        var wrapperID = componentInstance._instance.rootID;
        instancesByReactRootID[wrapperID] = componentInstance;

        return componentInstance;
      },

      /**
       * Renders a React component into the DOM in the supplied `container`.
       *
       * If the React component was previously rendered into `container`, this will
       * perform an update on it and only mutate the DOM as necessary to reflect the
       * latest React component.
       *
       * @param {ReactComponent} parentComponent The conceptual parent of this render tree.
       * @param {ReactElement} nextElement Component element to render.
       * @param {DOMElement} container DOM element to render into.
       * @param {?function} callback function triggered on completion
       * @return {ReactComponent} Component instance rendered in `container`.
       */
      renderSubtreeIntoContainer: function renderSubtreeIntoContainer(parentComponent, nextElement, container, callback) {
        !(parentComponent != null && ReactInstanceMap$1.has(parentComponent)) ? process.env.NODE_ENV !== 'production' ? invariant$27(false, 'parentComponent must be a valid React Component') : _prodInvariant$23('38') : void 0;
        return ReactMount$1._renderSubtreeIntoContainer(parentComponent, nextElement, container, callback);
      },

      _renderSubtreeIntoContainer: function _renderSubtreeIntoContainer(parentComponent, nextElement, container, callback) {
        ReactUpdateQueue$3.validateCallback(callback, 'ReactDOM.render');
        !React$3.isValidElement(nextElement) ? process.env.NODE_ENV !== 'production' ? invariant$27(false, 'ReactDOM.render(): Invalid component element.%s', typeof nextElement === 'string' ? ' Instead of passing a string like \'div\', pass ' + 'React.createElement(\'div\') or <div />.' : typeof nextElement === 'function' ? ' Instead of passing a class like Foo, pass ' + 'React.createElement(Foo) or <Foo />.' :
        // Check if it quacks like an element
        nextElement != null && nextElement.props !== undefined ? ' This may be caused by unintentionally loading two independent ' + 'copies of React.' : '') : _prodInvariant$23('39', typeof nextElement === 'string' ? ' Instead of passing a string like \'div\', pass ' + 'React.createElement(\'div\') or <div />.' : typeof nextElement === 'function' ? ' Instead of passing a class like Foo, pass ' + 'React.createElement(Foo) or <Foo />.' : nextElement != null && nextElement.props !== undefined ? ' This may be caused by unintentionally loading two independent ' + 'copies of React.' : '') : void 0;

        process.env.NODE_ENV !== 'production' ? warning$18(!container || !container.tagName || container.tagName.toUpperCase() !== 'BODY', 'render(): Rendering components directly into document.body is ' + 'discouraged, since its children are often manipulated by third-party ' + 'scripts and browser extensions. This may lead to subtle ' + 'reconciliation issues. Try rendering into a container element created ' + 'for your app.') : void 0;

        var nextWrappedElement = React$3.createElement(TopLevelWrapper, { child: nextElement });

        var nextContext;
        if (parentComponent) {
          var parentInst = ReactInstanceMap$1.get(parentComponent);
          nextContext = parentInst._processChildContext(parentInst._context);
        } else {
          nextContext = emptyObject$4;
        }

        var prevComponent = getTopLevelWrapperInContainer(container);

        if (prevComponent) {
          var prevWrappedElement = prevComponent._currentElement;
          var prevElement = prevWrappedElement.props.child;
          if (shouldUpdateReactComponent(prevElement, nextElement)) {
            var publicInst = prevComponent._renderedComponent.getPublicInstance();
            var updatedCallback = callback && function () {
              callback.call(publicInst);
            };
            ReactMount$1._updateRootComponent(prevComponent, nextWrappedElement, nextContext, container, updatedCallback);
            return publicInst;
          } else {
            ReactMount$1.unmountComponentAtNode(container);
          }
        }

        var reactRootElement = getReactRootElementInContainer(container);
        var containerHasReactMarkup = reactRootElement && !!internalGetID(reactRootElement);
        var containerHasNonRootReactChild = hasNonRootReactChild(container);

        if (process.env.NODE_ENV !== 'production') {
          process.env.NODE_ENV !== 'production' ? warning$18(!containerHasNonRootReactChild, 'render(...): Replacing React-rendered children with a new root ' + 'component. If you intended to update the children of this node, ' + 'you should instead have the existing children update their state ' + 'and render the new components instead of calling ReactDOM.render.') : void 0;

          if (!containerHasReactMarkup || reactRootElement.nextSibling) {
            var rootElementSibling = reactRootElement;
            while (rootElementSibling) {
              if (internalGetID(rootElementSibling)) {
                process.env.NODE_ENV !== 'production' ? warning$18(false, 'render(): Target node has markup rendered by React, but there ' + 'are unrelated nodes as well. This is most commonly caused by ' + 'white-space inserted around server-rendered markup.') : void 0;
                break;
              }
              rootElementSibling = rootElementSibling.nextSibling;
            }
          }
        }

        var shouldReuseMarkup = containerHasReactMarkup && !prevComponent && !containerHasNonRootReactChild;
        var component = ReactMount$1._renderNewRootComponent(nextWrappedElement, container, shouldReuseMarkup, nextContext)._renderedComponent.getPublicInstance();
        if (callback) {
          callback.call(component);
        }
        return component;
      },

      /**
       * Renders a React component into the DOM in the supplied `container`.
       * See https://facebook.github.io/react/docs/top-level-api.html#reactdom.render
       *
       * If the React component was previously rendered into `container`, this will
       * perform an update on it and only mutate the DOM as necessary to reflect the
       * latest React component.
       *
       * @param {ReactElement} nextElement Component element to render.
       * @param {DOMElement} container DOM element to render into.
       * @param {?function} callback function triggered on completion
       * @return {ReactComponent} Component instance rendered in `container`.
       */
      render: function render(nextElement, container, callback) {
        return ReactMount$1._renderSubtreeIntoContainer(null, nextElement, container, callback);
      },

      /**
       * Unmounts and destroys the React component rendered in the `container`.
       * See https://facebook.github.io/react/docs/top-level-api.html#reactdom.unmountcomponentatnode
       *
       * @param {DOMElement} container DOM element containing a React component.
       * @return {boolean} True if a component was found in and unmounted from
       *                   `container`
       */
      unmountComponentAtNode: function unmountComponentAtNode(container) {
        // Various parts of our code (such as ReactCompositeComponent's
        // _renderValidatedComponent) assume that calls to render aren't nested;
        // verify that that's the case. (Strictly speaking, unmounting won't cause a
        // render but we still don't expect to be in a render call here.)
        process.env.NODE_ENV !== 'production' ? warning$18(ReactCurrentOwner$4.current == null, 'unmountComponentAtNode(): Render methods should be a pure function ' + 'of props and state; triggering nested component updates from render ' + 'is not allowed. If necessary, trigger nested updates in ' + 'componentDidUpdate. Check the render method of %s.', ReactCurrentOwner$4.current && ReactCurrentOwner$4.current.getName() || 'ReactCompositeComponent') : void 0;

        !isValidContainer(container) ? process.env.NODE_ENV !== 'production' ? invariant$27(false, 'unmountComponentAtNode(...): Target container is not a DOM element.') : _prodInvariant$23('40') : void 0;

        if (process.env.NODE_ENV !== 'production') {
          process.env.NODE_ENV !== 'production' ? warning$18(!nodeIsRenderedByOtherInstance(container), 'unmountComponentAtNode(): The node you\'re attempting to unmount ' + 'was rendered by another copy of React.') : void 0;
        }

        var prevComponent = getTopLevelWrapperInContainer(container);
        if (!prevComponent) {
          // Check if the node being unmounted was rendered by React, but isn't a
          // root node.
          var containerHasNonRootReactChild = hasNonRootReactChild(container);

          // Check if the container itself is a React root node.
          var isContainerReactRoot = container.nodeType === 1 && container.hasAttribute(ROOT_ATTR_NAME);

          if (process.env.NODE_ENV !== 'production') {
            process.env.NODE_ENV !== 'production' ? warning$18(!containerHasNonRootReactChild, 'unmountComponentAtNode(): The node you\'re attempting to unmount ' + 'was rendered by React and is not a top-level container. %s', isContainerReactRoot ? 'You may have accidentally passed in a React root node instead ' + 'of its container.' : 'Instead, have the parent component update its state and ' + 'rerender in order to remove this component.') : void 0;
          }

          return false;
        }
        delete instancesByReactRootID[prevComponent._instance.rootID];
        ReactUpdates$7.batchedUpdates(unmountComponentFromNode, prevComponent, container, false);
        return true;
      },

      _mountImageIntoNode: function _mountImageIntoNode(markup, container, instance, shouldReuseMarkup, transaction) {
        !isValidContainer(container) ? process.env.NODE_ENV !== 'production' ? invariant$27(false, 'mountComponentIntoNode(...): Target container is not valid.') : _prodInvariant$23('41') : void 0;

        if (shouldReuseMarkup) {
          var rootElement = getReactRootElementInContainer(container);
          if (ReactMarkupChecksum.canReuseMarkup(markup, rootElement)) {
            ReactDOMComponentTree$13.precacheNode(instance, rootElement);
            return;
          } else {
            var checksum = rootElement.getAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
            rootElement.removeAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);

            var rootMarkup = rootElement.outerHTML;
            rootElement.setAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME, checksum);

            var normalizedMarkup = markup;
            if (process.env.NODE_ENV !== 'production') {
              // because rootMarkup is retrieved from the DOM, various normalizations
              // will have occurred which will not be present in `markup`. Here,
              // insert markup into a <div> or <iframe> depending on the container
              // type to perform the same normalizations before comparing.
              var normalizer;
              if (container.nodeType === ELEMENT_NODE_TYPE$1) {
                normalizer = document.createElement('div');
                normalizer.innerHTML = markup;
                normalizedMarkup = normalizer.innerHTML;
              } else {
                normalizer = document.createElement('iframe');
                document.body.appendChild(normalizer);
                normalizer.contentDocument.write(markup);
                normalizedMarkup = normalizer.contentDocument.documentElement.outerHTML;
                document.body.removeChild(normalizer);
              }
            }

            var diffIndex = firstDifferenceIndex(normalizedMarkup, rootMarkup);
            var difference = ' (client) ' + normalizedMarkup.substring(diffIndex - 20, diffIndex + 20) + '\n (server) ' + rootMarkup.substring(diffIndex - 20, diffIndex + 20);

            !(container.nodeType !== DOC_NODE_TYPE) ? process.env.NODE_ENV !== 'production' ? invariant$27(false, 'You\'re trying to render a component to the document using server rendering but the checksum was invalid. This usually means you rendered a different component type or props on the client from the one on the server, or your render() methods are impure. React cannot handle this case due to cross-browser quirks by rendering at the document root. You should look for environment dependent code in your components and ensure the props are the same client and server side:\n%s', difference) : _prodInvariant$23('42', difference) : void 0;

            if (process.env.NODE_ENV !== 'production') {
              process.env.NODE_ENV !== 'production' ? warning$18(false, 'React attempted to reuse markup in a container but the ' + 'checksum was invalid. This generally means that you are ' + 'using server rendering and the markup generated on the ' + 'server was not what the client was expecting. React injected ' + 'new markup to compensate which works but you have lost many ' + 'of the benefits of server rendering. Instead, figure out ' + 'why the markup being generated is different on the client ' + 'or server:\n%s', difference) : void 0;
            }
          }
        }

        !(container.nodeType !== DOC_NODE_TYPE) ? process.env.NODE_ENV !== 'production' ? invariant$27(false, 'You\'re trying to render a component to the document but you didn\'t use server rendering. We can\'t do this without using server rendering due to cross-browser quirks. See ReactDOMServer.renderToString() for server rendering.') : _prodInvariant$23('43') : void 0;

        if (transaction.useCreateElement) {
          while (container.lastChild) {
            container.removeChild(container.lastChild);
          }
          DOMLazyTree$6.insertTreeBefore(container, markup, null);
        } else {
          setInnerHTML$4(container, markup);
          ReactDOMComponentTree$13.precacheNode(instance, container.firstChild);
        }

        if (process.env.NODE_ENV !== 'production') {
          var hostNode = ReactDOMComponentTree$13.getInstanceFromNode(container.firstChild);
          if (hostNode._debugID !== 0) {
            ReactInstrumentation$8.debugTool.onHostOperation({
              instanceID: hostNode._debugID,
              type: 'mount',
              payload: markup.toString()
            });
          }
        }
      }
    };

    var ReactMount_1 = ReactMount$1;

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     */

    var _prodInvariant$26 = reactProdInvariant_1$2;

    var React$4 = React_1;

    var invariant$30 = invariant_1;

    var ReactNodeTypes$1 = {
      HOST: 0,
      COMPOSITE: 1,
      EMPTY: 2,

      getType: function getType(node) {
        if (node === null || node === false) {
          return ReactNodeTypes$1.EMPTY;
        } else if (React$4.isValidElement(node)) {
          if (typeof node.type === 'function') {
            return ReactNodeTypes$1.COMPOSITE;
          } else {
            return ReactNodeTypes$1.HOST;
          }
        }
        process.env.NODE_ENV !== 'production' ? invariant$30(false, 'Unexpected node: %s', node) : _prodInvariant$26('26', node);
      }
    };

    var ReactNodeTypes_1 = ReactNodeTypes$1;

    var ReactNodeTypes = ReactNodeTypes_1;

    function getHostComponentFromComposite$2(inst) {
      var type;

      while ((type = inst._renderedNodeType) === ReactNodeTypes.COMPOSITE) {
        inst = inst._renderedComponent;
      }

      if (type === ReactNodeTypes.HOST) {
        return inst._renderedComponent;
      } else if (type === ReactNodeTypes.EMPTY) {
        return null;
      }
    }

    var getHostComponentFromComposite_1 = getHostComponentFromComposite$2;

    var _prodInvariant$25 = reactProdInvariant_1$2;

    var ReactCurrentOwner$6 = ReactCurrentOwner_1;
    var ReactDOMComponentTree$14 = ReactDOMComponentTree_1;
    var ReactInstanceMap$3 = ReactInstanceMap_1;

    var getHostComponentFromComposite$1 = getHostComponentFromComposite_1;
    var invariant$29 = invariant_1;
    var warning$20 = warning_1;

    /**
     * Copyright 2016-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    var _prodInvariant$27 = require('./reactProdInvariant');

    var ReactCurrentOwner$7 = require('./ReactCurrentOwner');

    var invariant$31 = require('fbjs/lib/invariant');
    var warning$22 = require('fbjs/lib/warning');

    function isNative(fn) {
      // Based on isNative() from Lodash
      var funcToString = Function.prototype.toString;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var reIsNative = RegExp('^' + funcToString
      // Take an example native function source for comparison
      .call(hasOwnProperty)
      // Strip regex characters so we can use it for regex
      .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
      // Remove hasOwnProperty from the template to make it generic
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
      try {
        var source = funcToString.call(fn);
        return reIsNative.test(source);
      } catch (err) {
        return false;
      }
    }

    var canUseCollections =
    // Array.from
    typeof Array.from === 'function' &&
    // Map
    typeof Map === 'function' && isNative(Map) &&
    // Map.prototype.keys
    Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) &&
    // Set
    typeof Set === 'function' && isNative(Set) &&
    // Set.prototype.keys
    Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);

    var setItem;
    var getItem;
    var removeItem;
    var getItemIDs;
    var addRoot;
    var removeRoot;
    var getRootIDs;

    if (canUseCollections) {
      var itemMap = new Map();
      var rootIDSet = new Set();

      setItem = function setItem(id, item) {
        itemMap.set(id, item);
      };
      getItem = function getItem(id) {
        return itemMap.get(id);
      };
      removeItem = function removeItem(id) {
        itemMap['delete'](id);
      };
      getItemIDs = function getItemIDs() {
        return Array.from(itemMap.keys());
      };

      addRoot = function addRoot(id) {
        rootIDSet.add(id);
      };
      removeRoot = function removeRoot(id) {
        rootIDSet['delete'](id);
      };
      getRootIDs = function getRootIDs() {
        return Array.from(rootIDSet.keys());
      };
    } else {
      var itemByKey = {};
      var rootByKey = {};

      // Use non-numeric keys to prevent V8 performance issues:
      // https://github.com/facebook/react/pull/7232
      var getKeyFromID = function getKeyFromID(id) {
        return '.' + id;
      };
      var getIDFromKey = function getIDFromKey(key) {
        return parseInt(key.substr(1), 10);
      };

      setItem = function setItem(id, item) {
        var key = getKeyFromID(id);
        itemByKey[key] = item;
      };
      getItem = function getItem(id) {
        var key = getKeyFromID(id);
        return itemByKey[key];
      };
      removeItem = function removeItem(id) {
        var key = getKeyFromID(id);
        delete itemByKey[key];
      };
      getItemIDs = function getItemIDs() {
        return Object.keys(itemByKey).map(getIDFromKey);
      };

      addRoot = function addRoot(id) {
        var key = getKeyFromID(id);
        rootByKey[key] = true;
      };
      removeRoot = function removeRoot(id) {
        var key = getKeyFromID(id);
        delete rootByKey[key];
      };
      getRootIDs = function getRootIDs() {
        return Object.keys(rootByKey).map(getIDFromKey);
      };
    }

    var unmountedIDs = [];

    function purgeDeep(id) {
      var item = getItem(id);
      if (item) {
        var childIDs = item.childIDs;

        removeItem(id);
        childIDs.forEach(purgeDeep);
      }
    }

    function describeComponentFrame(name, source, ownerName) {
      return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
    }

    function _getDisplayName(element) {
      if (element == null) {
        return '#empty';
      } else if (typeof element === 'string' || typeof element === 'number') {
        return '#text';
      } else if (typeof element.type === 'string') {
        return element.type;
      } else {
        return element.type.displayName || element.type.name || 'Unknown';
      }
    }

    function describeID(id) {
      var name = ReactComponentTreeHook$3.getDisplayName(id);
      var element = ReactComponentTreeHook$3.getElement(id);
      var ownerID = ReactComponentTreeHook$3.getOwnerID(id);
      var ownerName;
      if (ownerID) {
        ownerName = ReactComponentTreeHook$3.getDisplayName(ownerID);
      }
      process.env.NODE_ENV !== 'production' ? warning$22(element, 'ReactComponentTreeHook: Missing React element for debugID %s when ' + 'building stack', id) : void 0;
      return describeComponentFrame(name, element && element._source, ownerName);
    }

    var ReactComponentTreeHook$3 = {
      onSetChildren: function onSetChildren(id, nextChildIDs) {
        var item = getItem(id);
        !item ? process.env.NODE_ENV !== 'production' ? invariant$31(false, 'Item must have been set') : _prodInvariant$27('144') : void 0;
        item.childIDs = nextChildIDs;

        for (var i = 0; i < nextChildIDs.length; i++) {
          var nextChildID = nextChildIDs[i];
          var nextChild = getItem(nextChildID);
          !nextChild ? process.env.NODE_ENV !== 'production' ? invariant$31(false, 'Expected hook events to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant$27('140') : void 0;
          !(nextChild.childIDs != null || _typeof(nextChild.element) !== 'object' || nextChild.element == null) ? process.env.NODE_ENV !== 'production' ? invariant$31(false, 'Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren().') : _prodInvariant$27('141') : void 0;
          !nextChild.isMounted ? process.env.NODE_ENV !== 'production' ? invariant$31(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant$27('71') : void 0;
          if (nextChild.parentID == null) {
            nextChild.parentID = id;
            // TODO: This shouldn't be necessary but mounting a new root during in
            // componentWillMount currently causes not-yet-mounted components to
            // be purged from our tree data so their parent id is missing.
          }
          !(nextChild.parentID === id) ? process.env.NODE_ENV !== 'production' ? invariant$31(false, 'Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : _prodInvariant$27('142', nextChildID, nextChild.parentID, id) : void 0;
        }
      },
      onBeforeMountComponent: function onBeforeMountComponent(id, element, parentID) {
        var item = {
          element: element,
          parentID: parentID,
          text: null,
          childIDs: [],
          isMounted: false,
          updateCount: 0
        };
        setItem(id, item);
      },
      onBeforeUpdateComponent: function onBeforeUpdateComponent(id, element) {
        var item = getItem(id);
        if (!item || !item.isMounted) {
          // We may end up here as a result of setState() in componentWillUnmount().
          // In this case, ignore the element.
          return;
        }
        item.element = element;
      },
      onMountComponent: function onMountComponent(id) {
        var item = getItem(id);
        !item ? process.env.NODE_ENV !== 'production' ? invariant$31(false, 'Item must have been set') : _prodInvariant$27('144') : void 0;
        item.isMounted = true;
        var isRoot = item.parentID === 0;
        if (isRoot) {
          addRoot(id);
        }
      },
      onUpdateComponent: function onUpdateComponent(id) {
        var item = getItem(id);
        if (!item || !item.isMounted) {
          // We may end up here as a result of setState() in componentWillUnmount().
          // In this case, ignore the element.
          return;
        }
        item.updateCount++;
      },
      onUnmountComponent: function onUnmountComponent(id) {
        var item = getItem(id);
        if (item) {
          // We need to check if it exists.
          // `item` might not exist if it is inside an error boundary, and a sibling
          // error boundary child threw while mounting. Then this instance never
          // got a chance to mount, but it still gets an unmounting event during
          // the error boundary cleanup.
          item.isMounted = false;
          var isRoot = item.parentID === 0;
          if (isRoot) {
            removeRoot(id);
          }
        }
        unmountedIDs.push(id);
      },
      purgeUnmountedComponents: function purgeUnmountedComponents() {
        if (ReactComponentTreeHook$3._preventPurging) {
          // Should only be used for testing.
          return;
        }

        for (var i = 0; i < unmountedIDs.length; i++) {
          var id = unmountedIDs[i];
          purgeDeep(id);
        }
        unmountedIDs.length = 0;
      },
      isMounted: function isMounted(id) {
        var item = getItem(id);
        return item ? item.isMounted : false;
      },
      getCurrentStackAddendum: function getCurrentStackAddendum(topElement) {
        var info = '';
        if (topElement) {
          var name = _getDisplayName(topElement);
          var owner = topElement._owner;
          info += describeComponentFrame(name, topElement._source, owner && owner.getName());
        }

        var currentOwner = ReactCurrentOwner$7.current;
        var id = currentOwner && currentOwner._debugID;

        info += ReactComponentTreeHook$3.getStackAddendumByID(id);
        return info;
      },
      getStackAddendumByID: function getStackAddendumByID(id) {
        var info = '';
        while (id) {
          info += describeID(id);
          id = ReactComponentTreeHook$3.getParentID(id);
        }
        return info;
      },
      getChildIDs: function getChildIDs(id) {
        var item = getItem(id);
        return item ? item.childIDs : [];
      },
      getDisplayName: function getDisplayName(id) {
        var element = ReactComponentTreeHook$3.getElement(id);
        if (!element) {
          return null;
        }
        return _getDisplayName(element);
      },
      getElement: function getElement(id) {
        var item = getItem(id);
        return item ? item.element : null;
      },
      getOwnerID: function getOwnerID(id) {
        var element = ReactComponentTreeHook$3.getElement(id);
        if (!element || !element._owner) {
          return null;
        }
        return element._owner._debugID;
      },
      getParentID: function getParentID(id) {
        var item = getItem(id);
        return item ? item.parentID : null;
      },
      getSource: function getSource(id) {
        var item = getItem(id);
        var element = item ? item.element : null;
        var source = element != null ? element._source : null;
        return source;
      },
      getText: function getText(id) {
        var element = ReactComponentTreeHook$3.getElement(id);
        if (typeof element === 'string') {
          return element;
        } else if (typeof element === 'number') {
          return '' + element;
        } else {
          return null;
        }
      },
      getUpdateCount: function getUpdateCount(id) {
        var item = getItem(id);
        return item ? item.updateCount : 0;
      },

      getRootIDs: getRootIDs,
      getRegisteredIDs: getItemIDs
    };

    module.exports = ReactComponentTreeHook$3;



    var ReactComponentTreeHook$4 = Object.freeze({

    });

    var require$$1$18 = ( ReactComponentTreeHook$4 && ReactComponentTreeHook$4['default'] ) || ReactComponentTreeHook$4;

    var DOMProperty$6 = DOMProperty_1;
    var EventPluginRegistry$4 = EventPluginRegistry_1;
    var ReactComponentTreeHook$2 = require$$1$18;

    var warning$21 = warning_1;

    var warnUnknownProperties = function warnUnknownProperties(debugID, element) {
      var unknownProps = [];
      for (var key in element.props) {
        var isValid = validateProperty(element.type, key, debugID);
        if (!isValid) {
          unknownProps.push(key);
        }
      }

      var unknownPropString = unknownProps.map(function (prop) {
        return '`' + prop + '`';
      }).join(', ');

      if (unknownProps.length === 1) {
        process.env.NODE_ENV !== 'production' ? warning$21(false, 'Unknown prop %s on <%s> tag. Remove this prop from the element. ' + 'For details, see https://fb.me/react-unknown-prop%s', unknownPropString, element.type, ReactComponentTreeHook$2.getStackAddendumByID(debugID)) : void 0;
      } else if (unknownProps.length > 1) {
        process.env.NODE_ENV !== 'production' ? warning$21(false, 'Unknown props %s on <%s> tag. Remove these props from the element. ' + 'For details, see https://fb.me/react-unknown-prop%s', unknownPropString, element.type, ReactComponentTreeHook$2.getStackAddendumByID(debugID)) : void 0;
      }
    };

    function handleElement(debugID, element) {
      if (element == null || typeof element.type !== 'string') {
        return;
      }
      if (element.type.indexOf('-') >= 0 || element.props.is) {
        return;
      }
      warnUnknownProperties(debugID, element);
    }

    var ReactDOMUnknownPropertyHook$1 = {
      onBeforeMountComponent: function onBeforeMountComponent(debugID, element) {
        handleElement(debugID, element);
      },
      onBeforeUpdateComponent: function onBeforeUpdateComponent(debugID, element) {
        handleElement(debugID, element);
      }
    };

    var ReactDOMUnknownPropertyHook_1 = ReactDOMUnknownPropertyHook$1;

    var ReactComponentTreeHook$5 = require$$1$18;

    var warning$23 = warning_1;

    var didWarnValueNull = false;

    function handleElement$1(debugID, element) {
      if (element == null) {
        return;
      }
      if (element.type !== 'input' && element.type !== 'textarea' && element.type !== 'select') {
        return;
      }
      if (element.props != null && element.props.value === null && !didWarnValueNull) {
        process.env.NODE_ENV !== 'production' ? warning$23(false, '`value` prop on `%s` should not be null. ' + 'Consider using the empty string to clear the component or `undefined` ' + 'for uncontrolled components.%s', element.type, ReactComponentTreeHook$5.getStackAddendumByID(debugID)) : void 0;

        didWarnValueNull = true;
      }
    }

    var ReactDOMNullInputValuePropHook$1 = {
      onBeforeMountComponent: function onBeforeMountComponent(debugID, element) {
        handleElement$1(debugID, element);
      },
      onBeforeUpdateComponent: function onBeforeUpdateComponent(debugID, element) {
        handleElement$1(debugID, element);
      }
    };

    var ReactDOMNullInputValuePropHook_1 = ReactDOMNullInputValuePropHook$1;

    var DOMProperty$7 = DOMProperty_1;
    var ReactComponentTreeHook$6 = require$$1$18;

    var warning$24 = warning_1;

    var warnedProperties$1 = {};
    var rARIA = new RegExp('^(aria)-[' + DOMProperty$7.ATTRIBUTE_NAME_CHAR + ']*$');

    function validateProperty$1(tagName, name, debugID) {
      if (warnedProperties$1.hasOwnProperty(name) && warnedProperties$1[name]) {
        return true;
      }

      if (rARIA.test(name)) {
        var lowerCasedName = name.toLowerCase();
        var standardName = DOMProperty$7.getPossibleStandardName.hasOwnProperty(lowerCasedName) ? DOMProperty$7.getPossibleStandardName[lowerCasedName] : null;

        // If this is an aria-* attribute, but is not listed in the known DOM
        // DOM properties, then it is an invalid aria-* attribute.
        if (standardName == null) {
          warnedProperties$1[name] = true;
          return false;
        }
        // aria-* attributes should be lowercase; suggest the lowercase version.
        if (name !== standardName) {
          process.env.NODE_ENV !== 'production' ? warning$24(false, 'Unknown ARIA attribute %s. Did you mean %s?%s', name, standardName, ReactComponentTreeHook$6.getStackAddendumByID(debugID)) : void 0;
          warnedProperties$1[name] = true;
          return true;
        }
      }

      return true;
    }

    function warnInvalidARIAProps(debugID, element) {
      var invalidProps = [];

      for (var key in element.props) {
        var isValid = validateProperty$1(element.type, key, debugID);
        if (!isValid) {
          invalidProps.push(key);
        }
      }

      var unknownPropString = invalidProps.map(function (prop) {
        return '`' + prop + '`';
      }).join(', ');

      if (invalidProps.length === 1) {
        process.env.NODE_ENV !== 'production' ? warning$24(false, 'Invalid aria prop %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop%s', unknownPropString, element.type, ReactComponentTreeHook$6.getStackAddendumByID(debugID)) : void 0;
      } else if (invalidProps.length > 1) {
        process.env.NODE_ENV !== 'production' ? warning$24(false, 'Invalid aria props %s on <%s> tag. ' + 'For details, see https://fb.me/invalid-aria-prop%s', unknownPropString, element.type, ReactComponentTreeHook$6.getStackAddendumByID(debugID)) : void 0;
      }
    }

    function handleElement$2(debugID, element) {
      if (element == null || typeof element.type !== 'string') {
        return;
      }
      if (element.type.indexOf('-') >= 0 || element.props.is) {
        return;
      }

      warnInvalidARIAProps(debugID, element);
    }

    var ReactDOMInvalidARIAHook$1 = {
      onBeforeMountComponent: function onBeforeMountComponent(debugID, element) {
        if (process.env.NODE_ENV !== 'production') {
          handleElement$2(debugID, element);
        }
      },
      onBeforeUpdateComponent: function onBeforeUpdateComponent(debugID, element) {
        if (process.env.NODE_ENV !== 'production') {
          handleElement$2(debugID, element);
        }
      }
    };

    var ReactDOMInvalidARIAHook_1 = ReactDOMInvalidARIAHook$1;

    var ReactDOMComponentTree = ReactDOMComponentTree_1;
    var ReactDefaultInjection = ReactDefaultInjection$1;
    var ReactMount = ReactMount_1;
    var ReactReconciler = ReactReconciler_1;
    var getHostComponentFromComposite = getHostComponentFromComposite_1;
    var warning$9 = warning_1;

    ReactDefaultInjection.inject();

    // Inject the runtime into a devtools global hook regardless of browser.
    // Allows for debugging when the hook is injected on the page.
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
        ComponentTree: {
          getClosestInstanceFromNode: ReactDOMComponentTree.getClosestInstanceFromNode,
          getNodeFromInstance: function getNodeFromInstance(inst) {
            // inst is an internal instance (but could be a composite)
            if (inst._renderedComponent) {
              inst = getHostComponentFromComposite(inst);
            }
            if (inst) {
              return ReactDOMComponentTree.getNodeFromInstance(inst);
            } else {
              return null;
            }
          }
        },
        Mount: ReactMount,
        Reconciler: ReactReconciler
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      var ExecutionEnvironment = ExecutionEnvironment_1;
      if (ExecutionEnvironment.canUseDOM && window.top === window.self) {

        // First check if devtools is not installed
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
          // If we're in Chrome or Firefox, provide a download link if not installed.
          if (navigator.userAgent.indexOf('Chrome') > -1 && navigator.userAgent.indexOf('Edge') === -1 || navigator.userAgent.indexOf('Firefox') > -1) {
            // Firefox does not have the issue with devtools loaded over file://
            var showFileUrlMessage = window.location.protocol.indexOf('http') === -1 && navigator.userAgent.indexOf('Firefox') === -1;
            console.debug('Download the React DevTools ' + (showFileUrlMessage ? 'and use an HTTP server (instead of a file: URL) ' : '') + 'for a better development experience: ' + 'https://fb.me/react-devtools');
          }
        }

        var testFunc = function testFn() {};
        process.env.NODE_ENV !== 'production' ? warning$9((testFunc.name || testFunc.toString()).indexOf('testFn') !== -1, 'It looks like you\'re using a minified copy of the development build ' + 'of React. When deploying React apps to production, make sure to use ' + 'the production build which skips development warnings and is faster. ' + 'See https://fb.me/react-minification for more details.') : void 0;

        // If we're in IE8, check to see if we are in compatibility mode and provide
        // information on preventing compatibility mode
        var ieCompatibilityMode = document.documentMode && document.documentMode < 8;

        process.env.NODE_ENV !== 'production' ? warning$9(!ieCompatibilityMode, 'Internet Explorer is running in compatibility mode; please add the ' + 'following tag to your HTML to prevent this from happening: ' + '<meta http-equiv="X-UA-Compatible" content="IE=edge" />') : void 0;

        var expectedFeatures = [
        // shims
        Array.isArray, Array.prototype.every, Array.prototype.forEach, Array.prototype.indexOf, Array.prototype.map, Date.now, Function.prototype.bind, Object.keys, String.prototype.trim];

        for (var i = 0; i < expectedFeatures.length; i++) {
          if (!expectedFeatures[i]) {
            process.env.NODE_ENV !== 'production' ? warning$9(false, 'One or more ES5 shims expected by React are not available: ' + 'https://fb.me/react-warning-polyfills') : void 0;
            break;
          }
        }
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      var ReactInstrumentation = ReactInstrumentation$2;
      var ReactDOMUnknownPropertyHook = ReactDOMUnknownPropertyHook_1;
      var ReactDOMNullInputValuePropHook = ReactDOMNullInputValuePropHook_1;
      var ReactDOMInvalidARIAHook = ReactDOMInvalidARIAHook_1;

      ReactInstrumentation.debugTool.addHook(ReactDOMUnknownPropertyHook);
      ReactInstrumentation.debugTool.addHook(ReactDOMNullInputValuePropHook);
      ReactInstrumentation.debugTool.addHook(ReactDOMInvalidARIAHook);
    }

    // AUI includes underscore and exposes it globally.
    var _ = window._;
    // export default {
    //   isString: function (arg) {
    //     return (typeof(arg) === 'string');
    //   }
    // }

    var domain;

    // This constructor is used to store event handlers. Instantiating this is
    // faster than explicitly calling `Object.create(null)` to get a "clean" empty
    // object (tested with v8 v4.9).
    function EventHandlers() {}
    EventHandlers.prototype = Object.create(null);

    function EventEmitter() {
      EventEmitter.init.call(this);
    }
    EventEmitter.usingDomains = false;

    EventEmitter.prototype.domain = undefined;
    EventEmitter.prototype._events = undefined;
    EventEmitter.prototype._maxListeners = undefined;

    // By default EventEmitters will print a warning if more than 10 listeners are
    // added to it. This is a useful default which helps finding memory leaks.
    EventEmitter.defaultMaxListeners = 10;

    EventEmitter.init = function () {
      this.domain = null;
      if (EventEmitter.usingDomains) {
        // if there is an active domain, then attach to it.
        if (domain.active && !(this instanceof domain.Domain)) {
          this.domain = domain.active;
        }
      }

      if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
        this._events = new EventHandlers();
        this._eventsCount = 0;
      }

      this._maxListeners = this._maxListeners || undefined;
    };

    // Obviously not all Emitters should be limited to 10. This function allows
    // that to be increased. Set to zero for unlimited.
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== 'number' || n < 0 || isNaN(n)) throw new TypeError('"n" argument must be a positive number');
      this._maxListeners = n;
      return this;
    };

    function $getMaxListeners(that) {
      if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
      return that._maxListeners;
    }

    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return $getMaxListeners(this);
    };

    // These standalone emit* functions are used to optimize calling of event
    // handlers for fast cases because emit() itself often has a variable number of
    // arguments and can be deoptimized because of that. These functions always have
    // the same number of arguments and thus do not get deoptimized, so the code
    // inside them can execute faster.
    function emitNone(handler, isFn, self) {
      if (isFn) handler.call(self);else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i) {
          listeners[i].call(self);
        }
      }
    }
    function emitOne(handler, isFn, self, arg1) {
      if (isFn) handler.call(self, arg1);else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i) {
          listeners[i].call(self, arg1);
        }
      }
    }
    function emitTwo(handler, isFn, self, arg1, arg2) {
      if (isFn) handler.call(self, arg1, arg2);else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i) {
          listeners[i].call(self, arg1, arg2);
        }
      }
    }
    function emitThree(handler, isFn, self, arg1, arg2, arg3) {
      if (isFn) handler.call(self, arg1, arg2, arg3);else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i) {
          listeners[i].call(self, arg1, arg2, arg3);
        }
      }
    }

    function emitMany(handler, isFn, self, args) {
      if (isFn) handler.apply(self, args);else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i) {
          listeners[i].apply(self, args);
        }
      }
    }

    EventEmitter.prototype.emit = function emit(type) {
      var er, handler, len, args, i, events, domain;
      var needDomainExit = false;
      var doError = type === 'error';

      events = this._events;
      if (events) doError = doError && events.error == null;else if (!doError) return false;

      domain = this.domain;

      // If there is no 'error' event listener then throw.
      if (doError) {
        er = arguments[1];
        if (domain) {
          if (!er) er = new Error('Uncaught, unspecified "error" event');
          er.domainEmitter = this;
          er.domain = domain;
          er.domainThrown = false;
          domain.emit('error', er);
        } else if (er instanceof Error) {
          throw er; // Unhandled 'error' event
        } else {
          // At least give some kind of context to the user
          var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
          err.context = er;
          throw err;
        }
        return false;
      }

      handler = events[type];

      if (!handler) return false;

      var isFn = typeof handler === 'function';
      len = arguments.length;
      switch (len) {
        // fast cases
        case 1:
          emitNone(handler, isFn, this);
          break;
        case 2:
          emitOne(handler, isFn, this, arguments[1]);
          break;
        case 3:
          emitTwo(handler, isFn, this, arguments[1], arguments[2]);
          break;
        case 4:
          emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
          break;
        // slower
        default:
          args = new Array(len - 1);
          for (i = 1; i < len; i++) {
            args[i - 1] = arguments[i];
          }emitMany(handler, isFn, this, args);
      }

      if (needDomainExit) domain.exit();

      return true;
    };

    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;

      if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');

      events = target._events;
      if (!events) {
        events = target._events = new EventHandlers();
        target._eventsCount = 0;
      } else {
        // To avoid recursion in the case that type === "newListener"! Before
        // adding it to the listeners, first emit "newListener".
        if (events.newListener) {
          target.emit('newListener', type, listener.listener ? listener.listener : listener);

          // Re-assign `events` because a newListener handler could have caused the
          // this._events to be assigned to a new object
          events = target._events;
        }
        existing = events[type];
      }

      if (!existing) {
        // Optimize the case of one listener. Don't need the extra array object.
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === 'function') {
          // Adding the second element, need to change to array.
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
        } else {
          // If we've already got an array, just append.
          if (prepend) {
            existing.unshift(listener);
          } else {
            existing.push(listener);
          }
        }

        // Check for listener leak
        if (!existing.warned) {
          m = $getMaxListeners(target);
          if (m && m > 0 && existing.length > m) {
            existing.warned = true;
            var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + type + ' listeners added. ' + 'Use emitter.setMaxListeners() to increase limit');
            w.name = 'MaxListenersExceededWarning';
            w.emitter = target;
            w.type = type;
            w.count = existing.length;
            emitWarning(w);
          }
        }
      }

      return target;
    }
    function emitWarning(e) {
      typeof console.warn === 'function' ? console.warn(e) : console.log(e);
    }
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };

    EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    EventEmitter.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

    function _onceWrap(target, type, listener) {
      var fired = false;
      function g() {
        target.removeListener(type, g);
        if (!fired) {
          fired = true;
          listener.apply(target, arguments);
        }
      }
      g.listener = listener;
      return g;
    }

    EventEmitter.prototype.once = function once(type, listener) {
      if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };

    EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

    // emits a 'removeListener' event iff the listener was removed
    EventEmitter.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events) return this;

      list = events[type];
      if (!list) return this;

      if (list === listener || list.listener && list.listener === listener) {
        if (--this._eventsCount === 0) this._events = new EventHandlers();else {
          delete events[type];
          if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length; i-- > 0;) {
          if (list[i] === listener || list[i].listener && list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0) return this;

        if (list.length === 1) {
          list[0] = undefined;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }

        if (events.removeListener) this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

    EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events;

      events = this._events;
      if (!events) return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0) this._events = new EventHandlers();else delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        for (var i = 0, key; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        do {
          this.removeListener(type, listeners[listeners.length - 1]);
        } while (listeners[0]);
      }

      return this;
    };

    EventEmitter.prototype.listeners = function listeners(type) {
      var evlistener;
      var ret;
      var events = this._events;

      if (!events) ret = [];else {
        evlistener = events[type];
        if (!evlistener) ret = [];else if (typeof evlistener === 'function') ret = [evlistener.listener || evlistener];else ret = unwrapListeners(evlistener);
      }

      return ret;
    };

    EventEmitter.listenerCount = function (emitter, type) {
      if (typeof emitter.listenerCount === 'function') {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };

    EventEmitter.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;

      if (events) {
        var evlistener = events[type];

        if (typeof evlistener === 'function') {
          return 1;
        } else if (evlistener) {
          return evlistener.length;
        }
      }

      return 0;
    }

    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
    };

    // About 1.5x faster than the two-arg version of Array#splice().
    function spliceOne(list, index) {
      for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
        list[i] = list[k];
      }list.pop();
    }

    function arrayClone(arr, i) {
      var copy = new Array(i);
      while (i--) {
        copy[i] = arr[i];
      }return copy;
    }

    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }

    /**
    * pub/sub for extension state (created, destroyed, initialized)
    * taken from hipchat webcore
    **/
    var EventDispatcher = function (_EventEmitter) {
      inherits(EventDispatcher, _EventEmitter);

      function EventDispatcher() {
        classCallCheck(this, EventDispatcher);

        var _this = possibleConstructorReturn(this, (EventDispatcher.__proto__ || Object.getPrototypeOf(EventDispatcher)).call(this));

        _this.setMaxListeners(20);
        return _this;
      }

      createClass$1(EventDispatcher, [{
        key: 'dispatch',
        value: function dispatch(action) {
          for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          this.emit.apply(this, ['before:' + action].concat(args));
          this.emit.apply(this, arguments);
          this.emit.apply(this, ['after:' + action].concat(args));
        }
      }, {
        key: 'registerOnce',
        value: function registerOnce(action, callback) {
          var _this2 = this;

          if (_.isString(action)) {
            this.once(action, callback);
          } else if (_.isObject(action)) {
            _.keys(action).forEach(function (val, key) {
              _this2.once(key, val);
            }, this);
          }
        }
      }, {
        key: 'register',
        value: function register(action, callback) {
          var _this3 = this;

          if (_.isString(action)) {
            this.on(action, callback);
          } else if (_.isObject(action)) {
            _.keys(action).forEach(function (val, key) {
              _this3.on(key, val);
            }, this);
          }
        }
      }, {
        key: 'unregister',
        value: function unregister(action, callback) {
          var _this4 = this;

          if (_.isString(action)) {
            this.removeListener(action, callback);
          } else if (_.isObject(action)) {
            _.keys(action).forEach(function (val, key) {
              _this4.removeListener(key, val);
            }, this);
          }
        }
      }]);
      return EventDispatcher;
    }(EventEmitter);

    var EventDispatcher$1 = new EventDispatcher();

    var EVENT_NAME_PREFIX = 'connect.addon.';

    /**
     * Timings beyond 20 seconds (connect's load timeout) will be clipped to an X.
     * @const
     * @type {int}
     */
    var LOADING_TIME_THRESHOLD = 20000;

    /**
     * Trim extra zeros from the load time.
     * @const
     * @type {int}
     */
    var LOADING_TIME_TRIMP_PRECISION = 100;

    var AnalyticsDispatcher = function () {
      function AnalyticsDispatcher() {
        classCallCheck(this, AnalyticsDispatcher);

        this._addons = {};
      }

      createClass$1(AnalyticsDispatcher, [{
        key: '_track',
        value: function _track(name, data) {
          var w = window;
          var prefixedName = EVENT_NAME_PREFIX + name;
          data = data || {};
          data.version = w._AP.version;
          data.userAgent = w.navigator.userAgent;

          if (w.AJS && w.AJS.Analytics) {
            w.AJS.Analytics.triggerPrivacyPolicySafeEvent(prefixedName, data);
          } else if (w.AJS && w.AJS.trigger) {
            // BTF fallback
            AJS.trigger('analyticsEvent', {
              name: prefixedName,
              data: data
            });
          } else {
            return false;
          }
          return true;
        }
      }, {
        key: '_time',
        value: function _time() {
          return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        }
      }, {
        key: 'trackLoadingStarted',
        value: function trackLoadingStarted(extension) {
          extension.startLoading = this._time();
          this._addons[extension.id] = extension;
        }
      }, {
        key: 'trackLoadingEnded',
        value: function trackLoadingEnded(extension) {
          var value = this._time() - this._addons[extension.id].startLoading;
          this._track('iframe.performance.load', {
            addonKey: extension.addon_key,
            moduleKey: extension.key,
            value: value > LOADING_TIME_THRESHOLD ? 'x' : Math.ceil(value / LOADING_TIME_TRIMP_PRECISION)
          });
        }
      }, {
        key: 'trackLoadingTimeout',
        value: function trackLoadingTimeout(extension) {
          this._track('iframe.performance.timeout', {
            addonKey: extension.addon_key,
            moduleKey: extension.key
          });
          //track an end event during a timeout so we always have complete start / end data.
          this.trackLoadingEnded(extension);
        }
      }, {
        key: 'trackLoadingCancel',
        value: function trackLoadingCancel(extension) {
          this._track('iframe.performance.cancel', {
            addonKey: extension.addon_key,
            moduleKey: extension.key
          });
        }
      }, {
        key: 'trackUseOfDeprecatedMethod',
        value: function trackUseOfDeprecatedMethod(methodUsed, extension) {
          this._track('jsapi.deprecated', {
            addonKey: extension.addon_key,
            moduleKey: extension.key,
            methodUsed: methodUsed
          });
        }
      }, {
        key: 'dispatch',
        value: function dispatch(name, data) {
          this._track(name, data);
        }
      }]);
      return AnalyticsDispatcher;
    }();

    var analytics = new AnalyticsDispatcher();
    EventDispatcher$1.register('iframe-create', function (data) {
      analytics.trackLoadingStarted(data.extension);
    });
    EventDispatcher$1.register('iframe-bridge-established', function (data) {
      analytics.trackLoadingEnded(data.extension);
    });
    EventDispatcher$1.register('iframe-bridge-timeout', function (data) {
      analytics.trackLoadingTimeout(data.extension);
    });
    EventDispatcher$1.register('iframe-bridge-cancelled', function (data) {
      analytics.trackLoadingCancel(data.extension);
    });
    EventDispatcher$1.register('analytics-deprecated-method-used', function (data) {
      analytics.trackUseOfDeprecatedMethod(data.methodUsed, data.extension);
    });

    var LoadingIndicatorActions = {
      timeout: function timeout($el, extension) {
        EventDispatcher$1.dispatch('iframe-bridge-timeout', { $el: $el, extension: extension });
      },
      cancelled: function cancelled($el, extension) {
        EventDispatcher$1.dispatch('iframe-bridge-cancelled', { $el: $el, extension: extension });
      }
    };

    /**
     * The iframe-side code exposes a jquery-like implementation via _dollar.
     * This runs on the product side to provide AJS.$ under a _dollar module to provide a consistent interface
     * to code that runs on host and iframe.
     */
    // export default AJS.$;
    var $ = window.$;

    var LOADING_INDICATOR_CLASS = 'ap-status-indicator';

    var LOADING_STATUSES = {
      loading: '<div class="ap-loading"><div class="small-spinner"></div>Loading add-on...</div>',
      'load-timeout': '<div class="ap-load-timeout"><div class="small-spinner"></div>Add-on is not responding. Wait or <a href="#" class="ap-btn-cancel">cancel</a>?</div>',
      'load-error': 'Add-on failed to load.'
    };

    var LOADING_TIMEOUT = 12000;

    var LoadingIndicator = function () {
      function LoadingIndicator() {
        classCallCheck(this, LoadingIndicator);

        this._stateRegistry = {};
      }

      createClass$1(LoadingIndicator, [{
        key: '_loadingContainer',
        value: function _loadingContainer($iframeContainer) {
          return $iframeContainer.find('.' + LOADING_INDICATOR_CLASS);
        }
      }, {
        key: 'render',
        value: function render() {
          var $container = $('<div />').addClass(LOADING_INDICATOR_CLASS);
          $container.append(LOADING_STATUSES.loading);
          this._startSpinner($container);
          return $container;
        }
      }, {
        key: '_startSpinner',
        value: function _startSpinner($container) {
          // TODO: AUI or spin.js broke something. This is bad but ironically matches v3's implementation.
          setTimeout(function () {
            var spinner = $container.find('.small-spinner');
            if (spinner.length && spinner.spin) {
              spinner.spin({ lines: 12, length: 3, width: 2, radius: 3, trail: 60, speed: 1.5, zIndex: 1 });
            }
          }, 10);
        }
      }, {
        key: 'hide',
        value: function hide($iframeContainer, extensionId) {
          clearTimeout(this._stateRegistry[extensionId]);
          delete this._stateRegistry[extensionId];
          this._loadingContainer($iframeContainer).hide();
        }
      }, {
        key: 'cancelled',
        value: function cancelled($iframeContainer, extensionId) {
          var status = LOADING_STATUSES['load-error'];
          this._loadingContainer($iframeContainer).empty().text(status);
        }
      }, {
        key: '_setupTimeout',
        value: function _setupTimeout($container, extension) {
          this._stateRegistry[extension.id] = setTimeout(function () {
            LoadingIndicatorActions.timeout($container, extension);
          }, LOADING_TIMEOUT);
        }
      }, {
        key: 'timeout',
        value: function timeout($iframeContainer, extensionId) {
          var status = $(LOADING_STATUSES['load-timeout']);
          var container = this._loadingContainer($iframeContainer);
          container.empty().append(status);
          this._startSpinner(container);
          $('a.ap-btn-cancel', container).click(function () {
            LoadingIndicatorActions.cancelled($iframeContainer, extensionId);
          });
          delete this._stateRegistry[extensionId];
          return container;
        }
      }]);
      return LoadingIndicator;
    }();

    var LoadingComponent = new LoadingIndicator();

    EventDispatcher$1.register('iframe-create', function (data) {
      LoadingComponent._setupTimeout(data.$el.parents('.ap-iframe-container'), data.extension);
    });

    EventDispatcher$1.register('iframe-bridge-established', function (data) {
      LoadingComponent.hide(data.$el.parents('.ap-iframe-container'), data.extension.id);
    });

    EventDispatcher$1.register('iframe-bridge-timeout', function (data) {
      LoadingComponent.timeout(data.$el, data.extension.id);
    });

    EventDispatcher$1.register('iframe-bridge-cancelled', function (data) {
      LoadingComponent.cancelled(data.$el, data.extension.id);
    });

    var LOG_PREFIX = "[Simple-XDM] ";
    var nativeBind = Function.prototype.bind;
    var util = {
      locationOrigin: function locationOrigin() {
        if (!window.location.origin) {
          return window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        } else {
          return window.location.origin;
        }
      },
      randomString: function randomString() {
        return Math.floor(Math.random() * 1000000000).toString(16);
      },
      isString: function isString(str) {
        return typeof str === "string" || str instanceof String;
      },
      argumentsToArray: function argumentsToArray(arrayLike) {
        return Array.prototype.slice.call(arrayLike);
      },
      argumentNames: function argumentNames(fn) {
        return fn.toString().replace(/((\/\/.*$)|(\/\*[^]*?\*\/))/mg, '') // strip comments
        .replace(/[^(]+\(([^)]*)[^]+/, '$1') // get signature
        .match(/([^\s,]+)/g) || [];
      },
      hasCallback: function hasCallback(args) {
        var length = args.length;
        return length > 0 && typeof args[length - 1] === 'function';
      },
      error: function error(msg) {
        if (window.console && window.console.error) {
          var outputError = [];

          if (typeof msg === "string") {
            outputError.push(LOG_PREFIX + msg);
            outputError = outputError.concat(Array.prototype.slice.call(arguments, 1));
          } else {
            outputError.push(LOG_PREFIX);
            outputError = outputError.concat(Array.prototype.slice.call(arguments));
          }
          window.console.error.apply(null, outputError);
        }
      },
      warn: function warn(msg) {
        if (window.console) {
          console.warn(LOG_PREFIX + msg);
        }
      },
      _bind: function _bind(thisp, fn) {
        if (nativeBind && fn.bind === nativeBind) {
          return fn.bind(thisp);
        }
        return function () {
          return fn.apply(thisp, arguments);
        };
      },
      throttle: function throttle(func, wait, context) {
        var previous = 0;
        return function () {
          var now = Date.now();
          if (now - previous > wait) {
            previous = now;
            func.apply(context, arguments);
          }
        };
      },
      each: function each(list, iteratee) {
        var length;
        var key;
        if (list) {
          length = list.length;
          if (length != null && typeof list !== 'function') {
            key = 0;
            while (key < length) {
              if (iteratee.call(list[key], key, list[key]) === false) {
                break;
              }
              key += 1;
            }
          } else {
            for (key in list) {
              if (list.hasOwnProperty(key)) {
                if (iteratee.call(list[key], key, list[key]) === false) {
                  break;
                }
              }
            }
          }
        }
      },
      extend: function extend(dest) {
        var args = arguments;
        var srcs = [].slice.call(args, 1, args.length);
        srcs.forEach(function (source) {
          if ((typeof source === "undefined" ? "undefined" : _typeof(source)) === "object") {
            Object.getOwnPropertyNames(source).forEach(function (name) {
              dest[name] = source[name];
            });
          }
        });
        return dest;
      },
      sanitizeStructuredClone: function sanitizeStructuredClone(object) {
        var whiteList = [Boolean, String, Date, RegExp, Blob, File, FileList, ArrayBuffer];
        var blackList = [Error, Node];
        var warn = util.warn;
        var visitedObjects = [];

        function _clone(value) {
          if (typeof value === 'function') {
            warn("A function was detected and removed from the message.");
            return null;
          }

          if (blackList.some(function (t) {
            if (value instanceof t) {
              warn(t.name + " object was detected and removed from the message.");
              return true;
            }
            return false;
          })) {
            return {};
          }

          if (value && (typeof value === "undefined" ? "undefined" : _typeof(value)) === 'object' && whiteList.every(function (t) {
            return !(value instanceof t);
          })) {
            if (visitedObjects.indexOf(value) > -1) {
              warn("A circular reference was detected and removed from the message.");
              return null;
            }

            visitedObjects.push(value);

            var newValue = void 0;

            if (Array.isArray(value)) {
              newValue = value.map(function (element) {
                return _clone(element);
              });
            } else {
              newValue = {};
              for (var name in value) {
                if (value.hasOwnProperty(name)) {
                  var clonedValue = _clone(value[name]);
                  if (clonedValue !== null) {
                    newValue[name] = clonedValue;
                  }
                }
              }
            }
            return newValue;
          }
          return value;
        }

        return _clone(object);
      }
    };

    var PostMessage = function () {
      function PostMessage(data) {
        classCallCheck(this, PostMessage);

        var d = data || {};
        this._registerListener(d.listenOn);
      }

      createClass$1(PostMessage, [{
        key: "_registerListener",
        value: function _registerListener(listenOn) {
          if (!listenOn || !listenOn.addEventListener) {
            listenOn = window;
          }
          listenOn.addEventListener("message", util._bind(this, this._receiveMessage), false);
        }
      }, {
        key: "_receiveMessage",
        value: function _receiveMessage(event) {

          var handler = this._messageHandlers[event.data.type],
              extensionId = event.data.eid,
              reg = void 0;

          if (extensionId && this._registeredExtensions) {
            reg = this._registeredExtensions[extensionId];
          }

          if (!handler || !this._checkOrigin(event, reg)) {
            return false;
          }

          handler.call(this, event, reg);
        }
      }]);
      return PostMessage;
    }();

    /**
    * Postmessage format:
    *
    * Initialization
    * --------------
    * {
    *   type: 'init',
    *   eid: 'my-addon__my-module-xyz'  // the extension identifier, unique across iframes
    * }
    *
    * Request
    * -------
    * {
    *   type: 'req',
    *   eid: 'my-addon__my-module-xyz',  // the extension identifier, unique for iframe
    *   mid: 'xyz',  // a unique message identifier, required for callbacks
    *   mod: 'cookie',  // the module name
    *   fn: 'read',  // the method name
    *   args: [arguments]  // the method arguments
    * }
    *
    * Response
    * --------
    * {
    *   type: 'resp'
    *   eid: 'my-addon__my-module-xyz',  // the extension identifier, unique for iframe
    *   mid: 'xyz',  // a unique message identifier, obtained from the request
    *   args: [arguments]  // the callback arguments
    * }
    *
    * Event
    * -----
    * {
    *   type: 'evt',
    *   etyp: 'some-event',
    *   evnt: { ... }  // the event data
    *   mid: 'xyz', // a unique message identifier for the event
    * }
    **/

    var VALID_EVENT_TIME_MS = 30000; //30 seconds

    var XDMRPC = function (_PostMessage) {
      inherits(XDMRPC, _PostMessage);
      createClass$1(XDMRPC, [{
        key: '_padUndefinedArguments',
        value: function _padUndefinedArguments(array, length) {
          return array.length >= length ? array : array.concat(new Array(length - array.length));
        }
      }]);

      function XDMRPC(config) {
        classCallCheck(this, XDMRPC);

        config = config || {};

        var _this = possibleConstructorReturn(this, (XDMRPC.__proto__ || Object.getPrototypeOf(XDMRPC)).call(this, config));

        _this._registeredExtensions = config.extensions || {};
        _this._registeredAPIModules = {};
        _this._pendingCallbacks = {};
        _this._keycodeCallbacks = {};
        _this._pendingEvents = {};
        _this._messageHandlers = {
          init: _this._handleInit,
          req: _this._handleRequest,
          resp: _this._handleResponse,
          event_query: _this._handleEventQuery,
          broadcast: _this._handleBroadcast,
          key_triggered: _this._handleKeyTriggered,
          get_host_offset: _this._getHostOffset,
          unload: _this._handleUnload,
          sub: _this._handleSubInit
        };
        return _this;
      }

      createClass$1(XDMRPC, [{
        key: '_verifyAPI',
        value: function _verifyAPI(event, reg) {
          var untrustedTargets = event.data.targets;
          if (!untrustedTargets) {
            return;
          }
          var trustedSpec = this.getApiSpec();
          var tampered = false;

          function check(trusted, untrusted) {
            Object.getOwnPropertyNames(untrusted).forEach(function (name) {
              if (_typeof(untrusted[name]) === 'object' && trusted[name]) {
                check(trusted[name], untrusted[name]);
              } else {
                if (untrusted[name] === 'parent' && trusted[name]) {
                  tampered = true;
                }
              }
            });
          }
          check(trustedSpec, untrustedTargets);
          event.source.postMessage({
            type: 'api_tamper',
            tampered: tampered
          }, reg.extension.url);
        }
      }, {
        key: '_handleInit',
        value: function _handleInit(event, reg) {
          this._registeredExtensions[reg.extension_id].source = event.source;
          if (reg.initCallback) {
            reg.initCallback(event.data.eid);
            delete reg.initCallback;
          }
          if (event.data.targets) {
            this._verifyAPI(event, reg);
          }
        }
        // postMessage method to do registerExtension

      }, {
        key: '_handleSubInit',
        value: function _handleSubInit(event, reg) {
          this.registerExtension(event.data.ext.id, {
            extension: event.data.ext
          });
        }
      }, {
        key: '_getHostOffset',
        value: function _getHostOffset(event) {
          var hostWindow = event.source;
          var hostFrameOffset = 0;
          while (!this._hasSameOrigin(hostWindow)) {
            // Climb up the iframe tree 1 layer
            hostFrameOffset++;
            hostWindow = hostWindow.parent;
          }
          event.source.postMessage({
            hostFrameOffset: hostFrameOffset
          }, event.origin);
        }
      }, {
        key: '_hasSameOrigin',
        value: function _hasSameOrigin(window) {
          if (window === window.top) {
            return true;
          }

          try {
            // Try set & read a variable on the given window
            // If we can successfully read the value then it means the given window has the same origin
            // as the window that is currently executing the script
            var testVariableName = 'test_var_' + Math.random().toString(16).substr(2);
            window[testVariableName] = true;
            return window[testVariableName];
          } catch (e) {
            // A exception will be thrown if the windows doesn't have the same origin
          }

          return false;
        }
      }, {
        key: '_handleResponse',
        value: function _handleResponse(event) {
          var data = event.data;
          var pendingCallback = this._pendingCallbacks[data.mid];
          if (pendingCallback) {
            delete this._pendingCallbacks[data.mid];
            pendingCallback.apply(window, data.args);
          }
        }
      }, {
        key: 'registerRequestNotifier',
        value: function registerRequestNotifier(cb) {
          this._registeredRequestNotifier = cb;
        }
      }, {
        key: '_handleRequest',
        value: function _handleRequest(event, reg) {
          function sendResponse() {
            var args = util.sanitizeStructuredClone(util.argumentsToArray(arguments));
            event.source.postMessage({
              mid: event.data.mid,
              type: 'presp',
              args: args
            }, reg.extension.url);
          }

          var data = event.data;
          var module = this._registeredAPIModules[data.mod];
          var extension = this.getRegisteredExtensions(reg.extension)[0];
          if (module) {
            var fnName = data.fn;
            if (data._cls) {
              (function () {
                var Cls = module[data._cls];
                var ns = data.mod + '-' + data._cls + '-';
                sendResponse._id = data._id;
                if (fnName === 'constructor') {
                  if (!Cls._construct) {
                    Cls.constructor.prototype._destroy = function () {
                      delete this._context._proxies[ns + this._id];
                    };
                    Cls._construct = function () {
                      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                      }

                      var inst = new (Function.prototype.bind.apply(Cls.constructor, [null].concat(args)))();
                      var callback = args[args.length - 1];
                      inst._id = callback._id;
                      inst._context = callback._context;
                      inst._context._proxies[ns + inst._id] = inst;
                      return inst;
                    };
                  }
                  module = Cls;
                  fnName = '_construct';
                } else {
                  module = extension._proxies[ns + data._id];
                }
              })();
            }
            var method = module[fnName];
            if (method) {
              var methodArgs = data.args;
              var padLength = method.length - 1;
              if (fnName === '_construct') {
                padLength = module.constructor.length - 1;
              }
              sendResponse._context = extension;
              methodArgs = this._padUndefinedArguments(methodArgs, padLength);
              methodArgs.push(sendResponse);
              method.apply(module, methodArgs);

              if (this._registeredRequestNotifier) {
                this._registeredRequestNotifier.call(null, {
                  module: data.mod,
                  fn: data.fn,
                  type: data.type,
                  addon_key: reg.extension.addon_key,
                  key: reg.extension.key,
                  extension_id: reg.extension_id
                });
              }
            }
          }
        }
      }, {
        key: '_handleBroadcast',
        value: function _handleBroadcast(event, reg) {
          var event_data = event.data;
          var targetSpec = function targetSpec(r) {
            return r.extension.addon_key === reg.extension.addon_key && r.extension_id !== reg.extension_id;
          };
          this.dispatch(event_data.etyp, targetSpec, event_data.evnt, null, null);
        }
      }, {
        key: '_handleKeyTriggered',
        value: function _handleKeyTriggered(event, reg) {
          var eventData = event.data;
          var keycodeEntry = this._keycodeKey(eventData.keycode, eventData.modifiers, reg.extension_id);
          var listeners = this._keycodeCallbacks[keycodeEntry];
          if (listeners) {
            listeners.forEach(function (listener) {
              listener.call(null, {
                addon_key: reg.extension.addon_key,
                key: reg.extension.key,
                extension_id: reg.extension_id,
                keycode: eventData.keycode,
                modifiers: eventData.modifiers
              });
            }, this);
          }
        }
      }, {
        key: 'defineAPIModule',
        value: function defineAPIModule(module, moduleName) {
          moduleName = moduleName || '_globals';
          this._registeredAPIModules[moduleName] = util.extend({}, this._registeredAPIModules[moduleName] || {}, module);
          return this._registeredAPIModules;
        }
      }, {
        key: '_fullKey',
        value: function _fullKey(targetSpec) {
          var key = targetSpec.addon_key || 'global';
          if (targetSpec.key) {
            key = key + '@@' + targetSpec.key;
          }

          return key;
        }
      }, {
        key: 'queueEvent',
        value: function queueEvent(type, targetSpec, event, callback) {
          var loaded_frame,
              targets = this._findRegistrations(targetSpec);

          loaded_frame = targets.some(function (target) {
            return target.registered_events !== undefined;
          }, this);

          if (loaded_frame) {
            this.dispatch(type, targetSpec, event, callback);
          } else {
            this._pendingEvents[this._fullKey(targetSpec)] = {
              type: type,
              targetSpec: targetSpec,
              event: event,
              callback: callback,
              time: new Date().getTime(),
              uid: util.randomString()
            };
          }
        }
      }, {
        key: '_handleEventQuery',
        value: function _handleEventQuery(message, extension) {
          var _this2 = this;

          var executed = {};
          var now = new Date().getTime();
          var keys = Object.keys(this._pendingEvents);
          keys.forEach(function (index) {
            var element = _this2._pendingEvents[index];
            var eventIsValid = now - element.time <= VALID_EVENT_TIME_MS;
            var isSameTarget = !element.targetSpec || _this2._findRegistrations(element.targetSpec).length !== 0;

            if (isSameTarget && element.targetSpec.key) {
              isSameTarget = element.targetSpec.addon_key === extension.extension.addon_key && element.targetSpec.key === extension.extension.key;
            }

            if (eventIsValid && isSameTarget) {
              executed[index] = element;
              element.targetSpec = element.targetSpec || {};
              _this2.dispatch(element.type, element.targetSpec, element.event, element.callback, message.source);
            } else if (!eventIsValid) {
              delete _this2._pendingEvents[index];
            }
          });

          this._registeredExtensions[extension.extension_id].registered_events = message.data.args;

          return executed;
        }
      }, {
        key: '_handleUnload',
        value: function _handleUnload(event, reg) {
          delete this._registeredExtensions[reg.extension_id].source;
          if (reg.unloadCallback) {
            reg.unloadCallback(event.data.eid);
          }
        }
      }, {
        key: 'dispatch',
        value: function dispatch(type, targetSpec, event, callback, source) {
          function sendEvent(reg, evnt) {
            if (reg.source) {
              var mid;
              if (callback) {
                mid = util.randomString();
                this._pendingCallbacks[mid] = callback;
              }

              reg.source.postMessage({
                type: 'evt',
                mid: mid,
                etyp: type,
                evnt: evnt
              }, reg.extension.url);
            }
          }

          var registrations = this._findRegistrations(targetSpec || {});
          registrations.forEach(function (reg) {
            if (source && !reg.source) {
              reg.source = source;
            }

            if (reg.source) {
              util._bind(this, sendEvent)(reg, event);
            }
          }, this);
        }
      }, {
        key: '_findRegistrations',
        value: function _findRegistrations(targetSpec) {
          var _this3 = this;

          if (this._registeredExtensions.length === 0) {
            util.error('no registered extensions', this._registeredExtensions);
            return [];
          }
          var keys = Object.getOwnPropertyNames(targetSpec);
          var registrations = Object.getOwnPropertyNames(this._registeredExtensions).map(function (key) {
            return _this3._registeredExtensions[key];
          });

          if (targetSpec instanceof Function) {
            return registrations.filter(targetSpec);
          } else {
            return registrations.filter(function (reg) {
              return keys.every(function (key) {
                return reg.extension[key] === targetSpec[key];
              });
            });
          }
        }
      }, {
        key: 'registerExtension',
        value: function registerExtension(extension_id, data) {
          data._proxies = {};
          data.extension_id = extension_id;
          this._registeredExtensions[extension_id] = data;
        }
      }, {
        key: '_keycodeKey',
        value: function _keycodeKey(key, modifiers, extension_id) {
          var code = key;

          if (modifiers) {
            if (typeof modifiers === "string") {
              modifiers = [modifiers];
            }
            modifiers.sort();
            modifiers.forEach(function (modifier) {
              code += '$$' + modifier;
            }, this);
          }

          return code + '__' + extension_id;
        }
      }, {
        key: 'registerKeyListener',
        value: function registerKeyListener(extension_id, key, modifiers, callback) {
          if (typeof modifiers === "string") {
            modifiers = [modifiers];
          }
          var reg = this._registeredExtensions[extension_id];
          var keycodeEntry = this._keycodeKey(key, modifiers, extension_id);
          if (!this._keycodeCallbacks[keycodeEntry]) {
            this._keycodeCallbacks[keycodeEntry] = [];
            reg.source.postMessage({
              type: 'key_listen',
              keycode: key,
              modifiers: modifiers,
              action: 'add'
            }, reg.extension.url);
          }
          this._keycodeCallbacks[keycodeEntry].push(callback);
        }
      }, {
        key: 'unregisterKeyListener',
        value: function unregisterKeyListener(extension_id, key, modifiers, callback) {
          var keycodeEntry = this._keycodeKey(key, modifiers, extension_id);
          var potentialCallbacks = this._keycodeCallbacks[keycodeEntry];
          var reg = this._registeredExtensions[extension_id];

          if (potentialCallbacks) {
            if (callback) {
              var index = potentialCallbacks.indexOf(callback);
              this._keycodeCallbacks[keycodeEntry].splice(index, 1);
            } else {
              delete this._keycodeCallbacks[keycodeEntry];
            }

            reg.source.postMessage({
              type: 'key_listen',
              keycode: key,
              modifiers: modifiers,
              action: 'remove'
            }, reg.extension.url);
          }
        }
      }, {
        key: 'getApiSpec',
        value: function getApiSpec() {
          var that = this;
          function createModule(moduleName) {
            var module = that._registeredAPIModules[moduleName];
            if (!module) {
              throw new Error("unregistered API module: " + moduleName);
            }
            function getModuleDefinition(mod) {
              return Object.getOwnPropertyNames(mod).reduce(function (accumulator, memberName) {
                var member = mod[memberName];
                switch (typeof member === 'undefined' ? 'undefined' : _typeof(member)) {
                  case 'function':
                    accumulator[memberName] = {
                      args: util.argumentNames(member)
                    };
                    break;
                  case 'object':
                    if (member.hasOwnProperty('constructor')) {
                      accumulator[memberName] = getModuleDefinition(member);
                    }
                    break;
                }

                return accumulator;
              }, {});
            }
            return getModuleDefinition(module);
          }
          return Object.getOwnPropertyNames(this._registeredAPIModules).reduce(function (accumulator, moduleName) {
            accumulator[moduleName] = createModule(moduleName);
            return accumulator;
          }, {});
        }

        // validate origin of postMessage

      }, {
        key: '_checkOrigin',
        value: function _checkOrigin(event, reg) {
          var no_source_types = ['init', 'event_query'];
          var isNoSourceType = reg && !reg.source && no_source_types.indexOf(event.data.type) > -1;
          var sourceTypeMatches = reg && event.source === reg.source;
          var hasExtensionUrl = reg && reg.extension.url.indexOf(event.origin) === 0;
          var isValidOrigin = hasExtensionUrl && (isNoSourceType || sourceTypeMatches);

          // get_host_offset fires before init
          if (event.data.type === 'get_host_offset' && window === window.top) {
            isValidOrigin = true;
          }

          // check undefined for chromium (Issue 395010)
          if (event.data.type === 'unload' && (sourceTypeMatches || event.source === undefined)) {
            isValidOrigin = true;
          }

          if (!isValidOrigin) {
            util.warn("Failed to validate origin: " + event.origin);
          }
          return isValidOrigin;
        }
      }, {
        key: 'getRegisteredExtensions',
        value: function getRegisteredExtensions(filter) {
          if (filter) {
            return this._findRegistrations(filter);
          }
          return this._registeredExtensions;
        }
      }, {
        key: 'unregisterExtension',
        value: function unregisterExtension(filter) {
          var registrations = this._findRegistrations(filter);
          if (registrations.length !== 0) {
            registrations.forEach(function (registration) {
              var _this4 = this;

              var keys = Object.keys(this._pendingEvents);
              keys.forEach(function (index) {
                var element = _this4._pendingEvents[index];
                var targetSpec = element.targetSpec || {};

                if (targetSpec.addon_key === registration.extension.addon_key) {
                  delete _this4._pendingEvents[index];
                }
              });

              delete this._registeredExtensions[registration.extension_id];
            }, this);
          }
        }
      }]);
      return XDMRPC;
    }(PostMessage);

    var Connect = function () {
      function Connect() {
        classCallCheck(this, Connect);

        this._xdm = new XDMRPC();
      }

      /**
       * Send a message to iframes matching the targetSpec. This message is added to
       *  a message queue for delivery to ensure the message is received if an iframe
       *  has not yet loaded
       *
       * @param type The name of the event type
       * @param targetSpec The spec to match against extensions when sending this event
       * @param event The event payload
       * @param callback A callback to be executed when the remote iframe calls its callback
       */


      createClass$1(Connect, [{
        key: 'dispatch',
        value: function dispatch(type, targetSpec, event, callback) {
          this._xdm.queueEvent(type, targetSpec, event, callback);
          return this.getExtensions(targetSpec);
        }

        /**
         * Send a message to iframes matching the targetSpec immediately. This message will
         *  only be sent to iframes that are already open, and will not be delivered if none
         *  are currently open.
         *
         * @param type The name of the event type
         * @param targetSpec The spec to match against extensions when sending this event
         * @param event The event payload
         */

      }, {
        key: 'broadcast',
        value: function broadcast(type, targetSpec, event) {
          this._xdm.dispatch(type, targetSpec, event, null, null);
          return this.getExtensions(targetSpec);
        }
      }, {
        key: '_createId',
        value: function _createId(extension) {
          if (!extension.addon_key || !extension.key) {
            throw Error('Extensions require addon_key and key');
          }
          return extension.addon_key + '__' + extension.key + '__' + util.randomString();
        }
        /**
        * Creates a new iframed module, without actually creating the DOM element.
        * The iframe attributes are passed to the 'setupCallback', which is responsible for creating
        * the DOM element and returning the window reference.
        *
        * @param extension The extension definition. Example:
        *   {
        *     addon_key: 'my-addon',
        *     key: 'my-module',
        *     url: 'https://example.com/my-module',
        *     options: {
        *         autoresize: false,
        *         hostOrigin: 'https://connect-host.example.com/'
        *     }
        *   }
        *
        * @param initCallback The optional initCallback is called when the bridge between host and iframe is established.
        **/

      }, {
        key: 'create',
        value: function create(extension, initCallback) {
          var extension_id = this.registerExtension(extension, initCallback);
          var options = extension.options || {};

          var data = {
            extension_id: extension_id,
            api: this._xdm.getApiSpec(),
            origin: util.locationOrigin(),
            options: options
          };

          return {
            id: extension_id,
            name: JSON.stringify(data),
            src: extension.url
          };
        }
      }, {
        key: 'registerRequestNotifier',
        value: function registerRequestNotifier(callback) {
          this._xdm.registerRequestNotifier(callback);
        }
      }, {
        key: 'registerExtension',
        value: function registerExtension(extension, initCallback, unloadCallback) {
          var extension_id = this._createId(extension);
          this._xdm.registerExtension(extension_id, {
            extension: extension,
            initCallback: initCallback,
            unloadCallback: unloadCallback
          });
          return extension_id;
        }
      }, {
        key: 'registerKeyListener',
        value: function registerKeyListener(extension_id, key, modifiers, callback) {
          this._xdm.registerKeyListener(extension_id, key, modifiers, callback);
        }
      }, {
        key: 'unregisterKeyListener',
        value: function unregisterKeyListener(extension_id, key, modifiers, callback) {
          this._xdm.unregisterKeyListener(extension_id, key, modifiers, callback);
        }
      }, {
        key: 'defineModule',
        value: function defineModule(moduleName, module, options) {
          this._xdm.defineAPIModule(module, moduleName, options);
        }
      }, {
        key: 'defineGlobals',
        value: function defineGlobals(module) {
          this._xdm.defineAPIModule(module);
        }
      }, {
        key: 'getExtensions',
        value: function getExtensions(filter) {
          return this._xdm.getRegisteredExtensions(filter);
        }
      }, {
        key: 'unregisterExtension',
        value: function unregisterExtension(filter) {
          return this._xdm.unregisterExtension(filter);
        }
      }]);
      return Connect;
    }();

    var simpleXDM$1 = new Connect();

    var EventActions = {
      broadcast: function broadcast(type, targetSpec, event) {
        simpleXDM$1.dispatch(type, targetSpec, event);
        EventDispatcher$1.dispatch('event-dispatch', {
          type: type,
          targetSpec: targetSpec,
          event: event
        });
      },

      broadcastPublic: function broadcastPublic(type, event, sender) {
        EventDispatcher$1.dispatch('event-public-dispatch', {
          type: type,
          event: event,
          sender: sender
        });

        simpleXDM$1.dispatch(type, {}, {
          sender: {
            addonKey: sender.addon_key,
            key: sender.key
          },
          event: event
        });
      }
    };

    var events = {
      emit: function emit(name) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var callback = _.last(args);
        args = _.first(args, -1);
        EventActions.broadcast(name, {
          addon_key: callback._context.extension.addon_key
        }, args);
      },

      emitPublic: function emitPublic(name) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        var callback = _.last(args);
        var extension = callback._context.extension;
        args = _.first(args, -1);
        EventActions.broadcastPublic(name, args, extension);
      }
    };

    var DialogExtensionActions = {
      open: function open(extension, options) {
        EventDispatcher$1.dispatch('dialog-extension-open', {
          extension: extension,
          options: options
        });
      },
      close: function close() {
        EventDispatcher$1.dispatch('dialog-close-active', {});
      },
      addUserButton: function addUserButton(options, extension) {
        EventDispatcher$1.dispatch('dialog-button-add', {
          button: {
            text: options.text,
            identifier: options.identifier,
            data: {
              userButton: true
            }
          },
          extension: extension
        });
      }
    };

    var DialogActions = {
      close: function close(data) {
        EventDispatcher$1.dispatch('dialog-close', {
          dialog: data.dialog,
          extension: data.extension,
          customData: data.customData
        });
      },
      closeActive: function closeActive(data) {
        EventDispatcher$1.dispatch('dialog-close-active', data);
      },
      clickButton: function clickButton(identifier, $el, extension) {
        EventDispatcher$1.dispatch('dialog-button-click', {
          identifier: identifier,
          $el: $el,
          extension: extension
        });
      },
      toggleButton: function toggleButton(data) {
        EventDispatcher$1.dispatch('dialog-button-toggle', data);
      },
      toggleButtonVisibility: function toggleButtonVisibility(data) {
        EventDispatcher$1.dispatch('dialog-button-toggle-visibility', data);
      }
    };

    var DomEventActions = {
      registerKeyEvent: function registerKeyEvent(data) {
        simpleXDM$1.registerKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
        EventDispatcher$1.dispatch('dom-event-register', data);
      },
      unregisterKeyEvent: function unregisterKeyEvent(data) {
        simpleXDM$1.unregisterKeyListener(data.extension_id, data.key, data.modifiers, data.callback);
        EventDispatcher$1.dispatch('dom-event-unregister', data);
      },
      registerWindowKeyEvent: function registerWindowKeyEvent(data) {
        window.addEventListener('keydown', function (event) {
          if (event.keyCode === data.keyCode) {
            data.callback();
          }
        });
      }
    };

    function escapeSelector(s) {
      if (!s) {
        throw new Error('No selector to escape');
      }
      return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
    }

    function escapeHtml$1(str) {
      return str.replace(/[&"'<>`]/g, function (str) {
        var special = {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '\'': '&#39;',
          '`': '&#96;'
        };

        if (typeof special[str] === 'string') {
          return special[str];
        }

        return '&quot;';
      });
    }

    function stringToDimension(value) {
      var percent = false;
      var unit = 'px';

      if (_.isString(value)) {
        percent = value.indexOf('%') === value.length - 1;
        value = parseInt(value, 10);
        if (percent) {
          unit = '%';
        }
      }

      if (!isNaN(value)) {
        return value + unit;
      }
    }

    function getIframeByExtensionId(id) {
      return $('iframe#' + escapeSelector(id));
    }

    var util$1 = {
      escapeHtml: escapeHtml$1,
      escapeSelector: escapeSelector,
      stringToDimension: stringToDimension,
      getIframeByExtensionId: getIframeByExtensionId
    };

    var ButtonUtils = function () {
      function ButtonUtils() {
        classCallCheck(this, ButtonUtils);
      }

      createClass$1(ButtonUtils, [{
        key: "randomIdentifier",

        // button identifier for XDM. NOT an id attribute
        value: function randomIdentifier() {
          return Math.random().toString(16).substring(7);
        }
      }]);
      return ButtonUtils;
    }();

    var buttonUtilsInstance = new ButtonUtils();

    var DialogUtils = function () {
      function DialogUtils() {
        classCallCheck(this, DialogUtils);
      }

      createClass$1(DialogUtils, [{
        key: '_size',
        value: function _size(options) {
          var size = options.size;
          if (options.size === 'x-large') {
            size = 'xlarge';
          }
          if (options.size !== 'maximum' && options.width === '100%' && options.height === '100%') {
            size = 'fullscreen';
          }
          return size;
        }
      }, {
        key: '_header',
        value: function _header(text) {
          var headerText = '';
          switch (typeof text === 'undefined' ? 'undefined' : _typeof(text)) {
            case 'string':
              headerText = text;
              break;

            case 'object':
              headerText = text.value;
              break;
          }

          return headerText;
        }
      }, {
        key: '_hint',
        value: function _hint(text) {
          if (typeof text === 'string') {
            return text;
          }
          return '';
        }
      }, {
        key: '_chrome',
        value: function _chrome(options) {
          var returnval = false;
          if (typeof options.chrome === 'boolean') {
            returnval = options.chrome;
          }
          if (options.size === 'fullscreen') {
            returnval = true;
          }
          if (options.size === 'maximum') {
            returnval = false;
          }
          return returnval;
        }
      }, {
        key: '_width',
        value: function _width(options) {
          if (options.size) {
            return undefined;
          }
          if (options.width) {
            return util$1.stringToDimension(options.width);
          }
          return '50%';
        }
      }, {
        key: '_height',
        value: function _height(options) {
          if (options.size) {
            return undefined;
          }
          if (options.height) {
            return util$1.stringToDimension(options.height);
          }
          return '50%';
        }
      }, {
        key: '_actions',
        value: function _actions(options) {
          var sanitizedActions = [];
          options = options || {};
          if (!options.actions) {

            sanitizedActions = [{
              name: 'submit',
              identifier: 'submit',
              text: options.submitText || 'Submit',
              type: 'primary'
            }, {
              name: 'cancel',
              identifier: 'cancel',
              text: options.cancelText || 'Cancel',
              type: 'link',
              immutable: true
            }];
          }

          if (options.buttons) {
            sanitizedActions = sanitizedActions.concat(this._buttons(options));
          }

          return sanitizedActions;
        }
      }, {
        key: '_id',
        value: function _id(str) {
          if (typeof str !== 'string') {
            str = Math.random().toString(36).substring(2, 8);
          }
          return str;
        }
        // user defined action buttons

      }, {
        key: '_buttons',
        value: function _buttons(options) {
          var buttons = [];
          if (options.buttons && Array.isArray(options.buttons)) {
            options.buttons.forEach(function (button) {
              var text;
              var identifier;
              var disabled = false;
              if (button.text && typeof button.text === 'string') {
                text = button.text;
              }
              if (button.identifier && typeof button.identifier === 'string') {
                identifier = button.identifier;
              } else {
                identifier = buttonUtilsInstance.randomIdentifier();
              }
              if (button.disabled && button.disabled === true) {
                disabled = true;
              }

              buttons.push({
                text: text,
                identifier: identifier,
                type: 'secondary',
                custom: true,
                disabled: disabled
              });
            });
          }
          return buttons;
        }
      }, {
        key: 'sanitizeOptions',
        value: function sanitizeOptions(options) {
          options = options || {};
          var sanitized = {
            chrome: this._chrome(options),
            header: this._header(options.header),
            hint: this._hint(options.hint),
            width: this._width(options),
            height: this._height(options),
            $content: options.$content,
            extension: options.extension,
            actions: this._actions(options),
            id: this._id(options.id),
            size: options.size
          };
          sanitized.size = this._size(sanitized);

          return sanitized;
        }
        // such a bad idea! this entire concept needs rewriting in the p2 plugin.

      }, {
        key: 'moduleOptionsFromGlobal',
        value: function moduleOptionsFromGlobal(addon_key, key) {
          if (window._AP && window._AP.dialogModules && window._AP.dialogModules[addon_key] && window._AP.dialogModules[addon_key][key]) {
            return window._AP.dialogModules[addon_key][key].options;
          }
          return false;
        }
      }]);
      return DialogUtils;
    }();

    var dialogUtilsInstance = new DialogUtils();

    var IframeActions = {
      notifyIframeCreated: function notifyIframeCreated($el, extension) {
        EventDispatcher$1.dispatch('iframe-create', { $el: $el, extension: extension });
      },

      notifyBridgeEstablished: function notifyBridgeEstablished($el, extension) {
        EventDispatcher$1.dispatch('iframe-bridge-established', { $el: $el, extension: extension });
      },

      notifyIframeDestroyed: function notifyIframeDestroyed(extension_id) {
        var extension = simpleXDM$1.getExtensions({
          extension_id: extension_id
        });
        if (extension.length === 1) {
          extension = extension[0];
        }
        EventDispatcher$1.dispatch('iframe-destroyed', { extension: extension });
        simpleXDM$1.unregisterExtension({ extension_id: extension_id });
      },

      notifyUnloaded: function notifyUnloaded($el, extension) {
        EventDispatcher$1.dispatch('iframe-unload', { $el: $el, extension: extension });
      }
    };

    var index$5 = function (str) {
    	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    	});
    };

    var strictUriEncode = index$5;
    var objectAssign = index;

    function encode$1(value, opts) {
    	if (opts.encode) {
    		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
    	}

    	return value;
    }

    var extract = function (str) {
    	return str.split('?')[1] || '';
    };

    var parse = function (str) {
    	// Create an object with no prototype
    	// https://github.com/sindresorhus/query-string/issues/47
    	var ret = Object.create(null);

    	if (typeof str !== 'string') {
    		return ret;
    	}

    	str = str.trim().replace(/^(\?|#|&)/, '');

    	if (!str) {
    		return ret;
    	}

    	str.split('&').forEach(function (param) {
    		var parts = param.replace(/\+/g, ' ').split('=');
    		// Firefox (pre 40) decodes `%3D` to `=`
    		// https://github.com/sindresorhus/query-string/pull/37
    		var key = parts.shift();
    		var val = parts.length > 0 ? parts.join('=') : undefined;

    		key = decodeURIComponent(key);

    		// missing `=` should be `null`:
    		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    		val = val === undefined ? null : decodeURIComponent(val);

    		if (ret[key] === undefined) {
    			ret[key] = val;
    		} else if (Array.isArray(ret[key])) {
    			ret[key].push(val);
    		} else {
    			ret[key] = [ret[key], val];
    		}
    	});

    	return ret;
    };

    var stringify = function (obj, opts) {
    	var defaults = {
    		encode: true,
    		strict: true
    	};

    	opts = objectAssign(defaults, opts);

    	return obj ? Object.keys(obj).sort().map(function (key) {
    		var val = obj[key];

    		if (val === undefined) {
    			return '';
    		}

    		if (val === null) {
    			return encode$1(key, opts);
    		}

    		if (Array.isArray(val)) {
    			var result = [];

    			val.slice().forEach(function (val2) {
    				if (val2 === undefined) {
    					return;
    				}

    				if (val2 === null) {
    					result.push(encode$1(key, opts));
    				} else {
    					result.push(encode$1(key, opts) + '=' + encode$1(val2, opts));
    				}
    			});

    			return result.join('&');
    		}

    		return encode$1(key, opts) + '=' + encode$1(val, opts);
    	}).filter(function (x) {
    		return x.length > 0;
    	}).join('&') : '';
    };

    var index$4 = {
    	extract: extract,
    	parse: parse,
    	stringify: stringify
    };

    var toByteArray_1 = toByteArray;
    var fromByteArray_1 = fromByteArray;

    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    for (var i$1 = 0, len = code.length; i$1 < len; ++i$1) {
      lookup[i$1] = code[i$1];
      revLookup[code.charCodeAt(i$1)] = i$1;
    }

    revLookup['-'.charCodeAt(0)] = 62;
    revLookup['_'.charCodeAt(0)] = 63;

    function placeHoldersCount(b64) {
      var len = b64.length;
      if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4');
      }

      // the number of equal signs (place holders)
      // if there are two placeholders, than the two characters before it
      // represent one byte
      // if there is only one, then the three characters before it represent 2 bytes
      // this is just a cheap hack to not do indexOf twice
      return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;
    }

    function toByteArray(b64) {
      var i, j, l, tmp, placeHolders, arr;
      var len = b64.length;
      placeHolders = placeHoldersCount(b64);

      arr = new Arr(len * 3 / 4 - placeHolders);

      // if there are placeholders, only get up to the last complete 4 chars
      l = placeHolders > 0 ? len - 4 : len;

      var L = 0;

      for (i = 0, j = 0; i < l; i += 4, j += 3) {
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[L++] = tmp >> 16 & 0xFF;
        arr[L++] = tmp >> 8 & 0xFF;
        arr[L++] = tmp & 0xFF;
      }

      if (placeHolders === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[L++] = tmp & 0xFF;
      } else if (placeHolders === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[L++] = tmp >> 8 & 0xFF;
        arr[L++] = tmp & 0xFF;
      }

      return arr;
    }

    function tripletToBase64(num) {
      return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
    }

    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
        output.push(tripletToBase64(tmp));
      }
      return output.join('');
    }

    function fromByteArray(uint8) {
      var tmp;
      var len = uint8.length;
      var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
      var output = '';
      var parts = [];
      var maxChunkLength = 16383; // must be multiple of 3

      // go through the array every three bytes, we'll deal with trailing stuff later
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
      }

      // pad the end with zeros, but make sure to not forget the extra bytes
      if (extraBytes === 1) {
        tmp = uint8[len - 1];
        output += lookup[tmp >> 2];
        output += lookup[tmp << 4 & 0x3F];
        output += '==';
      } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        output += lookup[tmp >> 10];
        output += lookup[tmp >> 4 & 0x3F];
        output += lookup[tmp << 2 & 0x3F];
        output += '=';
      }

      parts.push(output);

      return parts.join('');
    }

    // This is free and unencumbered software released into the public domain.
    // See LICENSE.md for more information.

    //
    // Utilities
    //

    /**
     * @param {number} a The number to test.
     * @param {number} min The minimum value in the range, inclusive.
     * @param {number} max The maximum value in the range, inclusive.
     * @return {boolean} True if a >= min and a <= max.
     */

    function inRange(a, min, max) {
      return min <= a && a <= max;
    }

    /**
     * @param {*} o
     * @return {Object}
     */
    function ToDictionary(o) {
      if (o === undefined) return {};
      if (o === Object(o)) return o;
      throw TypeError('Could not convert argument to dictionary');
    }

    /**
     * @param {string} string Input string of UTF-16 code units.
     * @return {!Array.<number>} Code points.
     */
    function stringToCodePoints(string) {
      // https://heycam.github.io/webidl/#dfn-obtain-unicode

      // 1. Let S be the DOMString value.
      var s = String(string);

      // 2. Let n be the length of S.
      var n = s.length;

      // 3. Initialize i to 0.
      var i = 0;

      // 4. Initialize U to be an empty sequence of Unicode characters.
      var u = [];

      // 5. While i < n:
      while (i < n) {

        // 1. Let c be the code unit in S at index i.
        var c = s.charCodeAt(i);

        // 2. Depending on the value of c:

        // c < 0xD800 or c > 0xDFFF
        if (c < 0xD800 || c > 0xDFFF) {
          // Append to U the Unicode character with code point c.
          u.push(c);
        }

        // 0xDC00 ≤ c ≤ 0xDFFF
        else if (0xDC00 <= c && c <= 0xDFFF) {
            // Append to U a U+FFFD REPLACEMENT CHARACTER.
            u.push(0xFFFD);
          }

          // 0xD800 ≤ c ≤ 0xDBFF
          else if (0xD800 <= c && c <= 0xDBFF) {
              // 1. If i = n−1, then append to U a U+FFFD REPLACEMENT
              // CHARACTER.
              if (i === n - 1) {
                u.push(0xFFFD);
              }
              // 2. Otherwise, i < n−1:
              else {
                  // 1. Let d be the code unit in S at index i+1.
                  var d = string.charCodeAt(i + 1);

                  // 2. If 0xDC00 ≤ d ≤ 0xDFFF, then:
                  if (0xDC00 <= d && d <= 0xDFFF) {
                    // 1. Let a be c & 0x3FF.
                    var a = c & 0x3FF;

                    // 2. Let b be d & 0x3FF.
                    var b = d & 0x3FF;

                    // 3. Append to U the Unicode character with code point
                    // 2^16+2^10*a+b.
                    u.push(0x10000 + (a << 10) + b);

                    // 4. Set i to i+1.
                    i += 1;
                  }

                  // 3. Otherwise, d < 0xDC00 or d > 0xDFFF. Append to U a
                  // U+FFFD REPLACEMENT CHARACTER.
                  else {
                      u.push(0xFFFD);
                    }
                }
            }

        // 3. Set i to i+1.
        i += 1;
      }

      // 6. Return U.
      return u;
    }

    /**
     * @param {!Array.<number>} code_points Array of code points.
     * @return {string} string String of UTF-16 code units.
     */
    function codePointsToString(code_points) {
      var s = '';
      for (var i = 0; i < code_points.length; ++i) {
        var cp = code_points[i];
        if (cp <= 0xFFFF) {
          s += String.fromCharCode(cp);
        } else {
          cp -= 0x10000;
          s += String.fromCharCode((cp >> 10) + 0xD800, (cp & 0x3FF) + 0xDC00);
        }
      }
      return s;
    }

    //
    // Implementation of Encoding specification
    // https://encoding.spec.whatwg.org/
    //

    //
    // 3. Terminology
    //

    /**
     * End-of-stream is a special token that signifies no more tokens
     * are in the stream.
     * @const
     */var end_of_stream = -1;

    /**
     * A stream represents an ordered sequence of tokens.
     *
     * @constructor
     * @param {!(Array.<number>|Uint8Array)} tokens Array of tokens that provide the
     * stream.
     */
    function Stream(tokens) {
      /** @type {!Array.<number>} */
      this.tokens = [].slice.call(tokens);
    }

    Stream.prototype = {
      /**
       * @return {boolean} True if end-of-stream has been hit.
       */
      endOfStream: function endOfStream() {
        return !this.tokens.length;
      },

      /**
       * When a token is read from a stream, the first token in the
       * stream must be returned and subsequently removed, and
       * end-of-stream must be returned otherwise.
       *
       * @return {number} Get the next token from the stream, or
       * end_of_stream.
       */
      read: function read() {
        if (!this.tokens.length) return end_of_stream;
        return this.tokens.shift();
      },

      /**
       * When one or more tokens are prepended to a stream, those tokens
       * must be inserted, in given order, before the first token in the
       * stream.
       *
       * @param {(number|!Array.<number>)} token The token(s) to prepend to the stream.
       */
      prepend: function prepend(token) {
        if (Array.isArray(token)) {
          var tokens = /**@type {!Array.<number>}*/token;
          while (tokens.length) {
            this.tokens.unshift(tokens.pop());
          }
        } else {
          this.tokens.unshift(token);
        }
      },

      /**
       * When one or more tokens are pushed to a stream, those tokens
       * must be inserted, in given order, after the last token in the
       * stream.
       *
       * @param {(number|!Array.<number>)} token The tokens(s) to prepend to the stream.
       */
      push: function push(token) {
        if (Array.isArray(token)) {
          var tokens = /**@type {!Array.<number>}*/token;
          while (tokens.length) {
            this.tokens.push(tokens.shift());
          }
        } else {
          this.tokens.push(token);
        }
      }
    };

    //
    // 4. Encodings
    //

    // 4.1 Encoders and decoders

    /** @const */
    var finished = -1;

    /**
     * @param {boolean} fatal If true, decoding errors raise an exception.
     * @param {number=} opt_code_point Override the standard fallback code point.
     * @return {number} The code point to insert on a decoding error.
     */
    function decoderError(fatal, opt_code_point) {
      if (fatal) throw TypeError('Decoder error');
      return opt_code_point || 0xFFFD;
    }

    //
    // 7. API
    //

    /** @const */var DEFAULT_ENCODING = 'utf-8';

    // 7.1 Interface TextDecoder

    /**
     * @constructor
     * @param {string=} encoding The label of the encoding;
     *     defaults to 'utf-8'.
     * @param {Object=} options
     */
    function TextDecoder(encoding, options) {
      if (!(this instanceof TextDecoder)) {
        return new TextDecoder(encoding, options);
      }
      encoding = encoding !== undefined ? String(encoding).toLowerCase() : DEFAULT_ENCODING;
      if (encoding !== DEFAULT_ENCODING) {
        throw new Error('Encoding not supported. Only utf-8 is supported');
      }
      options = ToDictionary(options);

      /** @private @type {boolean} */
      this._streaming = false;
      /** @private @type {boolean} */
      this._BOMseen = false;
      /** @private @type {?Decoder} */
      this._decoder = null;
      /** @private @type {boolean} */
      this._fatal = Boolean(options['fatal']);
      /** @private @type {boolean} */
      this._ignoreBOM = Boolean(options['ignoreBOM']);

      Object.defineProperty(this, 'encoding', { value: 'utf-8' });
      Object.defineProperty(this, 'fatal', { value: this._fatal });
      Object.defineProperty(this, 'ignoreBOM', { value: this._ignoreBOM });
    }

    TextDecoder.prototype = {
      /**
       * @param {ArrayBufferView=} input The buffer of bytes to decode.
       * @param {Object=} options
       * @return {string} The decoded string.
       */
      decode: function decode(input, options) {
        var bytes;
        if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input instanceof ArrayBuffer) {
          bytes = new Uint8Array(input);
        } else if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && 'buffer' in input && input.buffer instanceof ArrayBuffer) {
          bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
        } else {
          bytes = new Uint8Array(0);
        }

        options = ToDictionary(options);

        if (!this._streaming) {
          this._decoder = new UTF8Decoder({ fatal: this._fatal });
          this._BOMseen = false;
        }
        this._streaming = Boolean(options['stream']);

        var input_stream = new Stream(bytes);

        var code_points = [];

        /** @type {?(number|!Array.<number>)} */
        var result;

        while (!input_stream.endOfStream()) {
          result = this._decoder.handler(input_stream, input_stream.read());
          if (result === finished) break;
          if (result === null) continue;
          if (Array.isArray(result)) code_points.push.apply(code_points, /**@type {!Array.<number>}*/result);else code_points.push(result);
        }
        if (!this._streaming) {
          do {
            result = this._decoder.handler(input_stream, input_stream.read());
            if (result === finished) break;
            if (result === null) continue;
            if (Array.isArray(result)) code_points.push.apply(code_points, /**@type {!Array.<number>}*/result);else code_points.push(result);
          } while (!input_stream.endOfStream());
          this._decoder = null;
        }

        if (code_points.length) {
          // If encoding is one of utf-8, utf-16be, and utf-16le, and
          // ignore BOM flag and BOM seen flag are unset, run these
          // subsubsteps:
          if (['utf-8'].indexOf(this.encoding) !== -1 && !this._ignoreBOM && !this._BOMseen) {
            // If token is U+FEFF, set BOM seen flag.
            if (code_points[0] === 0xFEFF) {
              this._BOMseen = true;
              code_points.shift();
            } else {
              // Otherwise, if token is not end-of-stream, set BOM seen
              // flag and append token to output.
              this._BOMseen = true;
            }
          }
        }

        return codePointsToString(code_points);
      }
    };

    // 7.2 Interface TextEncoder

    /**
     * @constructor
     * @param {string=} encoding The label of the encoding;
     *     defaults to 'utf-8'.
     * @param {Object=} options
     */
    function TextEncoder(encoding, options) {
      if (!(this instanceof TextEncoder)) return new TextEncoder(encoding, options);
      encoding = encoding !== undefined ? String(encoding).toLowerCase() : DEFAULT_ENCODING;
      if (encoding !== DEFAULT_ENCODING) {
        throw new Error('Encoding not supported. Only utf-8 is supported');
      }
      options = ToDictionary(options);

      /** @private @type {boolean} */
      this._streaming = false;
      /** @private @type {?Encoder} */
      this._encoder = null;
      /** @private @type {{fatal: boolean}} */
      this._options = { fatal: Boolean(options['fatal']) };

      Object.defineProperty(this, 'encoding', { value: 'utf-8' });
    }

    TextEncoder.prototype = {
      /**
       * @param {string=} opt_string The string to encode.
       * @param {Object=} options
       * @return {Uint8Array} Encoded bytes, as a Uint8Array.
       */
      encode: function encode(opt_string, options) {
        opt_string = opt_string ? String(opt_string) : '';
        options = ToDictionary(options);

        // NOTE: This option is nonstandard. None of the encodings
        // permitted for encoding (i.e. UTF-8, UTF-16) are stateful,
        // so streaming is not necessary.
        if (!this._streaming) this._encoder = new UTF8Encoder(this._options);
        this._streaming = Boolean(options['stream']);

        var bytes = [];
        var input_stream = new Stream(stringToCodePoints(opt_string));
        /** @type {?(number|!Array.<number>)} */
        var result;
        while (!input_stream.endOfStream()) {
          result = this._encoder.handler(input_stream, input_stream.read());
          if (result === finished) break;
          if (Array.isArray(result)) bytes.push.apply(bytes, /**@type {!Array.<number>}*/result);else bytes.push(result);
        }
        if (!this._streaming) {
          while (true) {
            result = this._encoder.handler(input_stream, input_stream.read());
            if (result === finished) break;
            if (Array.isArray(result)) bytes.push.apply(bytes, /**@type {!Array.<number>}*/result);else bytes.push(result);
          }
          this._encoder = null;
        }
        return new Uint8Array(bytes);
      }
    };

    //
    // 8. The encoding
    //

    // 8.1 utf-8

    /**
     * @constructor
     * @implements {Decoder}
     * @param {{fatal: boolean}} options
     */
    function UTF8Decoder(options) {
      var fatal = options.fatal;

      // utf-8's decoder's has an associated utf-8 code point, utf-8
      // bytes seen, and utf-8 bytes needed (all initially 0), a utf-8
      // lower boundary (initially 0x80), and a utf-8 upper boundary
      // (initially 0xBF).
      var /** @type {number} */utf8_code_point = 0,

      /** @type {number} */utf8_bytes_seen = 0,

      /** @type {number} */utf8_bytes_needed = 0,

      /** @type {number} */utf8_lower_boundary = 0x80,

      /** @type {number} */utf8_upper_boundary = 0xBF;

      /**
       * @param {Stream} stream The stream of bytes being decoded.
       * @param {number} bite The next byte read from the stream.
       * @return {?(number|!Array.<number>)} The next code point(s)
       *     decoded, or null if not enough data exists in the input
       *     stream to decode a complete code point.
       */
      this.handler = function (stream, bite) {
        // 1. If byte is end-of-stream and utf-8 bytes needed is not 0,
        // set utf-8 bytes needed to 0 and return error.
        if (bite === end_of_stream && utf8_bytes_needed !== 0) {
          utf8_bytes_needed = 0;
          return decoderError(fatal);
        }

        // 2. If byte is end-of-stream, return finished.
        if (bite === end_of_stream) return finished;

        // 3. If utf-8 bytes needed is 0, based on byte:
        if (utf8_bytes_needed === 0) {

          // 0x00 to 0x7F
          if (inRange(bite, 0x00, 0x7F)) {
            // Return a code point whose value is byte.
            return bite;
          }

          // 0xC2 to 0xDF
          if (inRange(bite, 0xC2, 0xDF)) {
            // Set utf-8 bytes needed to 1 and utf-8 code point to byte
            // − 0xC0.
            utf8_bytes_needed = 1;
            utf8_code_point = bite - 0xC0;
          }

          // 0xE0 to 0xEF
          else if (inRange(bite, 0xE0, 0xEF)) {
              // 1. If byte is 0xE0, set utf-8 lower boundary to 0xA0.
              if (bite === 0xE0) utf8_lower_boundary = 0xA0;
              // 2. If byte is 0xED, set utf-8 upper boundary to 0x9F.
              if (bite === 0xED) utf8_upper_boundary = 0x9F;
              // 3. Set utf-8 bytes needed to 2 and utf-8 code point to
              // byte − 0xE0.
              utf8_bytes_needed = 2;
              utf8_code_point = bite - 0xE0;
            }

            // 0xF0 to 0xF4
            else if (inRange(bite, 0xF0, 0xF4)) {
                // 1. If byte is 0xF0, set utf-8 lower boundary to 0x90.
                if (bite === 0xF0) utf8_lower_boundary = 0x90;
                // 2. If byte is 0xF4, set utf-8 upper boundary to 0x8F.
                if (bite === 0xF4) utf8_upper_boundary = 0x8F;
                // 3. Set utf-8 bytes needed to 3 and utf-8 code point to
                // byte − 0xF0.
                utf8_bytes_needed = 3;
                utf8_code_point = bite - 0xF0;
              }

              // Otherwise
              else {
                  // Return error.
                  return decoderError(fatal);
                }

          // Then (byte is in the range 0xC2 to 0xF4) set utf-8 code
          // point to utf-8 code point << (6 × utf-8 bytes needed) and
          // return continue.
          utf8_code_point = utf8_code_point << 6 * utf8_bytes_needed;
          return null;
        }

        // 4. If byte is not in the range utf-8 lower boundary to utf-8
        // upper boundary, run these substeps:
        if (!inRange(bite, utf8_lower_boundary, utf8_upper_boundary)) {

          // 1. Set utf-8 code point, utf-8 bytes needed, and utf-8
          // bytes seen to 0, set utf-8 lower boundary to 0x80, and set
          // utf-8 upper boundary to 0xBF.
          utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;
          utf8_lower_boundary = 0x80;
          utf8_upper_boundary = 0xBF;

          // 2. Prepend byte to stream.
          stream.prepend(bite);

          // 3. Return error.
          return decoderError(fatal);
        }

        // 5. Set utf-8 lower boundary to 0x80 and utf-8 upper boundary
        // to 0xBF.
        utf8_lower_boundary = 0x80;
        utf8_upper_boundary = 0xBF;

        // 6. Increase utf-8 bytes seen by one and set utf-8 code point
        // to utf-8 code point + (byte − 0x80) << (6 × (utf-8 bytes
        // needed − utf-8 bytes seen)).
        utf8_bytes_seen += 1;
        utf8_code_point += bite - 0x80 << 6 * (utf8_bytes_needed - utf8_bytes_seen);

        // 7. If utf-8 bytes seen is not equal to utf-8 bytes needed,
        // continue.
        if (utf8_bytes_seen !== utf8_bytes_needed) return null;

        // 8. Let code point be utf-8 code point.
        var code_point = utf8_code_point;

        // 9. Set utf-8 code point, utf-8 bytes needed, and utf-8 bytes
        // seen to 0.
        utf8_code_point = utf8_bytes_needed = utf8_bytes_seen = 0;

        // 10. Return a code point whose value is code point.
        return code_point;
      };
    }

    /**
     * @constructor
     * @implements {Encoder}
     * @param {{fatal: boolean}} options
     */
    function UTF8Encoder(options) {
      var fatal = options.fatal;
      /**
       * @param {Stream} stream Input stream.
       * @param {number} code_point Next code point read from the stream.
       * @return {(number|!Array.<number>)} Byte(s) to emit.
       */
      this.handler = function (stream, code_point) {
        // 1. If code point is end-of-stream, return finished.
        if (code_point === end_of_stream) return finished;

        // 2. If code point is in the range U+0000 to U+007F, return a
        // byte whose value is code point.
        if (inRange(code_point, 0x0000, 0x007f)) return code_point;

        // 3. Set count and offset based on the range code point is in:
        var count, offset;
        // U+0080 to U+07FF:    1 and 0xC0
        if (inRange(code_point, 0x0080, 0x07FF)) {
          count = 1;
          offset = 0xC0;
        }
        // U+0800 to U+FFFF:    2 and 0xE0
        else if (inRange(code_point, 0x0800, 0xFFFF)) {
            count = 2;
            offset = 0xE0;
          }
          // U+10000 to U+10FFFF: 3 and 0xF0
          else if (inRange(code_point, 0x10000, 0x10FFFF)) {
              count = 3;
              offset = 0xF0;
            }

        // 4.Let bytes be a byte sequence whose first byte is (code
        // point >> (6 × count)) + offset.
        var bytes = [(code_point >> 6 * count) + offset];

        // 5. Run these substeps while count is greater than 0:
        while (count > 0) {

          // 1. Set temp to code point >> (6 × (count − 1)).
          var temp = code_point >> 6 * (count - 1);

          // 2. Append to bytes 0x80 | (temp & 0x3F).
          bytes.push(0x80 | temp & 0x3F);

          // 3. Decrease count by one.
          count -= 1;
        }

        // 6. Return bytes bytes, in order.
        return bytes;
      };
    }

    var base64 = {
      encode: function encode(string) {
        return fromByteArray_1(TextEncoder('utf-8').encode(string));
      },
      decode: function decode(string) {
        var padding = 4 - string.length % 4;
        if (padding === 1) {
          string += '=';
        } else if (padding === 2) {
          string += '==';
        }
        return TextDecoder('utf-8').decode(toByteArray_1(string));
      }
    };

    function parseJwtIssuer(jwt) {
      return parseJwtClaims(jwt)['iss'];
    }

    function parseJwtClaims(jwt) {

      if (null === jwt || '' === jwt) {
        throw 'Invalid JWT: must be neither null nor empty-string.';
      }

      var firstPeriodIndex = jwt.indexOf('.');
      var secondPeriodIndex = jwt.indexOf('.', firstPeriodIndex + 1);

      if (firstPeriodIndex < 0 || secondPeriodIndex <= firstPeriodIndex) {
        throw 'Invalid JWT: must contain 2 period (".") characters.';
      }

      var encodedClaims = jwt.substring(firstPeriodIndex + 1, secondPeriodIndex);

      if (null === encodedClaims || '' === encodedClaims) {
        throw 'Invalid JWT: encoded claims must be neither null nor empty-string.';
      }

      var claimsString = base64.decode.call(window, encodedClaims);
      return JSON.parse(claimsString);
    }

    function isJwtExpired$1(jwtString, skew) {
      if (skew === undefined) {
        skew = 60; // give a minute of leeway to allow clock skew
      }
      var claims = parseJwtClaims(jwtString);
      var expires = 0;
      var now = Math.floor(Date.now() / 1000); // UTC timestamp now

      if (claims && claims.exp) {
        expires = claims.exp;
      }

      if (expires - now < skew) {
        return true;
      }

      return false;
    }

    var jwtUtil = {
      parseJwtIssuer: parseJwtIssuer,
      parseJwtClaims: parseJwtClaims,
      isJwtExpired: isJwtExpired$1
    };

    function isJwtExpired(urlStr) {
      var jwtStr = _getJwt(urlStr);
      return jwtUtil.isJwtExpired(jwtStr);
    }

    function _getJwt(urlStr) {
      var query = index$4.parse(index$4.extract(urlStr));
      return query['jwt'];
    }

    function hasJwt(url) {
      var jwt = _getJwt(url);
      return jwt && _getJwt(url).length !== 0;
    }

    var urlUtil = {
      hasJwt: hasJwt,
      isJwtExpired: isJwtExpired
    };

    var jwtActions = {
      registerContentResolver: function registerContentResolver(data) {
        EventDispatcher$1.dispatch('content-resolver-register-by-extension', data);
      },
      requestRefreshUrl: function requestRefreshUrl(data) {
        if (!data.resolver) {
          throw Error('ACJS: No content resolver supplied');
        }
        var promise = data.resolver.call(null, _.extend({ classifier: 'json' }, data.extension));
        promise.done(function (promiseData) {
          var newExtensionConfiguration = {};
          if (_.isObject(promiseData)) {
            newExtensionConfiguration = promiseData;
          } else if (_.isString(promiseData)) {
            try {
              newExtensionConfiguration = JSON.parse(promiseData);
            } catch (e) {
              console.error('ACJS: invalid response from content resolver');
            }
          }
          data.extension.url = newExtensionConfiguration.url;
          _.extend(data.extension.options, newExtensionConfiguration.options);
          EventDispatcher$1.dispatch('jwt-url-refreshed', {
            extension: data.extension,
            $container: data.$container,
            url: data.extension.url
          });
        });
        EventDispatcher$1.dispatch('jwt-url-refresh-request', { data: data });
      }

    };

    var iframeUtils = {
      optionsToAttributes: function optionsToAttributes(options) {
        var sanitized = {};
        if (options && (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
          if (options.width) {
            sanitized.width = util$1.stringToDimension(options.width);
          }
          if (options.height) {
            sanitized.height = util$1.stringToDimension(options.height);
          }
        }
        return sanitized;
      }
    };

    var Iframe = function () {
      function Iframe() {
        classCallCheck(this, Iframe);

        this._contentResolver = false;
      }

      createClass$1(Iframe, [{
        key: 'setContentResolver',
        value: function setContentResolver(callback) {
          this._contentResolver = callback;
        }
      }, {
        key: 'resize',
        value: function resize(width, height, $el) {
          width = util$1.stringToDimension(width);
          height = util$1.stringToDimension(height);
          $el.css({
            width: width,
            height: height
          });
          $el.trigger('resized', { width: width, height: height });
        }
      }, {
        key: 'simpleXdmExtension',
        value: function simpleXdmExtension(extension, $container) {
          if (!extension.url || urlUtil.hasJwt(extension.url) && urlUtil.isJwtExpired(extension.url)) {
            if (this._contentResolver) {
              jwtActions.requestRefreshUrl({
                extension: extension,
                resolver: this._contentResolver,
                $container: $container
              });
            } else {
              console.error('JWT is expired and no content resolver was specified');
            }
          } else {
            this._appendExtension($container, this._simpleXdmCreate(extension));
          }
        }
      }, {
        key: '_simpleXdmCreate',
        value: function _simpleXdmCreate(extension) {
          var iframeAttributes = simpleXDM$1.create(extension, function () {
            if (!extension.options) {
              extension.options = {};
            }
            IframeActions.notifyBridgeEstablished(extension.$el, extension);
          }, function () {
            IframeActions.notifyUnloaded(extension.$el, extension);
          });
          extension.id = iframeAttributes.id;
          $.extend(iframeAttributes, iframeUtils.optionsToAttributes(extension.options));
          extension.$el = this.render(iframeAttributes);
          return extension;
        }
      }, {
        key: '_appendExtension',
        value: function _appendExtension($container, extension) {
          var existingFrame = $container.find('iframe');
          if (existingFrame.length > 0) {
            existingFrame.destroy();
          }
          $container.prepend(extension.$el);
          IframeActions.notifyIframeCreated(extension.$el, extension);
        }
      }, {
        key: 'resolverResponse',
        value: function resolverResponse(data) {
          var simpleExtension = this._simpleXdmCreate(data.extension);
          this._appendExtension(data.$container, simpleExtension);
        }
      }, {
        key: 'render',
        value: function render(attributes) {
          return $('<iframe />').attr(attributes).addClass('ap-iframe');
        }
      }]);
      return Iframe;
    }();

    var IframeComponent = new Iframe();

    EventDispatcher$1.register('iframe-resize', function (data) {
      IframeComponent.resize(data.width, data.height, data.$el);
    });

    EventDispatcher$1.register('content-resolver-register-by-extension', function (data) {
      IframeComponent.setContentResolver(data.callback);
    });

    EventDispatcher$1.register('jwt-url-refreshed', function (data) {
      IframeComponent.resolverResponse(data);
    });

    EventDispatcher$1.register('after:iframe-bridge-established', function (data) {
      data.$el[0].bridgeEstablished = true;
    });

    var ButtonActions = {
      clicked: function clicked($el) {
        EventDispatcher$1.dispatch('button-clicked', {
          $el: $el
        });
      },
      toggle: function toggle($el, disabled) {
        EventDispatcher$1.dispatch('button-toggle', {
          $el: $el,
          disabled: disabled
        });
      },
      toggleVisibility: function toggleVisibility($el, hidden) {
        EventDispatcher$1.dispatch('button-toggle-visibility', {
          $el: $el,
          hidden: hidden
        });
      }
    };

    var BUTTON_TYPES = ['primary', 'link', 'secondary'];
    var buttonId = 0;

    var Button$1 = function () {
      function Button() {
        classCallCheck(this, Button);

        this.AP_BUTTON_CLASS = 'ap-aui-button';
      }

      createClass$1(Button, [{
        key: 'setType',
        value: function setType($button, type) {
          if (type && _.contains(BUTTON_TYPES, type)) {
            $button.addClass('aui-button-' + type);
          }
          return $button;
        }
      }, {
        key: 'setDisabled',
        value: function setDisabled($button, disabled) {
          if (typeof disabled !== 'undefined' && !$button.data('immutable')) {
            $button.attr('aria-disabled', disabled);
          }
          return $button;
        }
      }, {
        key: 'setHidden',
        value: function setHidden($button, hidden) {
          if (typeof hidden !== 'undefined' && !$button.data('immutable')) {
            $button.toggle(!hidden);
          }
          return $button;
        }
      }, {
        key: '_setId',
        value: function _setId($button, id) {
          if (!id) {
            id = 'ap-button-' + buttonId;
            buttonId++;
          }
          $button.attr('id', id);
          return $button;
        }
      }, {
        key: '_additionalClasses',
        value: function _additionalClasses($button, classes) {
          if (classes) {
            if (typeof classes !== 'string') {
              classes = classes.join(' ');
            }
            $button.addClass(classes);
          }
          return $button;
        }
      }, {
        key: 'getName',
        value: function getName($button) {
          return $($button).data('name');
        }
      }, {
        key: 'getText',
        value: function getText($button) {
          return $($button).text();
        }
      }, {
        key: 'getIdentifier',
        value: function getIdentifier($button) {
          return $($button).data('identifier');
        }
      }, {
        key: 'isVisible',
        value: function isVisible($button) {
          return $($button).is(':visible');
        }
      }, {
        key: 'isEnabled',
        value: function isEnabled($button) {
          return !($($button).attr('aria-disabled') === 'true');
        }
      }, {
        key: 'render',
        value: function render(options) {
          var $button = $('<button />');
          options = options || {};
          $button.addClass('aui-button ' + this.AP_BUTTON_CLASS);
          $button.text(options.text);
          $button.data(options.data);
          $button.data({
            name: options.name || options.identifier,
            identifier: options.identifier || buttonUtilsInstance.randomIdentifier(),
            immutable: options.immutable || false
          });
          this._additionalClasses($button, options.additionalClasses);
          this.setType($button, options.type);
          this.setDisabled($button, options.disabled || false);
          this._setId($button, options.id);
          return $button;
        }
      }]);
      return Button;
    }();

    var ButtonComponent = new Button$1();
    // register 1 button listener globally on dom load
    $(function () {
      $('body').on('click', '.' + ButtonComponent.AP_BUTTON_CLASS, function (e) {
        var $button = $(e.target).closest('.' + ButtonComponent.AP_BUTTON_CLASS);
        if ($button.attr('aria-disabled') !== 'true') {
          ButtonActions.clicked($button);
        }
      });
    });

    EventDispatcher$1.register('button-toggle', function (data) {
      ButtonComponent.setDisabled(data.$el, data.disabled);
    });

    EventDispatcher$1.register('button-toggle-visibility', function (data) {
      ButtonComponent.setHidden(data.$el, data.hidden);
    });

    var DLGID_PREFIX = 'ap-dialog-';
    var DIALOG_CLASS = 'ap-aui-dialog2';
    var DLGID_REGEXP = new RegExp('^' + DLGID_PREFIX + '[0-9A-Za-z]+$');
    var DIALOG_SIZES = ['small', 'medium', 'large', 'xlarge', 'fullscreen', 'maximum'];
    var DIALOG_BUTTON_CLASS = 'ap-aui-dialog-button';
    var DIALOG_BUTTON_CUSTOM_CLASS = 'ap-dialog-custom-button';
    var DIALOG_FOOTER_CLASS = 'aui-dialog2-footer';
    var DIALOG_FOOTER_ACTIONS_CLASS = 'aui-dialog2-footer-actions';
    var DIALOG_HEADER_ACTIONS_CLASS = 'header-control-panel';

    function getActiveDialog$1() {
      var $el = AJS.LayerManager.global.getTopLayer();
      if ($el && DLGID_REGEXP.test($el.attr('id'))) {
        var dialog = AJS.dialog2($el);
        dialog._id = dialog.$el.attr('id').replace(DLGID_PREFIX, '');
        return dialog;
      }
    }

    function getActionBar($dialog) {
      var $actionBar = $dialog.find('.' + DIALOG_HEADER_ACTIONS_CLASS);
      if (!$actionBar.length) {
        $actionBar = $dialog.find('.' + DIALOG_FOOTER_ACTIONS_CLASS);
      }
      return $actionBar;
    }

    function getButtonByIdentifier(id, $dialog) {
      var $actionBar = getActionBar($dialog);
      return $actionBar.find('.aui-button').filter(function () {
        return ButtonComponent.getIdentifier(this) === id;
      });
    }

    var Dialog$1 = function () {
      function Dialog() {
        classCallCheck(this, Dialog);
      }

      createClass$1(Dialog, [{
        key: '_renderHeaderCloseBtn',
        value: function _renderHeaderCloseBtn() {
          var $close = $('<a />').addClass('aui-dialog2-header-close');
          var $closeBtn = $('<span />').addClass('aui-icon aui-icon-small aui-iconfont-close-dialog').text('Close');
          $close.append($closeBtn);
          return $close;
        }
        //v3 ask DT about this DOM.

      }, {
        key: '_renderFullScreenHeader',
        value: function _renderFullScreenHeader($header, options) {
          var $titleContainer = $('<div />').addClass('header-title-container aui-item expanded');
          var $title = $('<div />').append($('<span />').addClass('header-title').text(options.header || ''));
          $titleContainer.append($title);
          $header.append($titleContainer).append(this._renderHeaderActions(options.actions, options.extension));
          return $header;
        }
      }, {
        key: '_renderHeader',
        value: function _renderHeader(options) {
          var $header = $('<header />').addClass('aui-dialog2-header');
          if (options.size === 'fullscreen') {
            return this._renderFullScreenHeader($header, options);
          }
          if (options.header) {
            var $title = $('<h2 />').addClass('aui-dialog2-header-main').text(options.header);
            $header.append($title);
          }
          $header.append(this._renderHeaderCloseBtn());
          return $header;
        }
      }, {
        key: '_renderHeaderActions',
        value: function _renderHeaderActions(actions, extension) {
          var $headerControls = $('<div />').addClass('aui-item ' + DIALOG_HEADER_ACTIONS_CLASS);
          actions[0].additionalClasses = ['aui-icon', 'aui-icon-small', 'aui-iconfont-success'];
          actions[1].additionalClasses = ['aui-icon', 'aui-icon-small', 'aui-iconfont-close-dialog'];
          var $actions = this._renderActionButtons(actions, extension);
          $actions.forEach(function ($action) {
            $headerControls.append($action);
          });
          return $headerControls;
        }
      }, {
        key: '_renderContent',
        value: function _renderContent($content) {
          var $el = $('<div />').addClass('aui-dialog2-content');
          if ($content) {
            $el.append($content);
          }
          return $el;
        }
      }, {
        key: '_renderFooter',
        value: function _renderFooter(options) {
          var $footer = $('<footer />').addClass(DIALOG_FOOTER_CLASS);
          if (options.size !== 'fullscreen') {
            var $actions = this._renderFooterActions(options.actions, options.extension);
            $footer.append($actions);
          }
          if (options.hint) {
            var $hint = $('<div />').addClass('aui-dialog2-footer-hint').text(options.hint);
            $footer.append($hint);
          }
          return $footer;
        }
      }, {
        key: '_renderActionButtons',
        value: function _renderActionButtons(actions, extension) {
          var _this = this;

          var actionButtons = [];
          [].concat(toConsumableArray(actions)).forEach(function (action) {
            actionButtons.push(_this._renderDialogButton({
              text: action.text,
              name: action.name,
              type: action.type,
              additionalClasses: action.additionalClasses,
              custom: action.custom || false,
              identifier: action.identifier,
              immutable: action.immutable
            }, extension));
          });
          return actionButtons;
        }
      }, {
        key: '_renderFooterActions',
        value: function _renderFooterActions(actions, extension) {
          var $actions = $('<div />').addClass(DIALOG_FOOTER_ACTIONS_CLASS);
          var $buttons = this._renderActionButtons(actions, extension);
          $buttons.forEach(function ($button) {
            $actions.append($button);
          });
          return $actions;
        }
      }, {
        key: '_renderDialogButton',
        value: function _renderDialogButton(options, extension) {
          options.additionalClasses = options.additionalClasses || [];
          options.additionalClasses.push(DIALOG_BUTTON_CLASS);
          if (options.custom) {
            options.additionalClasses.push(DIALOG_BUTTON_CUSTOM_CLASS);
          }
          var $button = ButtonComponent.render(options);
          $button.extension = extension;
          return $button;
        }

        /**
        {
          id: 'some-dialog-id',
          title: 'some header',
          hint: 'some footer hint',
          $content: $(<div />).text('my content'),
          actions: []
        }
        **/

      }, {
        key: 'render',
        value: function render(options) {
          var sanitizedOptions = dialogUtilsInstance.sanitizeOptions(options);
          var $dialog = $('<section />').attr({
            role: 'dialog',
            id: DLGID_PREFIX + sanitizedOptions.id
          });
          $dialog.attr('data-aui-modal', 'true');
          $dialog.data({
            'aui-remove-on-hide': true,
            'extension': sanitizedOptions.extension
          });
          $dialog.addClass('aui-layer aui-dialog2 ' + DIALOG_CLASS);

          if (_.contains(DIALOG_SIZES, sanitizedOptions.size)) {
            $dialog.addClass('aui-dialog2-' + sanitizedOptions.size);
          }

          if (sanitizedOptions.size === 'fullscreen' || sanitizedOptions.size === 'maximum') {
            if (sanitizedOptions.chrome) {
              $dialog.addClass('ap-header-controls');
            }
            $dialog.addClass('aui-dialog2-maximum');
          }

          $dialog.append(this._renderContent(sanitizedOptions.$content));

          if (sanitizedOptions.chrome) {
            $dialog.prepend(this._renderHeader({
              header: sanitizedOptions.header,
              actions: sanitizedOptions.actions,
              size: sanitizedOptions.size
            }));

            $dialog.append(this._renderFooter({
              extension: sanitizedOptions.extension,
              actions: sanitizedOptions.actions,
              hint: sanitizedOptions.hint,
              size: sanitizedOptions.size
            }));
          } else {
            $dialog.addClass('aui-dialog2-chromeless');
          }

          var dialog = AJS.dialog2($dialog);
          dialog._id = sanitizedOptions.id;
          if (sanitizedOptions.size === 'fullscreen') {
            sanitizedOptions.height = sanitizedOptions.width = '100%';
          }
          if (!sanitizedOptions.size || sanitizedOptions.size === 'fullscreen') {
            AJS.layer($dialog).changeSize(sanitizedOptions.width, sanitizedOptions.height);
          }
          dialog.show();
          dialog.$el.data('extension', sanitizedOptions.extension);
          return $dialog;
        }
      }, {
        key: 'setIframeDimensions',
        value: function setIframeDimensions($iframe) {
          IframeComponent.resize('100%', '100%', $iframe);
        }
      }, {
        key: 'getActive',
        value: function getActive() {
          return getActiveDialog$1();
        }
      }, {
        key: 'buttonIsEnabled',
        value: function buttonIsEnabled(identifier) {
          var dialog = getActiveDialog$1();
          if (dialog) {
            var $button = getButtonByIdentifier(identifier, dialog.$el);
            return ButtonComponent.isEnabled($button);
          }
        }
      }, {
        key: 'buttonIsVisible',
        value: function buttonIsVisible(identifier) {
          var dialog = getActiveDialog$1();
          if (dialog) {
            var $button = getButtonByIdentifier(identifier, dialog.$el);
            return ButtonComponent.isVisible($button);
          }
        }

        /**
        * takes either a target spec or a filter function
        * returns all matching dialogs
        */

      }, {
        key: 'getByExtension',
        value: function getByExtension(extension) {
          var filterFunction;
          if (typeof extension === 'function') {
            filterFunction = extension;
          } else {
            var keys = Object.getOwnPropertyNames(extension);
            filterFunction = function filterFunction(dialog) {
              var dialogData = $(dialog).data('extension');
              return keys.every(function (key) {
                return dialogData[key] === extension[key];
              });
            };
          }

          return $('.' + DIALOG_CLASS).toArray().filter(filterFunction).map(function ($el) {
            return AJS.dialog2($el);
          });
        }

        // add user defined button to an existing dialog

      }, {
        key: 'addButton',
        value: function addButton(extension, options) {
          options.custom = true;
          var $button = this._renderDialogButton(options, extension);
          var $dialog = this.getByExtension({
            addon_key: extension.addon_key,
            key: extension.key
          })[0].$el;
          var $actionBar = getActionBar($dialog);
          $actionBar.append($button);
          return $dialog;
        }
      }]);
      return Dialog;
    }();

    var DialogComponent = new Dialog$1();

    EventDispatcher$1.register('iframe-bridge-established', function (data) {
      if (data.extension.options.isDialog && !data.extension.options.preventDialogCloseOnEscape) {
        DomEventActions.registerKeyEvent({
          extension_id: data.extension.id,
          key: 27,
          callback: function callback() {
            DialogActions.close({
              dialog: getActiveDialog$1(),
              extension: data.extension
            });
          }
        });

        EventDispatcher$1.registerOnce('dialog-close', function (d) {
          DomEventActions.unregisterKeyEvent({
            extension_id: data.extension.id,
            key: 27
          });
        });
      }
    });

    EventDispatcher$1.register('dialog-close-active', function (data) {
      var activeDialog = getActiveDialog$1();
      if (activeDialog) {
        DialogActions.close({
          customData: data.customData,
          dialog: activeDialog,
          extension: data.extension
        });
      }
    });

    EventDispatcher$1.register('dialog-close', function (data) {
      data.dialog.hide();
    });

    EventDispatcher$1.register('dialog-button-toggle', function (data) {
      var dialog = getActiveDialog$1();
      if (dialog) {
        var $button = getButtonByIdentifier(data.identifier, dialog.$el);
        ButtonActions.toggle($button, !data.enabled);
      }
    });

    EventDispatcher$1.register('dialog-button-toggle-visibility', function (data) {
      var dialog = getActiveDialog$1();
      if (dialog) {
        var $button = getButtonByIdentifier(data.identifier, dialog.$el);
        ButtonActions.toggleVisibility($button, data.hidden);
      }
    });

    EventDispatcher$1.register('button-clicked', function (data) {
      var $button = data.$el;
      if ($button.hasClass(DIALOG_BUTTON_CLASS)) {
        var $dialog = $button.parents('.' + DIALOG_CLASS);
        var $iframe = $dialog.find('iframe');
        if ($iframe.length && $iframe[0].bridgeEstablished) {
          DialogActions.clickButton(ButtonComponent.getIdentifier($button), $button, $dialog.data('extension'));
        } else {
          DialogActions.close({
            dialog: getActiveDialog$1(),
            extension: $button.extension
          });
        }
      }
    });

    EventDispatcher$1.register('iframe-create', function (data) {
      if (data.extension.options && data.extension.options.isDialog) {
        DialogComponent.setIframeDimensions(data.extension.$el);
      }
    });

    EventDispatcher$1.register('dialog-button-add', function (data) {
      DialogComponent.addButton(data.extension, data.button);
    });

    DomEventActions.registerWindowKeyEvent({
      keyCode: 27,
      callback: function callback() {
        DialogActions.closeActive({
          customData: {},
          extension: null
        });
      }
    });

    var CONTAINER_CLASSES$1 = ['ap-iframe-container'];

    var IframeContainer = function () {
      function IframeContainer() {
        classCallCheck(this, IframeContainer);
      }

      createClass$1(IframeContainer, [{
        key: 'createExtension',
        value: function createExtension(extension, options) {
          var $container = this._renderContainer();
          if (!options || options.loadingIndicator !== false) {
            $container.append(this._renderLoadingIndicator());
          }
          IframeComponent.simpleXdmExtension(extension, $container);
          return $container;
        }
      }, {
        key: '_renderContainer',
        value: function _renderContainer(attributes) {
          var container = $('<div />').attr(attributes || {});
          container.addClass(CONTAINER_CLASSES$1.join(' '));
          return container;
        }
      }, {
        key: '_renderLoadingIndicator',
        value: function _renderLoadingIndicator() {
          return LoadingComponent.render();
        }
      }]);
      return IframeContainer;
    }();

    var IframeContainerComponent = new IframeContainer();

    EventDispatcher$1.register('iframe-create', function (data) {
      var id = 'embedded-' + data.extension.id;
      data.extension.$el.parents('.ap-iframe-container').attr('id', id);
    });

    var DialogExtension = function () {
      function DialogExtension() {
        classCallCheck(this, DialogExtension);
      }

      createClass$1(DialogExtension, [{
        key: 'render',
        value: function render(extension, dialogOptions) {
          extension.options = extension.options || {};
          dialogOptions = dialogOptions || {};
          extension.options.isDialog = true;
          extension.options.dialogId = dialogOptions.id;
          extension.options.preventDialogCloseOnEscape = dialogOptions.closeOnEscape === false;
          var $iframeContainer = IframeContainerComponent.createExtension(extension);
          var $dialog = DialogComponent.render({
            extension: extension,
            $content: $iframeContainer,
            chrome: dialogOptions.chrome,
            width: dialogOptions.width,
            height: dialogOptions.height,
            size: dialogOptions.size,
            header: dialogOptions.header,
            hint: dialogOptions.hint,
            submitText: dialogOptions.submitText,
            cancelText: dialogOptions.cancelText,
            buttons: dialogOptions.buttons
          });
          return $dialog;
        }
      }, {
        key: 'getActiveDialog',
        value: function getActiveDialog() {
          return DialogComponent.getActive();
        }
      }, {
        key: 'buttonIsEnabled',
        value: function buttonIsEnabled(identifier) {
          return DialogComponent.buttonIsEnabled(identifier);
        }
      }, {
        key: 'buttonIsVisible',
        value: function buttonIsVisible(identifier) {
          return DialogComponent.buttonIsVisible(identifier);
        }
      }, {
        key: 'getByExtension',
        value: function getByExtension(extension) {
          if (typeof extension === 'string') {
            extension = {
              id: extension
            };
          }
          return DialogComponent.getByExtension(extension);
        }
      }]);
      return DialogExtension;
    }();

    var DialogExtensionComponent = new DialogExtension();
    EventDispatcher$1.register('dialog-extension-open', function (data) {
      DialogExtensionComponent.render(data.extension, data.options);
    });

    var _dialogs = {};

    EventDispatcher$1.register('dialog-close', function (data) {
      var dialog = data.dialog;
      if (dialog && data.extension) {
        EventActions.broadcast('dialog.close', {
          addon_key: data.extension.addon_key
        }, data.customData);
      }
    });

    EventDispatcher$1.register('dialog-button-click', function (data) {
      var eventData = {
        button: {
          name: ButtonComponent.getName(data.$el),
          identifier: ButtonComponent.getIdentifier(data.$el),
          text: ButtonComponent.getText(data.$el)
        }
      };
      var eventName = 'dialog.button.click';

      // Old buttons, (submit and cancel) use old events
      if (!data.$el.hasClass('ap-dialog-custom-button')) {
        eventName = 'dialog.' + eventData.button.name;
      }

      EventActions.broadcast(eventName, {
        addon_key: data.extension.addon_key,
        key: data.extension.key
      }, eventData);
    });

    /**
     * @class Dialog~Dialog
     * @description A dialog object that is returned when a dialog is created using the [dialog module](module-Dialog.html).
     */

    var Dialog = function Dialog(options, callback) {
      classCallCheck(this, Dialog);

      callback = _.last(arguments);
      var _id = callback._id;
      var extension = callback._context.extension;

      var dialogExtension = {
        addon_key: extension.addon_key,
        key: options.key,
        options: _.pick(callback._context.extension.options, ['customData', 'productContext'])
      };

      // ACJS-185: the following is a really bad idea but we need it
      // for compat until AP.dialog.customData has been deprecated
      dialogExtension.options.customData = options.customData;
      // terrible idea! - we need to remove this from p2 ASAP!
      var dialogModuleOptions = dialogUtilsInstance.moduleOptionsFromGlobal(dialogExtension.addon_key, dialogExtension.key);
      options = _.extend({}, dialogModuleOptions || {}, options);
      options.id = _id;

      DialogExtensionActions.open(dialogExtension, options);
      this.customData = options.customData;
      _dialogs[_id] = this;
    };

    /**
     * @class Dialog~DialogButton
     * @description A dialog button that can be controlled with JavaScript
     */


    var Button = function () {
      function Button(identifier) {
        classCallCheck(this, Button);

        if (!DialogExtensionComponent.getActiveDialog()) {
          throw new Error('Failed to find an active dialog.');
        }
        this.name = identifier;
        this.identifier = identifier;
        this.enabled = DialogExtensionComponent.buttonIsEnabled(identifier);
        this.hidden = !DialogExtensionComponent.buttonIsVisible(identifier);
      }
      /**
       * Sets the button state to enabled
       * @method enable
       * @memberOf Dialog~DialogButton
       * @noDemo
       * @example
       * AP.dialog.getButton('submit').enable();
       */


      createClass$1(Button, [{
        key: 'enable',
        value: function enable() {
          this.setState({
            enabled: true
          });
        }
        /**
         * Sets the button state to disabled. A disabled button cannot be clicked and emits no events.
         * @method disable
         * @memberOf Dialog~DialogButton
         * @noDemo
         * @example
         * AP.dialog.getButton('submit').disable();
         */

      }, {
        key: 'disable',
        value: function disable() {
          this.setState({
            enabled: false
          });
        }
        /**
         * Query a button for its current state.
         * @method isEnabled
         * @memberOf Dialog~DialogButton
         * @param {Function} callback function to receive the button state.
         * @noDemo
         * @example
         * AP.dialog.getButton('submit').isEnabled(function(enabled){
         *   if(enabled){
         *     //button is enabled
         *   }
         * });
         */

      }, {
        key: 'isEnabled',
        value: function isEnabled(callback) {
          callback = _.last(arguments);
          callback(this.enabled);
        }
        /**
         * Toggle the button state between enabled and disabled.
         * @method toggle
         * @memberOf Dialog~DialogButton
         * @noDemo
         * @example
         * AP.dialog.getButton('submit').toggle();
         */

      }, {
        key: 'toggle',
        value: function toggle() {
          this.setState({
            enabled: !this.enabled
          });
        }
      }, {
        key: 'setState',
        value: function setState(state) {
          this.enabled = state.enabled;
          DialogActions.toggleButton({
            identifier: this.identifier,
            enabled: this.enabled
          });
        }
        /**
         * Trigger a callback bound to a button.
         * @method trigger
         * @memberOf Dialog~DialogButton
         * @noDemo
         * @example
         * AP.dialog.getButton('submit').bind(function(){
         *   alert('clicked!');
         * });
         * AP.dialog.getButton('submit').trigger();
         */

      }, {
        key: 'trigger',
        value: function trigger(callback) {
          callback = _.last(arguments);
          if (this.enabled) {
            DialogActions.dialogMessage({
              name: this.name,
              extension: callback._context.extension
            });
          }
        }

        /**
         * Query a button for its current hidden/visible state.
         * @method isHidden
         * @memberOf Dialog~DialogButton
         * @param {Function} callback function to receive the button state.
         * @noDemo
         * @example
         * AP.dialog.getButton('submit').isHidden(function(hidden){
         *   if(hidden){
         *     //button is hidden
         *   }
         * });
         */

      }, {
        key: 'isHidden',
        value: function isHidden(callback) {
          callback = _.last(arguments);
          callback(this.hidden);
        }
        /**
         * Sets the button state to hidden
         * @method hide
         * @memberOf Dialog~DialogButton
         * @noDemo
         * @example
         * AP.dialog.getButton('submit').hide();
         */

      }, {
        key: 'hide',
        value: function hide() {
          this.setHidden(true);
        }
        /**
         * Sets the button state to visible
         * @method show
         * @memberOf Dialog~DialogButton
         * @noDemo
         * @example
         * AP.dialog.getButton('submit').show();
         */

      }, {
        key: 'show',
        value: function show() {
          this.setHidden(false);
        }
      }, {
        key: 'setHidden',
        value: function setHidden(hidden) {
          this.hidden = hidden;
          DialogActions.toggleButtonVisibility({
            identifier: this.identifier,
            hidden: this.hidden
          });
        }
      }]);
      return Button;
    }();

    function getDialogFromContext(context) {
      return _dialogs[context.extension.options.dialogId];
    }

    var CreateButton = function CreateButton(options, callback) {
      classCallCheck(this, CreateButton);

      callback = _.last(arguments);
      DialogExtensionActions.addUserButton({
        identifier: options.identifier,
        text: options.text
      }, callback._context.extension);
    };

    /**
     * The Dialog module provides a mechanism for launching an add-on's modules as modal dialogs from within an add-on's iframe.
     *
     * A modal dialog displays information without requiring the user to leave the current page.
     *
     * The dialog is opened over the entire window, rather than within the iframe itself.
     *
     * <h3>Styling your dialog to look like a standard Atlassian dialog</h3>
     *
     * By default the dialog iframe is undecorated. It's up to you to style the dialog.
     * <img src="../assets/images/connectdialogchromelessexample.jpeg" width="100%" />
     *
     * In order to maintain a consistent look and feel between the host application and the add-on, we encourage you to style your dialogs to match Atlassian's Design Guidelines for modal dialogs.
     *
     * To do that, you'll need to add the AUI styles to your dialog.
     *
     * For more information, read about the Atlassian User Interface [dialog component](https://docs.atlassian.com/aui/latest/docs/dialog.html).
     * @exports Dialog
     */


    var dialog = {
      /**
       * @class Dialog~DialogOptions
       * @description The options supplied to a [dialog.create()](module-Dialog.html) call.
       *
       * @property {String}        key         The module key of a dialog, or the key of a page or web-item that you want to open as a dialog.
       * @property {String}        size        Opens the dialog at a preset size: small, medium, large, x-large or fullscreen (with chrome).
       * @property {Number|String} width       if size is not set, define the width as a percentage (append a % to the number) or pixels.
       * @property {Number|String} height      if size is not set, define the height as a percentage (append a % to the number) or pixels.
       * @property {Boolean}       chrome      (optional) opens the dialog with heading and buttons.
       * @property {String}        header      (optional) text to display in the header if opening a dialog with chrome.
       * @property {String}        submitText  (optional) text for the submit button if opening a dialog with chrome.
       * @property {String}        cancelText  (optional) text for the cancel button if opening a dialog with chrome.
       * @property {Object}        customData  (optional) custom data object that can be accessed from the actual dialog iFrame.
       * @property {Boolean}       closeOnEscape (optional) if true, pressing ESC will close the dialog (default is true).
       * @property {Array}         buttons     (optional) an array of custom buttons to be added to the dialog if opening a dialog with chrome.
       */

      /**
       * Creates a dialog for a common dialog, page or web-item module key.
       * @param {Dialog~DialogOptions} options configuration object of dialog options.
       * @method create
       * @noDemo
       * @example
       * AP.dialog.create({
       *   key: 'my-module-key',
       *   width: '500px',
       *   height: '200px',
       *   chrome: true,
       *   buttons: [
       *     {
       *       text: 'my button',
       *       identifier: 'my_unique_identifier'
       *     }
       *   ]
       * }).on("close", callbackFunc);
       *
       * @return {Dialog~Dialog} Dialog object allowing for callback registrations
       */
      create: {
        constructor: Dialog
      },
      /**
       * Closes the currently open dialog. Optionally pass data to listeners of the `dialog.close` event.
       * This will only close a dialog that has been opened by your add-on.
       * You can register for close events using the `dialog.close` event and the [events module](module-Events.html).
       * @param {Object} data An object to be emitted on dialog close.
       * @noDemo
       * @example
       * AP.dialog.close({foo: 'bar'});
       */
      close: function close(data, callback) {
        callback = _.last(arguments);
        var dialogToClose;
        if (callback._context.extension.options.isDialog) {
          dialogToClose = DialogExtensionComponent.getByExtension(callback._context.extension.id)[0];
        } else {
          dialogToClose = DialogExtensionComponent.getActiveDialog();
        }

        DialogActions.close({
          customData: data,
          dialog: dialogToClose,
          extension: callback._context.extension
        });
      },
      /**
       * Passes the custom data Object to the specified callback function.
       * @noDemo
       * @name getCustomData
       * @method
       * @param {Function} callback - Callback method to be executed with the custom data.
       * @example
       * AP.dialog.getCustomData(function (customData) {
       *   console.log(customData);
       * });
       *
       */
      getCustomData: function getCustomData(callback) {
        callback = _.last(arguments);
        var dialog = getDialogFromContext(callback._context);
        if (dialog) {
          callback(dialog.customData);
        } else {
          callback(undefined);
        }
      },
      /**
       * Returns the button that was requested (either cancel or submit). If the requested button does not exist, an empty Object will be returned instead.
       * @method getButton
       * @returns {Dialog~DialogButton}
       * @noDemo
       * @example
       * AP.dialog.getButton('submit');
       */
      getButton: {
        constructor: Button,
        enable: Button.prototype.enable,
        disable: Button.prototype.disable,
        toggle: Button.prototype.toggle,
        isEnabled: Button.prototype.isEnabled,
        trigger: Button.prototype.trigger,
        hide: Button.prototype.hide,
        show: Button.prototype.show,
        isHidden: Button.prototype.isHidden
      },
      /**
       * Creates a dialog button that can be controlled with javascript
       * @method createButton
       * @returns {Dialog~DialogButton}
       * @noDemo
       * @example
       * AP.dialog.createButton({
       *   text: 'button text',
       *   identifier: 'button.1'
       * }).bind(function mycallback(){});
       */
      createButton: {
        constructor: CreateButton
      }
    };

    EventDispatcher$1.register('iframe-resize', function (data) {
      IframeComponent.resize(data.width, data.height, data.$el);
    });

    EventDispatcher$1.register('iframe-size-to-parent', function (data) {
      var height;
      var $el = util$1.getIframeByExtensionId(data.context.extension_id);
      if (data.hideFooter) {
        $el.addClass('full-size-general-page-no-footer');
        $('.ac-content-page #footer').css({ display: 'none' });
        $('.ac-content-page').css({ overflow: 'hidden' });
        height = $(document).height() - $('#header > nav').outerHeight();
      } else {
        height = $(document).height() - $('#header > nav').outerHeight() - $('#footer').outerHeight() - 1; //1px comes from margin given by full-size-general-page
        $el.removeClass('full-size-general-page-no-footer');
        $('.ac-content-page #footer').css({ display: 'block' });
      }

      EventDispatcher$1.dispatch('iframe-resize', { width: '100%', height: height + 'px', $el: $el });
    });

    $('body').on('resize', function (e) {
      EventDispatcher$1.dispatch('host-window-resize', e);
    });

    var EnvActions = {
      iframeResize: function iframeResize(width, height, context) {
        var $el;
        if (context.extension_id) {
          $el = util$1.getIframeByExtensionId(context.extension_id);
        } else {
          $el = context;
        }

        EventDispatcher$1.dispatch('iframe-resize', { width: width, height: height, $el: $el, extension: context.extension });
      },
      sizeToParent: function sizeToParent(context, hideFooter) {
        EventDispatcher$1.dispatch('iframe-size-to-parent', {
          hideFooter: hideFooter,
          context: context
        });
      }
    };

    var debounce = function (fn, wait) {
      var timeout;
      return function () {
        var ctx = this;
        var args = [].slice.call(arguments);
        function later() {
          timeout = null;
          fn.apply(ctx, args);
        }
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait || 50);
      };
    };

    var resizeFuncHolder = {};
    /**
     * Utility methods that are available without requiring additional modules.
     * @exports AP
     */
    var env = {
      /**
       * Get the location of the current page of the host product.
       *
       * @param {Function} callback function (location) {...}
       * @example
       * AP.getLocation(function(location){
       *   alert(location);
       * });
       */
      getLocation: function getLocation(callback) {
        callback = _.last(arguments);
        callback(window.location.href);
      },
      /**
       * Resize the iframe to a specified width and height.
       *
       * Only content within an element with the class `ac-content` will be resized automatically.
       * Content without this identifier is sized according to the `body` element, and will dynamically grow, but not shrink.
       * ```
       * <div class="ac-content">
         * <p>Hello World</p>
       * </div>
       * ```
       * Note that this method cannot be used in dialogs.
       *
       * @method
       * @param {String} width   the desired width
       * @param {String} height  the desired height
       */
      resize: function resize(width, height, callback) {
        callback = _.last(arguments);
        var iframeId = callback._context.extension.id;
        var options = callback._context.extension.options;
        if (options && options.isDialog) {
          return;
        }

        if (!resizeFuncHolder[iframeId]) {
          resizeFuncHolder[iframeId] = debounce(function (dwidth, dheight, dcallback) {
            EnvActions.iframeResize(dwidth, dheight, dcallback._context);
          }, 50);
        }

        resizeFuncHolder[iframeId](width, height, callback);
      },
      /**
       * Resize the iframe, so that it takes the entire page. Add-on may define to hide the footer using data-options.
       *
       * Note that this method is only available for general page modules.
       *
       * @method
       * @param {boolean} hideFooter true if the footer is supposed to be hidden
       */
      sizeToParent: debounce(function (hideFooter, callback) {
        callback = _.last(arguments);
        // sizeToParent is only available for general-pages
        if (callback._context.extension.options.isFullPage) {
          // This adds border between the iframe and the page footer as the connect addon has scrolling content and can't do this
          util$1.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page');
          EventDispatcher$1.register('host-window-resize', function (data) {
            EnvActions.sizeToParent(callback._context, hideFooter);
          });
          EnvActions.sizeToParent(callback._context, hideFooter);
        } else {
          // This is only here to support integration testing
          // see com.atlassian.plugin.connect.test.pageobjects.RemotePage#isNotFullSize()
          util$1.getIframeByExtensionId(callback._context.extension_id).addClass('full-size-general-page-fail');
        }
      })
    };

    EventDispatcher$1.register('after:iframe-unload', function (data) {
      delete resizeFuncHolder[data.extension.id];
    });

    var InlineDialogActions = {
      hide: function hide($el) {
        EventDispatcher$1.dispatch('inline-dialog-hide', {
          $el: $el
        });
      },
      refresh: function refresh($el) {
        EventDispatcher$1.dispatch('inline-dialog-refresh', { $el: $el });
      },
      hideTriggered: function hideTriggered(extension_id, $el) {
        EventDispatcher$1.dispatch('inline-dialog-hidden', { extension_id: extension_id, $el: $el });
      },
      close: function close() {
        EventDispatcher$1.dispatch('inline-dialog-close', {});
      },
      created: function created(data) {
        EventDispatcher$1.dispatch('inline-dialog-opened', {
          $el: data.$el,
          trigger: data.trigger,
          extension: data.extension
        });
      }
    };

    /**
     * The inline dialog is a wrapper for secondary content/controls to be displayed on user request. Consider this component as displayed in context to the triggering control with the dialog overlaying the page content.
     * A inline dialog should be preferred over a modal dialog when a connection between the action has a clear benefit versus having a lower user focus.
     *
     * Inline dialogs can be shown via a [web item target](../modules/common/web-item.html#target).
     *
     * For more information, read about the Atlassian User Interface [inline dialog component](https://docs.atlassian.com/aui/latest/docs/inline-dialog.html).
     * @module inline-dialog
     */

    var inlineDialog = {
      /**
       * Hide the inline dialog that contains the iframe where this method is called from.
       * @memberOf module:inline-dialog
       * @method hide
       * @noDemo
       * @example
       * AP.inlineDialog.hide();
       */
      hide: function hide(callback) {
        InlineDialogActions.close();
      }
    };

    var AnalyticsAction = {
      trackDeprecatedMethodUsed: function trackDeprecatedMethodUsed(methodUsed, extension) {
        EventDispatcher$1.dispatch('analytics-deprecated-method-used', { methodUsed: methodUsed, extension: extension });
      }
    };

    /**
    * Messages are the primary method for providing system feedback in the product user interface.
    * Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
    * For visual examples of each kind please see the [Design guide](https://developer.atlassian.com/design/latest/communicators/messages/).
    * ### Example ###
    * ```
    * //create a message
    * var message = AP.messages.info('plain text title', 'plain text body');
    * ```
    * @deprecated Please use the [Flag module](module-Flag.html) instead.
    * @name messages
    * @module
    */

    var MESSAGE_BAR_ID = 'ac-message-container';
    var MESSAGE_TYPES = ['generic', 'error', 'warning', 'success', 'info', 'hint'];
    var MSGID_PREFIX = 'ap-message-';
    var MSGID_REGEXP = new RegExp('^' + MSGID_PREFIX + '[0-9A-fa-f]+$');
    var _messages = {};

    function validateMessageId(msgId) {
      return MSGID_REGEXP.test(msgId);
    }

    function getMessageBar() {
      var $msgBar = $('#' + MESSAGE_BAR_ID);

      if ($msgBar.length < 1) {
        $msgBar = $('<div id="' + MESSAGE_BAR_ID + '" />').appendTo('body');
      }
      return $msgBar;
    }

    function filterMessageOptions(options) {
      var copy = {};
      var allowed = ['closeable', 'fadeout', 'delay', 'duration', 'id'];
      if (_.isObject(options)) {
        allowed.forEach(function (key) {
          if (key in options) {
            copy[key] = options[key];
          }
        });
      }
      return copy;
    }

    function showMessage(name, title, body, options) {
      var $msgBar = getMessageBar();
      options = filterMessageOptions(options);
      $.extend(options, {
        title: title,
        body: AJS.escapeHtml(body)
      });

      if (MESSAGE_TYPES.indexOf(name) < 0) {
        throw 'Invalid message type. Must be: ' + MESSAGE_TYPES.join(', ');
      }
      if (validateMessageId(options.id)) {
        AJS.messages[name]($msgBar, options);
        // Calculate the left offset based on the content width.
        // This ensures the message always stays in the centre of the window.
        $msgBar.css('margin-left', '-' + $msgBar.innerWidth() / 2 + 'px');
      }
    }

    function deprecatedShowMessage(name, title, body, options, callback) {
      var methodUsed = 'AP.messages.' + name;
      console.warn('DEPRECATED API - AP.messages.' + name + ' has been deprecated since ACJS 5.0 and will be removed in a future release. Use AP.flag.create instead.');
      AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
      showMessage(name, title, body, options);
    }

    $(document).on('aui-message-close', function (e, $msg) {
      var _id = $msg.attr('id').replace(MSGID_PREFIX, '');
      if (_messages[_id]) {
        if ($.isFunction(_messages[_id].onCloseTrigger)) {
          _messages[_id].onCloseTrigger();
        }
        _messages[_id]._destroy();
      }
    });

    function messageModule(messageType) {
      return {
        constructor: function constructor(title, body, options, callback) {
          callback = _.last(arguments);
          var _id = callback._id;
          if (typeof title !== 'string') {
            title = '';
          }
          if (typeof body !== 'string') {
            body = '';
          }
          if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
            options = {};
          }
          options.id = MSGID_PREFIX + _id;
          deprecatedShowMessage(messageType, title, body, options, callback);
          _messages[_id] = this;
        }
      };
    }

    var messages = {
      /**
      * Close a message
      * @deprecated Please use the [Flag module](module-Flag.html) instead.
      * @name clear
      * @method
      * @memberof module:messages#
      * @param    {String}    id  The id that was returned when the message was created.
      * @example
      * //create a message
      * var message = AP.messages.info('title', 'body');
      * setTimeout(function(){
      *   AP.messages.clear(message);
      * }, 2000);
      */
      clear: function clear(msg) {
        var id = MSGID_PREFIX + msg._id;
        if (validateMessageId(id)) {
          $('#' + id).closeMessage();
        }
      },

      /**
      * Trigger an event when a message is closed
      * @deprecated Please use the [Flag module](module-Flag.html) instead.
      * @name onClose
      * @method
      * @memberof module:messages#
      * @param    {String}    id  The id that was returned when the message was created.
      * @param    {Function}  callback  The function that is run when the event is triggered
      * @example
      * //create a message
      * var message = AP.messages.info('title', 'body');
      * AP.messages.onClose(message, function() {
      *   console.log(message, ' has been closed!');
      * });
      */
      onClose: function onClose(msg, callback) {
        callback = _.last(arguments);
        var id = msg._id;
        if (_messages[id]) {
          _messages[id].onCloseTrigger = callback;
        }
      },

      /**
      * Show a generic message
      * @deprecated Please use the [Flag module](module-Flag.html) instead.
      * @name generic
      * @method
      * @memberof module:messages#
      * @param    {String}            title       Sets the title text of the message.
      * @param    {String}            body        The main content of the message.
      * @param    {Object}            options             Message Options
      * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
      * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
      * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
      * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
      * @returns  {String}    The id to be used when clearing the message
      * @example
      * //create a message
      * var message = AP.messages.generic('title', 'generic message example');
      */
      generic: messageModule('generic'),

      /**
      * Show an error message
      * @deprecated Please use the [Flag module](module-Flag.html) instead.
      * @name error
      * @method
      * @memberof module:messages#
      * @param    {String}            title       Sets the title text of the message.
      * @param    {String}            body        The main content of the message.
      * @param    {Object}            options             Message Options
      * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
      * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
      * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
      * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
      * @returns  {String}    The id to be used when clearing the message
      * @example
      * //create a message
      * var message = AP.messages.error('title', 'error message example');
      */
      error: messageModule('error'),

      /**
      * Show a warning message
      * @deprecated Please use the [Flag module](module-Flag.html) instead.
      * @name warning
      * @method
      * @memberof module:messages#
      * @param    {String}            title       Sets the title text of the message.
      * @param    {String}            body        The main content of the message.
      * @param    {Object}            options             Message Options
      * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
      * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
      * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
      * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
      * @returns  {String}    The id to be used when clearing the message
      * @example
      * //create a message
      * var message = AP.messages.warning('title', 'warning message example');
      */
      warning: messageModule('warning'),

      /**
      * Show a success message
      * @deprecated Please use the [Flag module](module-Flag.html) instead.
      * @name success
      * @method
      * @memberof module:messages#
      * @param    {String}            title       Sets the title text of the message.
      * @param    {String}            body        The main content of the message.
      * @param    {Object}            options             Message Options
      * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
      * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
      * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
      * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
      * @returns  {String}    The id to be used when clearing the message
      * @example
      * //create a message
      * var message = AP.messages.success('title', 'success message example');
      */
      success: messageModule('success'),

      /**
      * Show an info message
      * @deprecated Please use the [Flag module](module-Flag.html) instead.
      * @name info
      * @method
      * @memberof module:messages#
      * @param    {String}            title       Sets the title text of the message.
      * @param    {String}            body        The main content of the message.
      * @param    {Object}            options             Message Options
      * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
      * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
      * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
      * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
      * @returns  {String}    The id to be used when clearing the message
      * @example
      * //create a message
      * var message = AP.messages.info('title', 'info message example');
      */
      info: messageModule('info'),

      /**
      * Show a hint message
      * @deprecated Please use the [Flag module](module-Flag.html) instead.
      * @name hint
      * @method
      * @memberof module:messages#
      * @param    {String}            title               Sets the title text of the message.
      * @param    {String}            body                The main content of the message.
      * @param    {Object}            options             Message Options
      * @param    {Boolean}           options.closeable   Adds a control allowing the user to close the message, removing it from the page.
      * @param    {Boolean}           options.fadeout     Toggles the fade away on the message
      * @param    {Number}            options.delay       Time to wait (in ms) before starting fadeout animation (ignored if fadeout==false)
      * @param    {Number}            options.duration    Fadeout animation duration in milliseconds (ignored if fadeout==false)
      * @returns  {String}    The id to be used when clearing the message
      * @example
      * //create a message
      * var message = AP.messages.hint('title', 'hint message example');
      */
      hint: messageModule('hint')
    };

    var FlagActions = {
      open: function open(flagId) {
        EventDispatcher$1.dispatch('flag-open', { id: flagId });
      },
      //called to close a flag
      close: function close(flagId) {
        EventDispatcher$1.dispatch('flag-close', { id: flagId });
      },
      //called by AUI when closed
      closed: function closed(flagId) {
        EventDispatcher$1.dispatch('flag-closed', { id: flagId });
      }
    };

    !function (root, factory) {
        "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = factory(require("babel-runtime/core-js/object/get-prototype-of"), require("babel-runtime/helpers/classCallCheck"), require("babel-runtime/helpers/createClass"), require("babel-runtime/helpers/possibleConstructorReturn"), require("babel-runtime/helpers/inherits"), require("react"), require("@atlaskit/button"), require("@atlaskit/icon/glyph/cancel"), require("babel-runtime/helpers/defineProperty"), require("classnames")) : "function" == typeof define && define.amd ? define(["babel-runtime/core-js/object/get-prototype-of", "babel-runtime/helpers/classCallCheck", "babel-runtime/helpers/createClass", "babel-runtime/helpers/possibleConstructorReturn", "babel-runtime/helpers/inherits", "react", "@atlaskit/button", "@atlaskit/icon/glyph/cancel", "babel-runtime/helpers/defineProperty", "classnames"], factory) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports["@atlaskit/flag"] = factory(require("babel-runtime/core-js/object/get-prototype-of"), require("babel-runtime/helpers/classCallCheck"), require("babel-runtime/helpers/createClass"), require("babel-runtime/helpers/possibleConstructorReturn"), require("babel-runtime/helpers/inherits"), require("react"), require("@atlaskit/button"), require("@atlaskit/icon/glyph/cancel"), require("babel-runtime/helpers/defineProperty"), require("classnames")) : root["@atlaskit/flag"] = factory(root["babel-runtime/core-js/object/get-prototype-of"], root["babel-runtime/helpers/classCallCheck"], root["babel-runtime/helpers/createClass"], root["babel-runtime/helpers/possibleConstructorReturn"], root["babel-runtime/helpers/inherits"], root.react, root["@atlaskit/button"], root["@atlaskit/icon/glyph/cancel"], root["babel-runtime/helpers/defineProperty"], root.classnames);
    }(undefined, function (__WEBPACK_EXTERNAL_MODULE_9__, __WEBPACK_EXTERNAL_MODULE_10__, __WEBPACK_EXTERNAL_MODULE_11__, __WEBPACK_EXTERNAL_MODULE_12__, __WEBPACK_EXTERNAL_MODULE_13__, __WEBPACK_EXTERNAL_MODULE_14__, __WEBPACK_EXTERNAL_MODULE_15__, __WEBPACK_EXTERNAL_MODULE_20__, __WEBPACK_EXTERNAL_MODULE_25__, __WEBPACK_EXTERNAL_MODULE_26__) {
        /******/
        return function (modules) {
            /******/
            /******/
            // The require function
            /******/
            function __webpack_require__(moduleId) {
                /******/
                /******/
                // Check if module is in cache
                /******/
                if (installedModules[moduleId]) /******/
                    return installedModules[moduleId].exports;
                /******/
                /******/
                // Create a new module (and put it into the cache)
                /******/
                var module = installedModules[moduleId] = {
                    /******/
                    exports: {},
                    /******/
                    id: moduleId,
                    /******/
                    loaded: !1
                };
                /******/
                /******/
                // Return the exports of the module
                /******/
                /******/
                /******/
                // Execute the module function
                /******/
                /******/
                /******/
                // Flag the module as loaded
                /******/
                return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), module.loaded = !0, module.exports;
            }
            // webpackBootstrap
            /******/
            // The module cache
            /******/
            var installedModules = {};
            /******/
            /******/
            // Load entry module and return exports
            /******/
            /******/
            /******/
            /******/
            // expose the modules object (__webpack_modules__)
            /******/
            /******/
            /******/
            // expose the module cache
            /******/
            /******/
            /******/
            // __webpack_public_path__
            /******/
            return __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.p = "", __webpack_require__(0);
        }([/* 0 */
        /***/
        function (module, exports, __webpack_require__) {
            module.exports = __webpack_require__(7);
        },,,,,,, /* 1 */
        /* 2 */
        /* 3 */
        /* 4 */
        /* 5 */
        /* 6 */
        /* 7 */
        /***/
        function (module, exports, __webpack_require__) {
            "use strict";

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0
            }), exports.FlagGroup = void 0;
            var _Flag = __webpack_require__(8),
                _Flag2 = _interopRequireDefault(_Flag),
                _FlagGroup = __webpack_require__(21),
                _FlagGroup2 = _interopRequireDefault(_FlagGroup);
            exports.FlagGroup = _FlagGroup2.default, exports.default = _Flag2.default;
        }, /* 8 */
        /***/
        function (module, exports, __webpack_require__) {
            "use strict";

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            var _getPrototypeOf = __webpack_require__(9),
                _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf),
                _classCallCheck2 = __webpack_require__(10),
                _classCallCheck3 = _interopRequireDefault(_classCallCheck2),
                _createClass2 = __webpack_require__(11),
                _createClass3 = _interopRequireDefault(_createClass2),
                _possibleConstructorReturn2 = __webpack_require__(12),
                _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2),
                _inherits2 = __webpack_require__(13),
                _inherits3 = _interopRequireDefault(_inherits2),
                _react = __webpack_require__(14),
                _react2 = _interopRequireDefault(_react),
                _button = __webpack_require__(15),
                _button2 = _interopRequireDefault(_button),
                _Flag = __webpack_require__(16),
                _Flag2 = _interopRequireDefault(_Flag),
                _cancel = __webpack_require__(20),
                _cancel2 = _interopRequireDefault(_cancel),
                Flag = function (_PureComponent) {
                function Flag() {
                    var _ref, _temp, _this, _ret;
                    (0, _classCallCheck3.default)(this, Flag);
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }return _temp = _this = (0, _possibleConstructorReturn3.default)(this, (_ref = Flag.__proto__ || (0, _getPrototypeOf2.default)(Flag)).call.apply(_ref, [this].concat(args))), _this.flagDismissed = function () {
                        _this.props.onDismissed(_this.props.id);
                    }, _this.renderActions = function () {
                        if (!_this.props.actions.length) return null;
                        var items = _this.props.actions.map(function (action, index) {
                            return _react2.default.createElement("div", {
                                className: _Flag2.default.actionsItem,
                                key: index
                            }, _react2.default.createElement(_button2.default, {
                                appearance: "link",
                                className: _Flag2.default.actionButton,
                                onClick: action.onClick,
                                spacing: "none"
                            }, action.content));
                        });
                        return _react2.default.createElement("div", {
                            className: _Flag2.default.actionsContainer
                        }, items);
                    }, _ret = _temp, (0, _possibleConstructorReturn3.default)(_this, _ret);
                }
                return (0, _inherits3.default)(Flag, _PureComponent), (0, _createClass3.default)(Flag, [{
                    key: "render",
                    value: function value() {
                        return _react2.default.createElement("div", {
                            className: _Flag2.default.root,
                            role: "alert",
                            tabIndex: "0"
                        }, _react2.default.createElement("div", {
                            className: _Flag2.default.primaryIcon
                        }, this.props.icon), _react2.default.createElement("div", {
                            className: _Flag2.default.textContent
                        }, _react2.default.createElement("div", {
                            className: _Flag2.default.titleAndDismiss
                        }, _react2.default.createElement("span", {
                            className: _Flag2.default.title
                        }, this.props.title), this.props.isDismissAllowed ? _react2.default.createElement("button", {
                            className: _Flag2.default.dismissIconButton,
                            onClick: this.flagDismissed
                        }, _react2.default.createElement(_cancel2.default, {
                            label: "Dismiss flag"
                        })) : null), this.props.description ? _react2.default.createElement("div", {
                            className: _Flag2.default.description
                        }, this.props.description) : null, this.renderActions()));
                    }
                }]), Flag;
            }(_react.PureComponent);
            Flag.propTypes = {
                actions: _react.PropTypes.arrayOf(_react.PropTypes.shape({
                    content: _react.PropTypes.node,
                    onClick: _react.PropTypes.func
                })),
                description: _react.PropTypes.string,
                icon: _react.PropTypes.element.isRequired,
                id: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
                isDismissAllowed: _react.PropTypes.bool,
                onDismissed: _react.PropTypes.func,
                title: _react.PropTypes.string.isRequired
            }, Flag.defaultProps = {
                actions: [],
                isDismissAllowed: !1,
                onDismissed: function onDismissed() {}
            }, exports.default = Flag;
        }, /* 9 */
        /***/
        function (module, exports) {
            module.exports = __WEBPACK_EXTERNAL_MODULE_9__;
        }, /* 10 */
        /***/
        function (module, exports) {
            module.exports = __WEBPACK_EXTERNAL_MODULE_10__;
        }, /* 11 */
        /***/
        function (module, exports) {
            module.exports = __WEBPACK_EXTERNAL_MODULE_11__;
        }, /* 12 */
        /***/
        function (module, exports) {
            module.exports = __WEBPACK_EXTERNAL_MODULE_12__;
        }, /* 13 */
        /***/
        function (module, exports) {
            module.exports = __WEBPACK_EXTERNAL_MODULE_13__;
        }, /* 14 */
        /***/
        function (module, exports) {
            module.exports = __WEBPACK_EXTERNAL_MODULE_14__;
        }, /* 15 */
        /***/
        function (module, exports) {
            module.exports = __WEBPACK_EXTERNAL_MODULE_15__;
        }, /* 16 */
        /***/
        function (module, exports, __webpack_require__) {
            // style-loader: Adds some css to the DOM by adding a <style> tag
            // load the styles
            var content = __webpack_require__(17);
            "string" == typeof content && (content = [[module.id, content, ""]]);
            // add the styles to the DOM
            __webpack_require__(19)(content, {});
            content.locals && (module.exports = content.locals);
        }, /* 17 */
        /***/
        function (module, exports, __webpack_require__) {
            var _exports$locals;

            exports = module.exports = __webpack_require__(18)(), // imports
            // module
            exports.push([module.id, '._320tnel-30id3vvQeZQK4a{background-color:#fff;border:1px solid #ebecf0;border-radius:4px;box-sizing:border-box;box-shadow:0 20px 32px -8px rgba(9,30,66,.24),0 0 1px rgba(9,30,66,.03);display:-webkit-box;display:flex;padding:16px;width:100%}._320tnel-30id3vvQeZQK4a:focus{outline:none;box-shadow:0 0 0 2px #4c9aff}._3egmLSGGpT8kFqoQguUDCk{-webkit-box-flex:0;flex:0 0 auto;width:32px}._2Huhc7DIB_Evcreu5XcxTP{-webkit-box-flex:1;flex:1 1 auto}._2BpPdkjVMZ6zqP7whmcsuN{display:-webkit-box;display:flex}._2mrgQuKSRF6f63q0PpowGu{font-weight:600;-webkit-box-flex:1;flex:1 0 auto;max-width:304px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}._2kUBQsPYmzGWX8pWTVZbCn{-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:none;color:#42526e;cursor:pointer;display:-webkit-box;display:flex;-webkit-box-flex:0;flex:0 1 auto;-webkit-box-pack:end;justify-content:flex-end;margin:0;padding:0;width:32px}._2kUBQsPYmzGWX8pWTVZbCn:focus{outline:none;box-shadow:0 0 0 2px #4c9aff}._2kUBQsPYmzGWX8pWTVZbCn:hover{color:#091e42}.ffRgU2C0LkTDxnbjAQ4_-{color:#42526e;margin-top:8px}._3AmW-xNJ1AexAkU06EDQxc{display:-webkit-box;display:flex;flex-wrap:wrap;padding-top:8px}._3AmW-xNJ1AexAkU06EDQxc ._2LJiLjAKAA7ubMZM4t3kJK .mMdXxihaqa7bzFnVf07i2:not(:hover):not(:active){color:#7a869a}._3AmW-xNJ1AexAkU06EDQxc ._2LJiLjAKAA7ubMZM4t3kJK+._2LJiLjAKAA7ubMZM4t3kJK:before{color:#42526e;content:"\\B7\\A0";display:inline-block;text-align:center;vertical-align:middle;width:16px}', ""]),
            // exports
            exports.locals = (_exports$locals = {
                root: "_320tnel-30id3vvQeZQK4a"
            }, defineProperty(_exports$locals, "root", "_320tnel-30id3vvQeZQK4a"), defineProperty(_exports$locals, "primary-icon", "_3egmLSGGpT8kFqoQguUDCk"), defineProperty(_exports$locals, "primaryIcon", "_3egmLSGGpT8kFqoQguUDCk"), defineProperty(_exports$locals, "text-content", "_2Huhc7DIB_Evcreu5XcxTP"), defineProperty(_exports$locals, "textContent", "_2Huhc7DIB_Evcreu5XcxTP"), defineProperty(_exports$locals, "title-and-dismiss", "_2BpPdkjVMZ6zqP7whmcsuN"), defineProperty(_exports$locals, "titleAndDismiss", "_2BpPdkjVMZ6zqP7whmcsuN"), defineProperty(_exports$locals, "title", "_2mrgQuKSRF6f63q0PpowGu"), defineProperty(_exports$locals, "title", "_2mrgQuKSRF6f63q0PpowGu"), defineProperty(_exports$locals, "dismiss-icon-button", "_2kUBQsPYmzGWX8pWTVZbCn"), defineProperty(_exports$locals, "dismissIconButton", "_2kUBQsPYmzGWX8pWTVZbCn"), defineProperty(_exports$locals, "description", "ffRgU2C0LkTDxnbjAQ4_-"), defineProperty(_exports$locals, "description", "ffRgU2C0LkTDxnbjAQ4_-"), defineProperty(_exports$locals, "actions-container", "_3AmW-xNJ1AexAkU06EDQxc"), defineProperty(_exports$locals, "actionsContainer", "_3AmW-xNJ1AexAkU06EDQxc"), defineProperty(_exports$locals, "actions-item", "_2LJiLjAKAA7ubMZM4t3kJK"), defineProperty(_exports$locals, "actionsItem", "_2LJiLjAKAA7ubMZM4t3kJK"), defineProperty(_exports$locals, "action-button", "mMdXxihaqa7bzFnVf07i2"), defineProperty(_exports$locals, "actionButton", "mMdXxihaqa7bzFnVf07i2"), _exports$locals);
        }, /* 18 */
        /***/
        function (module, exports) {
            /*
            MIT License http://www.opensource.org/licenses/mit-license.php
            Author Tobias Koppers @sokra
            */
            // css base code, injected by the css-loader
            module.exports = function () {
                var list = [];
                // return the list of modules as css string
                // import a list of modules into the list
                return list.toString = function () {
                    for (var result = [], i = 0; i < this.length; i++) {
                        var item = this[i];
                        item[2] ? result.push("@media " + item[2] + "{" + item[1] + "}") : result.push(item[1]);
                    }
                    return result.join("");
                }, list.i = function (modules, mediaQuery) {
                    "string" == typeof modules && (modules = [[null, modules, ""]]);
                    for (var alreadyImportedModules = {}, i = 0; i < this.length; i++) {
                        var id = this[i][0];
                        "number" == typeof id && (alreadyImportedModules[id] = !0);
                    }
                    for (i = 0; i < modules.length; i++) {
                        var item = modules[i];
                        // skip already imported module
                        // this implementation is not 100% perfect for weird media query combinations
                        //  when a module is imported multiple times with different media queries.
                        //  I hope this will never occur (Hey this way we have smaller bundles)
                        "number" == typeof item[0] && alreadyImportedModules[item[0]] || (mediaQuery && !item[2] ? item[2] = mediaQuery : mediaQuery && (item[2] = "(" + item[2] + ") and (" + mediaQuery + ")"), list.push(item));
                    }
                }, list;
            };
        }, /* 19 */
        /***/
        function (module, exports, __webpack_require__) {
            function addStylesToDom(styles, options) {
                for (var i = 0; i < styles.length; i++) {
                    var item = styles[i],
                        domStyle = stylesInDom[item.id];
                    if (domStyle) {
                        domStyle.refs++;
                        for (var j = 0; j < domStyle.parts.length; j++) {
                            domStyle.parts[j](item.parts[j]);
                        }for (; j < item.parts.length; j++) {
                            domStyle.parts.push(addStyle(item.parts[j], options));
                        }
                    } else {
                        for (var parts = [], j = 0; j < item.parts.length; j++) {
                            parts.push(addStyle(item.parts[j], options));
                        }stylesInDom[item.id] = {
                            id: item.id,
                            refs: 1,
                            parts: parts
                        };
                    }
                }
            }
            function listToStyles(list) {
                for (var styles = [], newStyles = {}, i = 0; i < list.length; i++) {
                    var item = list[i],
                        id = item[0],
                        css = item[1],
                        media = item[2],
                        sourceMap = item[3],
                        part = {
                        css: css,
                        media: media,
                        sourceMap: sourceMap
                    };
                    newStyles[id] ? newStyles[id].parts.push(part) : styles.push(newStyles[id] = {
                        id: id,
                        parts: [part]
                    });
                }
                return styles;
            }
            function insertStyleElement(options, styleElement) {
                var head = getHeadElement(),
                    lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
                if ("top" === options.insertAt) lastStyleElementInsertedAtTop ? lastStyleElementInsertedAtTop.nextSibling ? head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling) : head.appendChild(styleElement) : head.insertBefore(styleElement, head.firstChild), styleElementsInsertedAtTop.push(styleElement);else {
                    if ("bottom" !== options.insertAt) throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
                    head.appendChild(styleElement);
                }
            }
            function removeStyleElement(styleElement) {
                styleElement.parentNode.removeChild(styleElement);
                var idx = styleElementsInsertedAtTop.indexOf(styleElement);
                idx >= 0 && styleElementsInsertedAtTop.splice(idx, 1);
            }
            function createStyleElement(options) {
                var styleElement = document.createElement("style");
                return styleElement.type = "text/css", insertStyleElement(options, styleElement), styleElement;
            }
            function createLinkElement(options) {
                var linkElement = document.createElement("link");
                return linkElement.rel = "stylesheet", insertStyleElement(options, linkElement), linkElement;
            }
            function addStyle(obj, options) {
                var styleElement, update, remove;
                if (options.singleton) {
                    var styleIndex = singletonCounter++;
                    styleElement = singletonElement || (singletonElement = createStyleElement(options)), update = applyToSingletonTag.bind(null, styleElement, styleIndex, !1), remove = applyToSingletonTag.bind(null, styleElement, styleIndex, !0);
                } else obj.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (styleElement = createLinkElement(options), update = updateLink.bind(null, styleElement), remove = function remove() {
                    removeStyleElement(styleElement), styleElement.href && URL.revokeObjectURL(styleElement.href);
                }) : (styleElement = createStyleElement(options), update = applyToTag.bind(null, styleElement), remove = function remove() {
                    removeStyleElement(styleElement);
                });
                return update(obj), function (newObj) {
                    if (newObj) {
                        if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
                        update(obj = newObj);
                    } else remove();
                };
            }
            function applyToSingletonTag(styleElement, index, remove, obj) {
                var css = remove ? "" : obj.css;
                if (styleElement.styleSheet) styleElement.styleSheet.cssText = replaceText(index, css);else {
                    var cssNode = document.createTextNode(css),
                        childNodes = styleElement.childNodes;
                    childNodes[index] && styleElement.removeChild(childNodes[index]), childNodes.length ? styleElement.insertBefore(cssNode, childNodes[index]) : styleElement.appendChild(cssNode);
                }
            }
            function applyToTag(styleElement, obj) {
                var css = obj.css,
                    media = obj.media;
                if (media && styleElement.setAttribute("media", media), styleElement.styleSheet) styleElement.styleSheet.cssText = css;else {
                    for (; styleElement.firstChild;) {
                        styleElement.removeChild(styleElement.firstChild);
                    }styleElement.appendChild(document.createTextNode(css));
                }
            }
            function updateLink(linkElement, obj) {
                var css = obj.css,
                    sourceMap = obj.sourceMap;
                sourceMap && ( // http://stackoverflow.com/a/26603875
                css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */");
                var blob = new Blob([css], {
                    type: "text/css"
                }),
                    oldSrc = linkElement.href;
                linkElement.href = URL.createObjectURL(blob), oldSrc && URL.revokeObjectURL(oldSrc);
            }
            /*
            MIT License http://www.opensource.org/licenses/mit-license.php
            Author Tobias Koppers @sokra
            */
            var stylesInDom = {},
                memoize = function memoize(fn) {
                var memo;
                return function () {
                    return "undefined" == typeof memo && (memo = fn.apply(this, arguments)), memo;
                };
            },
                isOldIE = memoize(function () {
                return (/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())
                );
            }),
                getHeadElement = memoize(function () {
                return document.head || document.getElementsByTagName("head")[0];
            }),
                singletonElement = null,
                singletonCounter = 0,
                styleElementsInsertedAtTop = [];
            module.exports = function (list, options) {
                options = options || {}, // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
                // tags it will allow on a page
                "undefined" == typeof options.singleton && (options.singleton = isOldIE()), // By default, add <style> tags to the bottom of <head>.
                "undefined" == typeof options.insertAt && (options.insertAt = "bottom");
                var styles = listToStyles(list);
                return addStylesToDom(styles, options), function (newList) {
                    for (var mayRemove = [], i = 0; i < styles.length; i++) {
                        var item = styles[i],
                            domStyle = stylesInDom[item.id];
                        domStyle.refs--, mayRemove.push(domStyle);
                    }
                    if (newList) {
                        var newStyles = listToStyles(newList);
                        addStylesToDom(newStyles, options);
                    }
                    for (var i = 0; i < mayRemove.length; i++) {
                        var domStyle = mayRemove[i];
                        if (0 === domStyle.refs) {
                            for (var j = 0; j < domStyle.parts.length; j++) {
                                domStyle.parts[j]();
                            }delete stylesInDom[domStyle.id];
                        }
                    }
                };
            };
            var replaceText = function () {
                var textStore = [];
                return function (index, replacement) {
                    return textStore[index] = replacement, textStore.filter(Boolean).join("\n");
                };
            }();
        }, /* 20 */
        /***/
        function (module, exports) {
            module.exports = __WEBPACK_EXTERNAL_MODULE_20__;
        }, /* 21 */
        /***/
        function (module, exports, __webpack_require__) {
            "use strict";

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            var _getPrototypeOf = __webpack_require__(9),
                _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf),
                _classCallCheck2 = __webpack_require__(10),
                _classCallCheck3 = _interopRequireDefault(_classCallCheck2),
                _createClass2 = __webpack_require__(11),
                _createClass3 = _interopRequireDefault(_createClass2),
                _possibleConstructorReturn2 = __webpack_require__(12),
                _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2),
                _inherits2 = __webpack_require__(13),
                _inherits3 = _interopRequireDefault(_inherits2),
                _react = __webpack_require__(14),
                _react2 = _interopRequireDefault(_react),
                _FlagGroup = __webpack_require__(22),
                _FlagGroup2 = _interopRequireDefault(_FlagGroup),
                _FlagAnimationWrapper = __webpack_require__(24),
                _FlagAnimationWrapper2 = _interopRequireDefault(_FlagAnimationWrapper),
                FlagGroup = function (_PureComponent) {
                function FlagGroup() {
                    var _ref, _temp, _this, _ret;
                    (0, _classCallCheck3.default)(this, FlagGroup);
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }return _temp = _this = (0, _possibleConstructorReturn3.default)(this, (_ref = FlagGroup.__proto__ || (0, _getPrototypeOf2.default)(FlagGroup)).call.apply(_ref, [this].concat(args))), _this.state = {
                        isAnimatingOut: !1
                    }, _this.onFlagDismissRequested = function () {
                        _this.setState({
                            isAnimatingOut: !0
                        });
                    }, _this.onFlagDismissFinished = function (dismissedFlagId) {
                        _this.setState({
                            isAnimatingOut: !1
                        }), _this.props.onDismissed(dismissedFlagId);
                    }, _this.renderFlag = function (childFlag, flagIndex) {
                        return _react2.default.createElement(_FlagAnimationWrapper2.default, {
                            flagId: childFlag.props.id,
                            isEntering: 0 === flagIndex,
                            isExiting: 0 === flagIndex && _this.state.isAnimatingOut,
                            isMovingToPrimary: 1 === flagIndex && _this.state.isAnimatingOut,
                            key: childFlag.props.id,
                            onAnimationFinished: _this.onFlagDismissFinished
                        }, _react2.default.cloneElement(childFlag, {
                            onDismissed: _this.onFlagDismissRequested,
                            isDismissAllowed: 0 === flagIndex
                        }));
                    }, _ret = _temp, (0, _possibleConstructorReturn3.default)(_this, _ret);
                }
                return (0, _inherits3.default)(FlagGroup, _PureComponent), (0, _createClass3.default)(FlagGroup, [{
                    key: "render",
                    value: function value() {
                        return _react2.default.createElement("section", {
                            className: _FlagGroup2.default.root
                        }, _react2.default.createElement("h1", {
                            className: _FlagGroup2.default.assistive
                        }, "Flag notifications"), _react2.default.createElement("div", {
                            className: _FlagGroup2.default.groupInner
                        }, _react2.default.Children.map(this.props.children, this.renderFlag)));
                    }
                }]), FlagGroup;
            }(_react.PureComponent);
            FlagGroup.propTypes = {
                children: _react.PropTypes.node,
                onDismissed: _react.PropTypes.func
            }, FlagGroup.defaultProps = {
                onDismissed: function onDismissed() {}
            }, exports.default = FlagGroup;
        }, /* 22 */
        /***/
        function (module, exports, __webpack_require__) {
            // style-loader: Adds some css to the DOM by adding a <style> tag
            // load the styles
            var content = __webpack_require__(23);
            "string" == typeof content && (content = [[module.id, content, ""]]);
            // add the styles to the DOM
            __webpack_require__(19)(content, {});
            content.locals && (module.exports = content.locals);
        }, /* 23 */
        /***/
        function (module, exports, __webpack_require__) {
            var _exports$locals2;

            exports = module.exports = __webpack_require__(18)(), // imports
            // module
            exports.push([module.id, ".QkBGJXpVSBEN0x_Oo2_E0{bottom:48px;left:80px;position:fixed;z-index:600}._3Wj1fsusWiA-qEi9TGH6Hs{border:0!important;clip:rect(1px,1px,1px,1px)!important;height:1px!important;overflow:hidden!important;padding:0!important;position:absolute!important;width:1px!important;white-space:nowrap!important}._35PeTHidiBo0incHX3-F7F{position:relative}", ""]),
            // exports
            exports.locals = (_exports$locals2 = {
                root: "QkBGJXpVSBEN0x_Oo2_E0"
            }, defineProperty(_exports$locals2, "root", "QkBGJXpVSBEN0x_Oo2_E0"), defineProperty(_exports$locals2, "assistive", "_3Wj1fsusWiA-qEi9TGH6Hs"), defineProperty(_exports$locals2, "assistive", "_3Wj1fsusWiA-qEi9TGH6Hs"), defineProperty(_exports$locals2, "group-inner", "_35PeTHidiBo0incHX3-F7F"), defineProperty(_exports$locals2, "groupInner", "_35PeTHidiBo0incHX3-F7F"), _exports$locals2);
        }, /* 24 */
        /***/
        function (module, exports, __webpack_require__) {
            "use strict";

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            var _defineProperty2 = __webpack_require__(25),
                _defineProperty3 = _interopRequireDefault(_defineProperty2),
                _getPrototypeOf = __webpack_require__(9),
                _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf),
                _classCallCheck2 = __webpack_require__(10),
                _classCallCheck3 = _interopRequireDefault(_classCallCheck2),
                _createClass2 = __webpack_require__(11),
                _createClass3 = _interopRequireDefault(_createClass2),
                _possibleConstructorReturn2 = __webpack_require__(12),
                _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2),
                _inherits2 = __webpack_require__(13),
                _inherits3 = _interopRequireDefault(_inherits2),
                _react = __webpack_require__(14),
                _react2 = _interopRequireDefault(_react),
                _classnames = __webpack_require__(26),
                _classnames2 = _interopRequireDefault(_classnames),
                _FlagAnimationWrapper = __webpack_require__(27),
                _FlagAnimationWrapper2 = _interopRequireDefault(_FlagAnimationWrapper),
                FlagAnimationWrapper = function (_PureComponent) {
                function FlagAnimationWrapper() {
                    var _ref, _temp, _this, _ret;
                    (0, _classCallCheck3.default)(this, FlagAnimationWrapper);
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }return _temp = _this = (0, _possibleConstructorReturn3.default)(this, (_ref = FlagAnimationWrapper.__proto__ || (0, _getPrototypeOf2.default)(FlagAnimationWrapper)).call.apply(_ref, [this].concat(args))), _this.state = {
                        hasAnimatedIn: !1
                    }, _ret = _temp, (0, _possibleConstructorReturn3.default)(_this, _ret);
                }
                return (0, _inherits3.default)(FlagAnimationWrapper, _PureComponent), (0, _createClass3.default)(FlagAnimationWrapper, [{
                    key: "componentDidUpdate",
                    value: function value() {
                        this.state.hasAnimatedIn === !1 && // eslint-disable-next-line react/no-did-update-set-state
                        this.setState({
                            hasAnimatedIn: !0
                        });
                    }
                }, {
                    key: "render",
                    value: function value() {
                        var _classNames,
                            _this2 = this;
                        return _react2.default.createElement("div", {
                            className: (0, _classnames2.default)((_classNames = {}, (0, _defineProperty3.default)(_classNames, _FlagAnimationWrapper2.default.root, !0), (0, _defineProperty3.default)(_classNames, _FlagAnimationWrapper2.default.entering, !this.state.hasAnimatedIn && !this.props.isExiting && this.props.isEntering), (0, _defineProperty3.default)(_classNames, _FlagAnimationWrapper2.default.movingToPrimary, this.props.isMovingToPrimary), (0, _defineProperty3.default)(_classNames, _FlagAnimationWrapper2.default.exiting, this.props.isExiting), _classNames)),
                            onAnimationEnd: function onAnimationEnd() {
                                _this2.props.isExiting && _this2.props.onAnimationFinished(_this2.props.flagId);
                            }
                        }, this.props.children);
                    }
                }]), FlagAnimationWrapper;
            }(_react.PureComponent);
            FlagAnimationWrapper.propTypes = {
                children: _react.PropTypes.node,
                flagId: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]),
                isEntering: _react.PropTypes.bool,
                isExiting: _react.PropTypes.bool,
                isMovingToPrimary: _react.PropTypes.bool,
                onAnimationFinished: _react.PropTypes.func
            }, FlagAnimationWrapper.defaultProps = {
                isEntering: !1,
                isExiting: !1,
                isMovingToPrimary: !1,
                onAnimationFinished: function onAnimationFinished() {}
            }, exports.default = FlagAnimationWrapper;
        }, /* 25 */
        /***/
        function (module, exports) {
            module.exports = __WEBPACK_EXTERNAL_MODULE_25__;
        }, /* 26 */
        /***/
        function (module, exports) {
            module.exports = __WEBPACK_EXTERNAL_MODULE_26__;
        }, /* 27 */
        /***/
        function (module, exports, __webpack_require__) {
            // style-loader: Adds some css to the DOM by adding a <style> tag
            // load the styles
            var content = __webpack_require__(28);
            "string" == typeof content && (content = [[module.id, content, ""]]);
            // add the styles to the DOM
            __webpack_require__(19)(content, {});
            content.locals && (module.exports = content.locals);
        }, /* 28 */
        /***/
        function (module, exports, __webpack_require__) {
            var _exports$locals3;

            exports = module.exports = __webpack_require__(18)(), // imports
            // module
            exports.push([module.id, "@-webkit-keyframes _36uOUFIPLm_yevcq1wLePf{0%{opacity:0;-webkit-transform:translate(-200px);transform:translate(-200px)}to{opacity:1;-webkit-transform:translate(0);transform:translate(0)}}@keyframes _36uOUFIPLm_yevcq1wLePf{0%{opacity:0;-webkit-transform:translate(-200px);transform:translate(-200px)}to{opacity:1;-webkit-transform:translate(0);transform:translate(0)}}@-webkit-keyframes _2vMvOdE2O8kBa9uTaUhaJz{0%{opacity:1;-webkit-transform:translate(0);transform:translate(0)}to{opacity:0;-webkit-transform:translate(-200px);transform:translate(-200px)}}@keyframes _2vMvOdE2O8kBa9uTaUhaJz{0%{opacity:1;-webkit-transform:translate(0);transform:translate(0)}to{opacity:0;-webkit-transform:translate(-200px);transform:translate(-200px)}}._3N4LiqYck5qNqFDGrDej1R{bottom:0;position:absolute;-webkit-transition:-webkit-transform .4s ease-in-out;transition:-webkit-transform .4s ease-in-out;transition:transform .4s ease-in-out;transition:transform .4s ease-in-out,-webkit-transform .4s ease-in-out;width:400px}._3N4LiqYck5qNqFDGrDej1R.mJoWXliQlvHsTBGZSi55J:first-child{-webkit-animation-name:_36uOUFIPLm_yevcq1wLePf;animation-name:_36uOUFIPLm_yevcq1wLePf;-webkit-animation-duration:.4s;animation-duration:.4s}._3N4LiqYck5qNqFDGrDej1R.NIU9Qp6RC9JE_ZjE5mv25:first-child{-webkit-animation-name:_2vMvOdE2O8kBa9uTaUhaJz;animation-name:_2vMvOdE2O8kBa9uTaUhaJz;-webkit-animation-duration:.4s;animation-duration:.4s}._3N4LiqYck5qNqFDGrDej1R._3RumVKkFT7r-2HvEOllPwT:nth-child(2){-webkit-transform:translate(0);transform:translate(0)}._3N4LiqYck5qNqFDGrDej1R:nth-child(n+2){-webkit-transform:translateX(0) translateY(100%) translateY(16px);transform:translateX(0) translateY(100%) translateY(16px)}._3N4LiqYck5qNqFDGrDej1R:nth-child(1){z-index:5}._3N4LiqYck5qNqFDGrDej1R:nth-child(2){z-index:4}._3N4LiqYck5qNqFDGrDej1R:nth-child(n+4){display:none}", ""]),
            // exports
            exports.locals = (_exports$locals3 = {
                root: "_3N4LiqYck5qNqFDGrDej1R"
            }, defineProperty(_exports$locals3, "root", "_3N4LiqYck5qNqFDGrDej1R"), defineProperty(_exports$locals3, "entering", "mJoWXliQlvHsTBGZSi55J"), defineProperty(_exports$locals3, "entering", "mJoWXliQlvHsTBGZSi55J"), defineProperty(_exports$locals3, "enter", "_36uOUFIPLm_yevcq1wLePf"), defineProperty(_exports$locals3, "enter", "_36uOUFIPLm_yevcq1wLePf"), defineProperty(_exports$locals3, "exiting", "NIU9Qp6RC9JE_ZjE5mv25"), defineProperty(_exports$locals3, "exiting", "NIU9Qp6RC9JE_ZjE5mv25"), defineProperty(_exports$locals3, "exit", "_2vMvOdE2O8kBa9uTaUhaJz"), defineProperty(_exports$locals3, "exit", "_2vMvOdE2O8kBa9uTaUhaJz"), defineProperty(_exports$locals3, "moving-to-primary", "_3RumVKkFT7r-2HvEOllPwT"), defineProperty(_exports$locals3, "movingToPrimary", "_3RumVKkFT7r-2HvEOllPwT"), _exports$locals3);
        }]);
    });

    var FLAGID_PREFIX = 'ap-flag-';

    var Flag$1 = function () {
      function Flag() {
        classCallCheck(this, Flag);
      }

      createClass$1(Flag, [{
        key: '_toHtmlString',
        value: function _toHtmlString(str) {
          if ($.type(str) === 'string') {
            return str;
          } else if ($.type(str) === 'object' && str instanceof $) {
            return str.html();
          }
        }
      }, {
        key: 'render',
        value: function render(options) {
          var _id = FLAGID_PREFIX + options.id;
          return React.createElement(Flag, {
            description: this._toHtmlString(options.body),
            icon: React.createElement(GreenSuccessIcon, null),
            id: _id,
            title: options.title
          });

          // // var auiFlag = AJS.flag({
          // //   type: options.type,
          // //   title: options.title,
          // //   body: this._toHtmlString(options.body),
          // //   close: options.close
          // // });
          // auiFlag.setAttribute('id', _id);
          var $auiFlag = $(auiFlag);
          $auiFlag.close = auiFlag.close;

          return $auiFlag;
        }
      }, {
        key: 'close',
        value: function close(id) {
          var f = document.getElementById(id);
          f.close();
        }
      }]);
      return Flag;
    }();

    var FlagComponent = new Flag$1();

    $(document).on('aui-flag-close', function (e) {
      var _id = e.target.id;
      FlagActions.closed(_id);
    });

    EventDispatcher$1.register('flag-close', function (data) {
      FlagComponent.close(data.id);
    });

    /**
    * Flags are the primary method for providing system feedback in the product user interface. Messages include notifications of various kinds: alerts, confirmations, notices, warnings, info and errors.
    * @module Flag
    */

    var _flags = {};

    /**
    * @class Flag~Flag
    * @description A flag object created by the [AP.flag]{@link module:Flag} module.
    */

    var Flag = function () {
      function Flag(options, callback) {
        classCallCheck(this, Flag);

        callback = _.last(arguments);
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
          return;
        }
        this.flag = FlagComponent.render({
          type: options.type,
          title: options.title,
          body: util$1.escapeHtml(options.body),
          close: options.close,
          id: callback._id
        });

        FlagActions.open(this.flag.attr('id'));

        this.onTriggers = {};

        _flags[this.flag.attr('id')] = this;
      }

      /**
      * @name on
      * @memberof Flag~Flag
      * @method
      * @description Binds a callback function to an event that is triggered by the Flag.
      * @param {Event} event A flag event; currently, the only valid option is 'close'.
      * @param {Function} callback The function that runs when the event occurs.
      * @example
      * // Display a nice green flag using the Flags JavaScript API.
      * var flag = AP.flag.create({
      *   title: 'Successfully created a flag.',
      *   body: 'This is a flag.',
      *   type: 'info'
      * });
      *
      * // Log a message to the console when the flag has closed.
      * flag.on('close', function (data) {
      *   console.log('Flag has been closed!');
      * })
      *
      */


      createClass$1(Flag, [{
        key: 'on',
        value: function on(event, callback) {
          var id = this.flag.id;
          if ($.isFunction(callback)) {
            this.onTriggers[event] = callback;
          }
        }

        /**
        * @name close
        * @memberof Flag~Flag
        * @method
        * @description Closes the Flag.
        * @example
        * // Display a nice green flag using the Flags JavaScript API.
        * var flag = AP.flag.create({
        *   title: 'Successfully created a flag.',
        *   body: 'This is a flag.',
        *   type: 'info'
        * });
        *
        * // Close the flag.
        * flag.close()
        *
        */

      }, {
        key: 'close',
        value: function close() {
          this.flag.close();
        }
      }]);
      return Flag;
    }();

    EventDispatcher$1.register('flag-closed', function (data) {
      if (_flags[data.id] && $.isFunction(_flags[data.id].onTriggers['close'])) {
        _flags[data.id].onTriggers['close']();
      }
      if (_flags[data.id]) {
        delete _flags[data.id];
      }
    });

    var flag = {
      /**
      * @name create
      * @method
      * @description Creates a new flag.
      * @param {Object} options           Options of the flag.
      * @param {String} options.title     The title text of the flag.
      * @param {String} options.body      The body text of the flag.
      * @param {String} options.type=info Sets the type of the message. Valid options are "info", "success", "warning" and "error".
      * @param {String} options.close     The closing behaviour that this flag has. Valid options are "manual", "auto" and "never".
      * @returns {Flag~Flag}
      * @example
      * // Display a nice green flag using the Flags JavaScript API.
      * var flag = AP.flag.create({
      *   title: 'Successfully created a flag.',
      *   body: 'This is a flag.',
      *   type: 'success'
      * });
      */
      create: {
        constructor: Flag,
        on: Flag.prototype.on,
        close: Flag.prototype.close
      }
    };

    var analytics$1 = {
      trackDeprecatedMethodUsed: function trackDeprecatedMethodUsed(methodUsed, callback) {
        callback = _.last(arguments);
        AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, callback._context.extension);
      }
    };

    var scrollPosition = {
      /**
       * Get's the scroll position relative to the browser viewport
       *
       * @param callback {Function} callback to pass the scroll position
       * @noDemo
       * @example
       * AP.scrollPosition.getPosition(function(obj) { console.log(obj); });
       */
      getPosition: function getPosition(callback) {
        callback = _.last(arguments);
        // scrollPosition.getPosition is only available for general-pages
        if (callback._context.extension.options.isFullPage) {
          var $el = util$1.getIframeByExtensionId(callback._context.extension_id);
          var offset = $el.offset();
          var $window = $(window);

          callback({
            scrollY: $window.scrollTop() - offset.top,
            scrollX: $window.scrollLeft() - offset.left,
            width: window.innerWidth,
            height: window.innerHeight
          });
        }
      }
    };

    var ModuleActions = {
      defineCustomModule: function defineCustomModule(name, methods) {
        var data = {};
        if (!methods) {
          data.methods = name;
        } else {
          data.methods = methods;
          data.name = name;
        }
        EventDispatcher$1.dispatch('module-define-custom', data);
      }
    };

    var LOADING_INDICATOR_CLASS$1 = 'ap-status-indicator';

    var LOADING_STATUSES$1 = {
      loading: react.createElement(
        'div',
        { className: 'ap-loading' },
        react.createElement('div', { className: 'small-spinner' }),
        'Loading add-on...'
      ),
      'load-timeout': react.createElement(
        'div',
        { className: 'ap-load-timeout' },
        react.createElement('div', { className: 'small-spinner' }),
        'Add-on is not responding. Wait or ',
        react.createElement(
          'a',
          { href: '#', className: 'ap-btn-cancel' },
          'cancel'
        ),
        '?'
      ),
      'load-error': 'Add-on failed to load.'
    };

    var LoadingIndicator$1 = function (_React$Component) {
      inherits(LoadingIndicator, _React$Component);

      function LoadingIndicator() {
        classCallCheck(this, LoadingIndicator);
        return possibleConstructorReturn(this, (LoadingIndicator.__proto__ || Object.getPrototypeOf(LoadingIndicator)).apply(this, arguments));
      }

      createClass$1(LoadingIndicator, [{
        key: '_loadingContainer',
        value: function _loadingContainer($iframeContainer) {
          return $iframeContainer.find('.' + LOADING_INDICATOR_CLASS$1);
        }
      }, {
        key: 'render',
        value: function render() {
          return react.createElement(
            'div',
            null,
            'i am loading...'
          );
        }
      }]);
      return LoadingIndicator;
    }(react.Component);

    var Iframe$1 = function (_React$Component) {
      inherits(Iframe, _React$Component);

      function Iframe() {
        classCallCheck(this, Iframe);
        return possibleConstructorReturn(this, (Iframe.__proto__ || Object.getPrototypeOf(Iframe)).apply(this, arguments));
      }

      createClass$1(Iframe, [{
        key: 'render',
        value: function render() {
          var style = {
            width: this.props.width,
            height: this.props.height
          };
          return react.createElement('iframe', {
            id: this.props.id,
            className: 'ap-iframe',
            name: this.props.name,
            src: this.props.src,
            style: style
          });
        }
      }]);
      return Iframe;
    }(react.Component);

    Iframe$1.propTypes = {
      id: react.PropTypes.string.isRequired,
      name: react.PropTypes.string.isRequired,
      src: react.PropTypes.string.isRequired,
      width: react.PropTypes.string,
      height: react.PropTypes.string
    };

    var CONTAINER_CLASSES$2 = ['ap-iframe-container'];

    var IframeContainer$2 = function (_React$Component) {
      inherits(IframeContainer, _React$Component);

      function IframeContainer(props) {
        classCallCheck(this, IframeContainer);

        var _this = possibleConstructorReturn(this, (IframeContainer.__proto__ || Object.getPrototypeOf(IframeContainer)).call(this, props));

        _this.state = {
          extension: {}
        };
        return _this;
      }

      createClass$1(IframeContainer, [{
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          // simple-xdm destoy frame
          // this.state.extension.extension_id
        }
      }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
          var _arguments = arguments;

          var iframeAttributes = simpleXDM$1.create({
            addon_key: this.props.extension.addon_key,
            key: this.props.extension.module_key,
            url: this.props.extension.url
          }, function () {
            console.log('initd', _arguments);
          });

          console.log('iframe attributes?', iframeAttributes);
          this.setState(function (prevState, props) {
            return {
              extension: _extends({}, prevState.extension, iframeAttributes)
            };
          });
        }
      }, {
        key: 'render',
        value: function render() {
          var loadingIndicator = this.props.loadingIndicator ? LoadingIndicator$1 : null;
          console.log('my state is?', this.state);
          return react.createElement(
            'div',
            { className: CONTAINER_CLASSES$2.join(' ') },
            react.createElement(Iframe$1, {
              id: this.state.extension.id,
              name: this.state.extension.name,
              src: this.state.extension.src,
              width: this.state.extension.width,
              height: this.state.extension.height
            }),
            react.createElement('loadingIndicator', null)
          );
        }
      }]);
      return IframeContainer;
    }(react.Component);

    IframeContainer$2.propTypes = {
      extension: react.PropTypes.shape({
        addon_key: react.PropTypes.string.isRequired,
        module_key: react.PropTypes.string.isRequired,
        url: react.PropTypes.string,
        options: react.PropTypes.object
      }),
      loadingIndicator: react.PropTypes.bool
    };

    IframeContainer$2.defaultProps = {
      loadingIndicator: true
    };

    var HostApi$1 = function () {
      function HostApi() {
        classCallCheck(this, HostApi);

        this.IframeContainerComponent = IframeContainer$2;
        this.dialog = {
          create: function create(extension, dialogOptions) {
            DialogExtensionActions.open(extension, dialogOptions);
          },
          close: function close() {
            DialogExtensionActions.close();
          }
        };
        this.registerContentResolver = {
          resolveByExtension: function resolveByExtension(callback) {
            jwtActions.registerContentResolver({ callback: callback });
          }
        };
      }

      createClass$1(HostApi, [{
        key: '_cleanExtension',
        value: function _cleanExtension(extension) {
          return _.pick(extension, ['id', 'addon_key', 'key', 'options', 'url']);
        }
      }, {
        key: 'onIframeEstablished',
        value: function onIframeEstablished(callback) {
          var _this = this;

          EventDispatcher$1.register('after:iframe-bridge-established', function (data) {
            callback.call({}, {
              $el: data.$el,
              extension: _this._cleanExtension(data.extension)
            });
          });
        }
      }, {
        key: 'onIframeUnload',
        value: function onIframeUnload(callback) {
          var _this2 = this;

          EventDispatcher$1.register('after:iframe-unload', function (data) {
            callback.call({}, {
              $el: data.$el,
              extension: _this2._cleanExtension(data.extension)
            });
          });
        }
      }, {
        key: 'onPublicEventDispatched',
        value: function onPublicEventDispatched(callback) {
          var wrapper = function wrapper(data) {
            callback.call({}, {
              type: data.type,
              event: data.event,
              extension: this._cleanExtension(data.sender)
            });
          };
          callback._wrapper = wrapper.bind(this);
          EventDispatcher$1.register('after:event-public-dispatch', callback._wrapper);
        }
      }, {
        key: 'offPublicEventDispatched',
        value: function offPublicEventDispatched(callback) {
          if (callback._wrapper) {
            EventDispatcher$1.unregister('after:event-public-dispatch', callback._wrapper);
          } else {
            throw new Error('cannot unregister event dispatch listener without _wrapper reference');
          }
        }
      }, {
        key: 'onKeyEvent',
        value: function onKeyEvent(extension_id, key, modifiers, callback) {
          DomEventActions.registerKeyEvent({ extension_id: extension_id, key: key, modifiers: modifiers, callback: callback });
        }
      }, {
        key: 'offKeyEvent',
        value: function offKeyEvent(extension_id, key, modifiers, callback) {
          DomEventActions.unregisterKeyEvent({ extension_id: extension_id, key: key, modifiers: modifiers, callback: callback });
        }
      }, {
        key: 'destroy',
        value: function destroy(extension_id) {
          IframeActions.notifyIframeDestroyed({ extension_id: extension_id });
        }
      }, {
        key: 'defineModule',
        value: function defineModule(name, methods) {
          ModuleActions.defineCustomModule(name, methods);
        }
      }, {
        key: 'broadcastEvent',
        value: function broadcastEvent(type, targetSpec, event) {
          EventActions.broadcast(type, targetSpec, event);
        }
      }, {
        key: 'getExtensions',
        value: function getExtensions(filter) {
          return simpleXDM$1.getExtensions(filter);
        }
      }, {
        key: 'trackDeprecatedMethodUsed',
        value: function trackDeprecatedMethodUsed(methodUsed, extension) {
          AnalyticsAction.trackDeprecatedMethodUsed(methodUsed, extension);
        }
      }]);
      return HostApi;
    }();

    var HostApi$2 = new HostApi$1();

    function sanitizeTriggers(triggers) {
      var onTriggers;
      if (_.isArray(triggers)) {
        onTriggers = triggers.join(' ');
      } else if (_.isString(triggers)) {
        onTriggers = triggers.trim();
      }
      return onTriggers;
    }

    function uniqueId() {
      return 'webitem-' + Math.floor(Math.random() * 1000000000).toString(16);
    }

    // LEGACY: get addon key by webitem for p2
    function getExtensionKey($target) {
      var cssClass = $target.attr('class');
      var m = cssClass ? cssClass.match(/ap-plugin-key-([^\s]*)/) : null;
      return _.isArray(m) ? m[1] : false;
    }

    // LEGACY: get module key by webitem for p2
    function getKey($target) {
      var cssClass = $target.attr('class');
      var m = cssClass ? cssClass.match(/ap-module-key-([^\s]*)/) : null;
      return _.isArray(m) ? m[1] : false;
    }

    function getTargetKey($target) {
      var cssClass = $target.attr('class');
      var m = cssClass ? cssClass.match(/ap-target-key-([^\s]*)/) : null;
      return _.isArray(m) ? m[1] : false;
    }

    function getFullKey($target) {
      return getExtensionKey($target) + '__' + getKey($target);
    }

    function getModuleOptionsForWebitem(type, $target) {
      var addon_key = getExtensionKey($target);
      var targetKey = getTargetKey($target);
      var moduleType = type + 'Modules';
      if (window._AP && window._AP[moduleType] && window._AP[moduleType][addon_key] && window._AP[moduleType][addon_key][targetKey]) {
        return _.clone(window._AP[moduleType][addon_key][targetKey].options);
      }
    }

    // LEGACY - method for handling webitem options for p2
    function getOptionsForWebItem($target) {
      var fullKey = getFullKey($target);

      var type = $target.hasClass('ap-inline-dialog') ? 'inlineDialog' : 'dialog';
      var options = getModuleOptionsForWebitem(type, $target);
      if (!options && window._AP && window._AP[type + 'Options']) {
        options = _.clone(window._AP[type + 'Options'][fullKey]) || {};
      }
      if (!options) {
        options = {};
        console.warn('no webitem ' + type + 'Options for ' + fullKey);
      }
      options.productContext = options.productContext || {};
      // create product context from url params
      var url = $target.attr('href');
      if (url) {
        var query = index$4.parse(index$4.extract(url));
        _.each(query, function (value, key) {
          options.productContext[key] = value;
        });
      }

      return options;
    }

    var WebItemUtils = {
      sanitizeTriggers: sanitizeTriggers,
      uniqueId: uniqueId,
      getExtensionKey: getExtensionKey,
      getKey: getKey,
      getOptionsForWebItem: getOptionsForWebItem
    };

    var WebItem = function () {
      function WebItem() {
        classCallCheck(this, WebItem);

        this._webitems = {};
        this._contentResolver = function noop() {};
      }

      createClass$1(WebItem, [{
        key: 'setContentResolver',
        value: function setContentResolver(resolver) {
          this._contentResolver = resolver;
        }
      }, {
        key: 'requestContent',
        value: function requestContent(extension) {
          if (extension.addon_key && extension.key) {
            return this._contentResolver.call(null, _.extend({ classifier: 'json' }, extension));
          }
        }
      }, {
        key: 'getWebItemsBySelector',
        value: function getWebItemsBySelector(selector) {
          return _.find(this._webitems, function (obj) {
            if (obj.selector) {
              return obj.selector.trim() === selector.trim();
            }
            return false;
          });
        }
      }, {
        key: 'setWebItem',
        value: function setWebItem(potentialWebItem) {
          return this._webitems[potentialWebItem.name] = {
            name: potentialWebItem.name,
            selector: potentialWebItem.selector,
            triggers: potentialWebItem.triggers
          };
        }
      }, {
        key: '_removeTriggers',
        value: function _removeTriggers(webitem) {
          var _this = this;

          var onTriggers = WebItemUtils.sanitizeTriggers(webitem.triggers);
          $(function () {
            $('body').off(onTriggers, webitem.selector, _this._webitems[webitem.name]._on);
          });
          delete this._webitems[webitem.name]._on;
        }
      }, {
        key: '_addTriggers',
        value: function _addTriggers(webitem) {
          var onTriggers = WebItemUtils.sanitizeTriggers(webitem.triggers);
          webitem._on = function (event) {
            event.preventDefault();
            var $target = $(event.target).closest(webitem.selector);
            var extension = {
              addon_key: WebItemUtils.getExtensionKey($target),
              key: WebItemUtils.getKey($target),
              options: WebItemUtils.getOptionsForWebItem($target)
            };

            WebItemActions.webitemInvoked(webitem, event, extension);
          };
          $(function () {
            $('body').on(onTriggers, webitem.selector, webitem._on);
          });
        }
      }]);
      return WebItem;
    }();

    var webItemInstance = new WebItem();

    EventDispatcher$1.register('webitem-added', function (data) {
      webItemInstance._addTriggers(data.webitem);
    });

    EventDispatcher$1.register('content-resolver-register-by-extension', function (data) {
      webItemInstance.setContentResolver(data.callback);
    });

    document.addEventListener('aui-responsive-menu-item-created', function (e) {
      var oldWebItem = e.detail.originalItem.querySelector('a[class*="ap-"]');
      if (oldWebItem) {
        var newWebItem = e.detail.newItem.querySelector('a');
        _.each(oldWebItem.classList, function (cls) {
          if (/^ap-/.test(cls)) {
            newWebItem.classList.add(cls);
          }
        });
      }
    });

    var WebItemActions = {
      addWebItem: function addWebItem(potentialWebItem) {
        var webitem = void 0;
        var existing = webItemInstance.getWebItemsBySelector(potentialWebItem.selector);

        if (existing) {
          return false;
        } else {
          webitem = webItemInstance.setWebItem(potentialWebItem);
          EventDispatcher$1.dispatch('webitem-added', { webitem: webitem });
        }
      },

      webitemInvoked: function webitemInvoked(webitem, event, extension) {
        EventDispatcher$1.dispatch('webitem-invoked:' + webitem.name, { webitem: webitem, event: event, extension: extension });
      }

    };

    var InlineDialogWebItemActions = {
      addExtension: function addExtension(data) {
        EventDispatcher$1.dispatch('inline-dialog-extension', {
          $el: data.$el,
          extension: data.extension
        });
      }
    };

    var InlineDialog = function () {
      function InlineDialog() {
        classCallCheck(this, InlineDialog);
      }

      createClass$1(InlineDialog, [{
        key: 'resize',
        value: function resize(data) {
          var width = util$1.stringToDimension(data.width);
          var height = util$1.stringToDimension(data.height);
          var $content = data.$el.find('.contents');
          if ($content.length === 1) {
            $content.css({
              width: width,
              height: height
            });
            InlineDialogActions.refresh(data.$el);
          }
        }
      }, {
        key: 'refresh',
        value: function refresh($el) {
          $el[0].popup.reset();
        }
      }, {
        key: '_getInlineDialog',
        value: function _getInlineDialog($el) {
          return AJS.InlineDialog($el);
        }
      }, {
        key: '_renderContainer',
        value: function _renderContainer() {
          return $('<div />').addClass('aui-inline-dialog-contents');
        }
      }, {
        key: '_displayInlineDialog',
        value: function _displayInlineDialog(data) {
          InlineDialogActions.created({
            $el: data.$el,
            trigger: data.trigger,
            extension: data.extension
          });
        }
      }, {
        key: 'hideInlineDialog',
        value: function hideInlineDialog($el) {
          $el.hide();
        }
      }, {
        key: 'closeInlineDialog',
        value: function closeInlineDialog() {
          $('.aui-inline-dialog').filter(function () {
            return $(this).find('.ap-iframe-container').length > 0;
          }).hide();
        }
      }, {
        key: 'render',
        value: function render(data) {
          var _this = this;

          var $inlineDialog = $(document.getElementById('inline-dialog-' + data.id));

          if ($inlineDialog.length !== 0) {
            $inlineDialog.remove();
          }

          var $el = AJS.InlineDialog(data.bindTo,
          //assign unique id to inline Dialog
          data.id, function ($placeholder, trigger, showInlineDialog) {
            $placeholder.append(data.$content);
            _this._displayInlineDialog({
              extension: data.extension,
              $el: $placeholder,
              trigger: trigger
            });
            showInlineDialog();
          }, data.inlineDialogOptions);
          return $el;
        }
      }]);
      return InlineDialog;
    }();

    var InlineDialogComponent = new InlineDialog();

    EventDispatcher$1.register('iframe-resize', function (data) {
      var container = data.$el.parents('.aui-inline-dialog');
      if (container.length === 1) {
        InlineDialogComponent.resize({
          width: data.width,
          height: data.height,
          $el: container
        });
      }
    });

    EventDispatcher$1.register('inline-dialog-refresh', function (data) {
      InlineDialogComponent.refresh(data.$el);
    });

    EventDispatcher$1.register('inline-dialog-hide', function (data) {
      InlineDialogComponent.hideInlineDialog(data.$el);
    });

    EventDispatcher$1.register('inline-dialog-close', function (data) {
      InlineDialogComponent.closeInlineDialog();
    });

    function create$1(props) {
      // var simpleXdmExtension = {
      //   addon_key: props.addon_key,
      //   key: props.key,
      //   url: props.url,
      //   options: props.options
      // };
      return IframeContainer$2;
    }

    var ITEM_NAME = 'inline-dialog';
    var SELECTOR = '.ap-inline-dialog';
    var TRIGGERS = ['mouseover', 'click'];
    var WEBITEM_UID_KEY = 'inline-dialog-target-uid';

    var InlineDialogWebItem = function () {
      function InlineDialogWebItem() {
        classCallCheck(this, InlineDialogWebItem);

        this._inlineDialogWebItemSpec = {
          name: ITEM_NAME,
          selector: SELECTOR,
          triggers: TRIGGERS
        };
        this._inlineDialogWebItems = {};
      }

      createClass$1(InlineDialogWebItem, [{
        key: 'getWebItem',
        value: function getWebItem() {
          return this._inlineDialogWebItemSpec;
        }
      }, {
        key: '_createInlineDialog',
        value: function _createInlineDialog(data) {
          var $iframeContainer = IframeContainerComponent.createExtension(data.extension);
          var $inlineDialog = InlineDialogComponent.render({
            extension: data.extension,
            id: data.id,
            bindTo: data.$target,
            $content: $iframeContainer,
            inlineDialogOptions: data.extension.options
          });

          return $inlineDialog;
        }
      }, {
        key: 'triggered',
        value: function triggered(data) {
          // don't trigger on hover, when hover is not specified.
          if (data.event.type !== 'click' && !data.extension.options.onHover) {
            return;
          }
          var $target = $(data.event.currentTarget);
          var webitemId = $target.data(WEBITEM_UID_KEY);

          var $inlineDialog = this._createInlineDialog({
            id: webitemId,
            extension: data.extension,
            $target: $target,
            options: data.extension.options || {}
          });

          $inlineDialog.show();
        }
      }, {
        key: 'opened',
        value: function opened(data) {
          var contentRequest = webItemInstance.requestContent(data.extension);
          if (!contentRequest) {
            console.warn('no content resolver found');
            return false;
          }
          contentRequest.then(function (content) {
            content.options = content.options || {};
            _.extend(content.options, {
              autoresize: true,
              widthinpx: true
            });

            InlineDialogWebItemActions.addExtension({
              $el: data.$el,
              extension: content
            });
          });
        }
      }, {
        key: 'addExtension',
        value: function addExtension(data) {
          var addon = create$1(data.extension);
          data.$el.empty().append(addon);
        }
      }, {
        key: 'createIfNotExists',
        value: function createIfNotExists(data) {
          var $target = $(data.event.currentTarget);
          var uid = $target.data(WEBITEM_UID_KEY);

          if (!uid) {
            uid = WebItemUtils.uniqueId();
            $target.data(WEBITEM_UID_KEY, uid);
          }
        }
      }]);
      return InlineDialogWebItem;
    }();

    var inlineDialogInstance = new InlineDialogWebItem();
    var webitem = inlineDialogInstance.getWebItem();
    EventDispatcher$1.register('before:webitem-invoked:' + webitem.name, function (data) {
      inlineDialogInstance.createIfNotExists(data);
    });
    EventDispatcher$1.register('webitem-invoked:' + webitem.name, function (data) {
      inlineDialogInstance.triggered(data);
    });
    EventDispatcher$1.register('inline-dialog-opened', function (data) {
      inlineDialogInstance.opened(data);
    });
    EventDispatcher$1.register('inline-dialog-extension', function (data) {
      inlineDialogInstance.addExtension(data);
    });
    WebItemActions.addWebItem(webitem);

    var ITEM_NAME$1 = 'dialog';
    var SELECTOR$1 = '.ap-dialog';
    var TRIGGERS$1 = ['click'];
    var WEBITEM_UID_KEY$1 = 'dialog-target-uid';
    var DEFAULT_WEBITEM_OPTIONS = {
      chrome: true
    };

    var DialogWebItem = function () {
      function DialogWebItem() {
        classCallCheck(this, DialogWebItem);

        this._dialogWebItem = {
          name: ITEM_NAME$1,
          selector: SELECTOR$1,
          triggers: TRIGGERS$1
        };
      }

      createClass$1(DialogWebItem, [{
        key: 'getWebItem',
        value: function getWebItem() {
          return this._dialogWebItem;
        }
      }, {
        key: '_dialogOptions',
        value: function _dialogOptions(options) {
          return _.extend({}, DEFAULT_WEBITEM_OPTIONS, options || {});
        }
      }, {
        key: 'triggered',
        value: function triggered(data) {
          var $target = $(data.event.currentTarget);
          var webitemId = $target.data(WEBITEM_UID_KEY$1);
          var dialogOptions = this._dialogOptions(data.extension.options);
          dialogOptions.id = webitemId;
          DialogExtensionActions.open(data.extension, dialogOptions);
        }
      }, {
        key: 'createIfNotExists',
        value: function createIfNotExists(data) {
          var $target = $(data.event.currentTarget);
          var uid = $target.data(WEBITEM_UID_KEY$1);

          if (!uid) {
            uid = WebItemUtils.uniqueId();
            $target.data(WEBITEM_UID_KEY$1, uid);
          }
        }
      }]);
      return DialogWebItem;
    }();

    var dialogInstance = new DialogWebItem();
    var webitem$1 = dialogInstance.getWebItem();
    EventDispatcher$1.register('webitem-invoked:' + webitem$1.name, function (data) {
      dialogInstance.triggered(data);
    });
    EventDispatcher$1.register('before:webitem-invoked:' + webitem$1.name, dialogInstance.createIfNotExists);

    WebItemActions.addWebItem(webitem$1);

    /**
     * Private namespace for host-side code.
     * @type {*|{}}
     * @private
     * @deprecated use AMD instead of global namespaces. The only thing that should be on _AP is _AP.define and _AP.require.
     */
    if (!window._AP) {
      window._AP = {};
    }

    /*
     * Add version
     */
    if (!window._AP.version) {
      window._AP.version = '5.0.0-beta.33';
    }

    simpleXDM$1.defineModule('messages', messages);
    simpleXDM$1.defineModule('flag', flag);
    simpleXDM$1.defineModule('dialog', dialog);
    simpleXDM$1.defineModule('inlineDialog', inlineDialog);
    simpleXDM$1.defineModule('env', env);
    simpleXDM$1.defineModule('events', events);
    simpleXDM$1.defineModule('_analytics', analytics$1);
    simpleXDM$1.defineModule('scrollPosition', scrollPosition);

    EventDispatcher$1.register('module-define-custom', function (data) {
      simpleXDM$1.defineModule(data.name, data.methods);
    });

    simpleXDM$1.registerRequestNotifier(function (data) {
      analytics.dispatch('bridge.invokemethod', {
        module: data.module,
        fn: data.fn,
        addonKey: data.addon_key,
        moduleKey: data.key
      });
    });

    return HostApi$2;

})));
