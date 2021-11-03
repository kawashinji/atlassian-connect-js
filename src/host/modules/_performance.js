import simpleXDM from 'simple-xdm/host';

let performanceModuleDefined = false;
export const ADDON_KEY_CODEBARREL = 'com.codebarrel.addons.automation';

/**
 * This is a temporary module for Code Barrel that will be removed when no longer needed.
 */
export default function definePerformanceModule() {
  if (performanceModuleDefined) {
    return;
  }
  performanceModuleDefined = true;

  function isPerformanceModuleAllowed(cb) {
    return cb._context.extension.addon_key === ADDON_KEY_CODEBARREL
  }

  function numberValuesOnly(obj) {
    const safeObj = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (typeof value === 'number') {
        safeObj[key] = value;
      }
    });
    return safeObj;
  }

  const performanceModule = {
    /**
     * @see https://developer.mozilla.org/en-US/docs/web/api/performance/timing
     * @returns {Promise<PerformanceTiming>}
     */
    getPerformanceTiming(cb) {
      return new Promise((resolve, reject) =>  {
        if (!isPerformanceModuleAllowed(cb)) {
          reject(new Error('This is a restricted API'));
        }
        // We need to parse + stringify otherwise we get an empty object
        resolve(JSON.parse(JSON.stringify(window.performance.timing)));
      });
    },
    /**
     * @see https://developer.mozilla.org/en-US/docs/Web/API/PerformanceNavigationTiming
     * @returns {Promise<PerformanceNavigationTiming[] | void>}
     */
    getPerformanceNavigationTiming(cb) {
      return new Promise((resolve, reject) =>  {
        if (!isPerformanceModuleAllowed(cb)) {
          reject(new Error('This is a restricted API'));
        }
        if (!window.PerformanceNavigationTiming) {
          resolve(undefined);
        }
        const timing = window.performance.getEntriesByType('navigation');
        const safeTiming = timing.map(entry => {
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
