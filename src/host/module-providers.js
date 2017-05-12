class ModuleProviders {
  constructor(){
    this._providers = {};
    this.registerProvider = (name, provider) => {
      this._providers[name] = provider;
    };
    this.getProvider = (name) => {
      return this._providers[name];
    };
  }
}

export default new ModuleProviders();