import extend from '../util';

class ExtensionConfigurationOptionsStore {
  constructor() {
    this.store = {};
  }
  set(obj, val) {
    if(val) {
      obj = {obj: val};
    }

    extend(this.store, obj);
  }
  get(key) {
    if(key) {
      return this.store[key];
    }
    return extend({}, this.store); //clone
  }
}

export default new ExtensionConfigurationOptionsStore();
