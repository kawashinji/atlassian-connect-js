"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports["default"] = function () {
    return {
        internals: {
            getLocation: function getLocation() {
                return window.location.href;
            }
        }
    };
};

module.exports = exports["default"];