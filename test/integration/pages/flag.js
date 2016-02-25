var flagCommands = {
  switchToAddon: function() {
    this.api.waitForElementVisible('iframe', 1000).frame(0);
    return this
  },
  switchToParent: function() {
    this.api.frameParent();
    return this;
  }
};

module.exports = {
  url: 'http://localhost:8080/?flag',
  elements: {
    infoButton: {
      selector: 'button#info'
    },
    warningButton: {
      selector: 'button#warning'
    },
    successButton: {
      selector: 'button#success'
    },
    errorButton: {
      selector: 'button#error'
    },
    autoCloseButton: {
      selector: 'button#auto-close'
    },
    neverCloseButton: {
      selector: 'button#never-close'
    },
    onCloseEventButton: {
      selector: 'button#on-close'
    },
    infoFlag: {
      selector: '.aui-flag > .info'
    },
    successFlag: {
      selector: '.aui-flag > .success'
    },
    warningFlag: {
      selector: '.aui-flag > .warning'
    },
    errorFlag: {
      selector: '.aui-flag > .error'
    },
    flagCloseIcon: {
      selector: '.aui-icon.icon-close'
    }
  },
  commands: [flagCommands]
};
