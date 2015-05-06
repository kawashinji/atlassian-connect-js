"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _util = require("./util");

var _util2 = _interopRequireDefault(_util);

var _each = _util2["default"].each,
    extend = _util2["default"].extend,
    document = window.document;

function $(sel, context) {

  context = context || document;

  var els = [];
  if (sel) {
    if (typeof sel === "string") {
      var results = context.querySelectorAll(sel);
      _each(results, function (i, v) {
        els.push(v);
      });
    } else if (sel.nodeType === 1) {
      els.push(sel);
    } else if (sel === window) {
      els.push(sel);
    }
  }

  extend(els, {
    each: function each(it) {
      _each(this, it);
      return this;
    },
    bind: function bind(name, callback) {
      this.each(function (i, el) {
        _util2["default"].bind(el, name, callback);
      });
    },
    attr: function attr(k) {
      var v;
      this.each(function (i, el) {
        v = el[k] || el.getAttribute && el.getAttribute(k);
        return !v;
      });
      return v;
    },
    removeClass: function removeClass(className) {
      return this.each(function (i, el) {
        if (el.className) {
          el.className = el.className.replace(new RegExp("(^|\\s)" + className + "(\\s|$)"), " ");
        }
      });
    },
    html: function html(_html) {
      return this.each(function (i, el) {
        el.innerHTML = _html;
      });
    },
    append: function append(spec) {
      return this.each(function (i, to) {
        var el = context.createElement(spec.tag);
        _each(spec, function (k, v) {
          if (k === "$text") {
            if (el.styleSheet) {
              // style tags in ie
              el.styleSheet.cssText = v;
            } else {
              el.appendChild(context.createTextNode(v));
            }
          } else if (k !== "tag") {
            el[k] = v;
          }
        });
        to.appendChild(el);
      });
    }
  });

  return els;
}

exports["default"] = extend($, _util2["default"]);
module.exports = exports["default"];