
// This is essentially a copy of the ACJSFrameworkAdaptor/BaseFrameworkAdaptor implementation generated
// by compiling the connect-module-core typescript implementations of the equivalent classes.

/**
 * This class provides common behaviour relating to the adaption of functionality to a
 * particular Connect client framework. This is necessary for an interim period during which
 * we have multiple Connect client frameworks that we need to support: ACJS and CaaS Client.
 */
var ACJSFrameworkAdaptor = (function () {
  function ACJSFrameworkAdaptor() {
    this.moduleNamesToModules = new Map();
  }
  /**
   * This method registers a module with the Connect client framework relating to this adaptor instance.
   * @param moduleDefinition the definition of the module.
   */
  ACJSFrameworkAdaptor.prototype.registerModule = function (module, props) {
    var moduleRegistrationName = module.getModuleRegistrationName();
    this.moduleNamesToModules.set(moduleRegistrationName, module);

    // This adaptor implementation doesn't need to register the SimpleXDM definition so the following is
    // commented out.
    //
    // var simpleXdmDefinition = module.getSimpleXdmDefinition(props);
    // this.registerModuleWithHost(moduleRegistrationName, simpleXdmDefinition);
  };

  /**
   * This method unregisters a module with the Connect client framework relating to this adaptor instance.
   * @param name the name of the module
   */
  ACJSFrameworkAdaptor.prototype.unregisterModule = function (name) {
    this.moduleNamesToModules.set(name, undefined);
  };

  ACJSFrameworkAdaptor.prototype.getProviderByModuleName = function (moduleName) {
    var module = this.moduleNamesToModules.get(moduleName);
    if (module) {
      return module.getProvider();
    } else {
      return undefined;
    }
  };
  return ACJSFrameworkAdaptor;
}());

export const acjsFrameworkAdaptor = new ACJSFrameworkAdaptor();