"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * The iframe-side code exposes a jquery-like implementation via _dollar.
 * This runs on the product side to provide AJS.$ under a _dollar module to provide a consistent interface
 * to code that runs on host and iframe.
 */
exports["default"] = AJS.$;
module.exports = exports["default"];