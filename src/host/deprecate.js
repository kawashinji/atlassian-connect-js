import Analytics from './modules/analytics';
import util from './util';

function deprecateHost (fn, name, alternate, sinceVersion) {
  let called = false;
  return (...args) => {
    if (!called && typeof console !== 'undefined' && console.warn) {
      called = true;
      console.warn(`DEPRECATED API - ${name} has been deprecated ${sinceVersion ? `since ACJS ${sinceVersion}` : 'in ACJS'}` +
        ` and will be removed in a future release. ${ alternate ? `Use ${alternate} instead.` : 'No alternative will be provided.' }`);

      const callback = util.last(args);
      if (callback && callback._context && callback._context.extension) {
        Analytics.trackDeprecatedMethodUsed(name, callback);
      }
    }
    return fn(...args);
  };
}
export default deprecateHost;