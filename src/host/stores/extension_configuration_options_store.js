import util from '../util';

class ExtensionConfigurationOptionsStore {
  constructor() {
    this.store = {};
  }
  set(obj, val) {
    if(val) {
      obj = {obj: val};
    }

    util.extend(this.store, obj);
  }
  get(key) {
    if(key) {
      return this.store[key];
    }
    return util.extend({}, this.store); //clone
  }
}

export default new ExtensionConfigurationOptionsStore();
