import IframeComponent from './components/iframe';
import InlineDialogComponent from './components/inline_dialog';

class Providers {
  constructor(){
    this._componentProviders = {
      addon: IframeComponent,
      inlineDialog: InlineDialogComponent
    };
    this.registerProvider = (componentName, component) => {
      this._componentProviders[componentName] = component;
    };
    this.getProvider = (componentName) => {
      return this._componentProviders[componentName];
    };
  }
}

export default new Providers();