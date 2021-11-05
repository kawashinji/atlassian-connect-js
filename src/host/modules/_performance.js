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
        resolve(JSON.parse(JSON.stringify(timing)));
      })
    }
  }

  simpleXDM.returnsPromise(performanceModule.getPerformanceTiming);
  simpleXDM.returnsPromise(performanceModule.getPerformanceNavigationTiming)
  simpleXDM.defineModule('_performance', performanceModule)
}
