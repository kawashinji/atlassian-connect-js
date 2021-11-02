import simpleXDM from 'simple-xdm/host';

var performanceModuleDefined = false;

/**
 * This is a temporary module that will be removed when no longer needed.
 */
export default function definePerformanceModule() {
  if (performanceModuleDefined) {
    return;
  }
  performanceModuleDefined = true;

  function numberValuesOnly(obj) {
    var safeObj = {};
    Object.keys(obj).forEach(function (key) {
      var value = obj[key];
      if (typeof value === 'number') {
        safeObj[key] = value;
      }
    });
    return safeObj;
  }

  var performanceModule = {
    /**
     * @see https://developer.mozilla.org/en-US/docs/web/api/performance/timing
     * @returns {Promise<PerformanceTiming>}
     */
    getPerformanceTiming() {
      return new Promise(function (resolve) {
        // We need to parse + stringify otherwise we get an empty object
        resolve(JSON.parse(JSON.stringify(window.performance.timing)));
      });
    },
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
     * @returns {Promise<PerformanceNavigationTiming[] | void>}
     */
    getPerformanceNavigationTiming() {
      return new Promise(function (resolve) {
        if (!window.PerformanceNavigationTiming) {
          resolve(undefined);
        }
        var timing = window.performance.getEntriesByType('navigation');
        var safeTiming = timing.map(function (entry) {
          // For some reason Object.keys doesn't work on the native object
          entry = JSON.parse(JSON.stringify(entry));
          // For security reasons we strip out everything that isn't numeric (like the .name property)
          return numberValuesOnly(entry);
        });
        resolve(safeTiming);
      })
    }
  }

  simpleXDM.returnsPromise(performanceModule.getPerformanceTiming);
  simpleXDM.returnsPromise(performanceModule.getPerformanceNavigationTiming)
  simpleXDM.defineModule('_performance', performanceModule)
}
