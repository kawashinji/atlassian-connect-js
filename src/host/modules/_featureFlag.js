import simpleXDM from 'simple-xdm/host';
import getBooleanFeatureFlag from '../utils/feature-flag';

let defined = false;
export default function defineFeatureFlagModule() {
  if (defined) {
    return;
  }
  defined = true;

  const featureFlagModule = {
    getBooleanFeatureFlag(flagName) {
      return new Promise((resolve, reject) => {
        if (flagName.indexOf('com.atlassian.connect.acjs.iframe.') !== 0) {
          reject(new Error('Only allowlisted flags can be accessed from the iframe.'))
          return;
        }
        resolve(getBooleanFeatureFlag(flagName))
      })
    }
  }
  simpleXDM.returnsPromise(featureFlagModule.getBooleanFeatureFlag);
  simpleXDM.defineModule('_featureFlag', featureFlagModule)
}