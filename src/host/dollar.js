/**
 * The iframe-side code exposes a jquery-like implementation via _dollar.
 * This runs on the product side to provide AJS.$ under a _dollar module to provide a consistent interface
 * to code that runs on host and iframe.
 */
export default (window.AJS && window.AJS.$) || function(){};