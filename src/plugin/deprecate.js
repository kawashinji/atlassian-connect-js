export default function (fn, name, alternate, sinceVersion) {
  let called = false;
  return (...args) => {
    if (!called && typeof console !== 'undefined' && console.warn) {
      called = true;
      console.warn(`DEPRECATED API - ${name} has been deprecated since ACJS ${sinceVersion}` +
        ` and will be removed in a future release. ${ alternate ? `Use ${alternate} instead.` : 'No alternative will be provided.' }`);
      AP._analytics.trackDeprecatedMethodUsed(name);
    }
    fn(...args);
  };
};