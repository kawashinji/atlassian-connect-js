"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function escapeSelector(s) {
    if (!s) {
        throw new Error("No selector to escape");
    }
    return s.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\$&");
}

exports["default"] = { escapeSelector: escapeSelector };
module.exports = exports["default"];