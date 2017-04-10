import IframeComponent from './components/iframe';

class Providers {
  constructor(){
    this._componentProviders = {addon: IframeComponent};
    this.registerProvider = (componentName, component) => {
      this._componentProviders[componentName] = component;
    };
    this.getProvider = (componentName) => {
      return this._componentProviders[componentName];
    };
  }
}

export default new Providers();