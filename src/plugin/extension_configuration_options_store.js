// duplicated from ./host/stores/extension_configuration_options_store
// due to a huge build size difference

import util from './util';

class ExtensionConfigurationOptionsStore {
  constructor() {
    this.store = {};
  }
  set(obj, val) {
    if(val) {
      var toSet = {};
      toSet[obj] = val;
    } else {
      toSet = obj;
    }
    util.extend(this.store, toSet);
  }
  get(key) {
    if(key) {
      return this.store[key];
    }
    return util.extend({}, this.store); //clone
  }
}

export default new ExtensionConfigurationOptionsStore();
