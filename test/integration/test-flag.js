module.exports = {
  after : function(browser) {
    browser.end();
  },

  'Test info': function (browser) {
    var flagPage = browser.page.flag();
    flagPage.navigate()
    .switchToAddon()
    .click('@infoButton')
    .switchToParent()
    .waitForElementVisible('@infoFlag', 2000);

    flagPage.expect.element('@infoFlag').to.be.visible;
    flagPage.expect.element('@infoFlag').text.to.contain('Info flag');
    flagPage.expect.element('@infoFlag').text.to.contain('Body text of info');
  },

  'Test warning': function (browser) {
    var flagPage = browser.page.flag();
    flagPage.navigate()
    .switchToAddon()
    .click('@warningButton')
    .switchToParent()
    .waitForElementVisible('@warningFlag', 2000);

    flagPage.expect.element('@warningFlag').to.be.visible;
    flagPage.expect.element('@warningFlag').text.to.contain('Warning flag');
    flagPage.expect.element('@warningFlag').text.to.contain('Body text of warning');
  },

  'Test success': function (browser) {
    var flagPage = browser.page.flag();
    flagPage.navigate()
    .switchToAddon()
    .click('@successButton')
    .switchToParent()
    .waitForElementVisible('@successFlag', 2000);

    flagPage.expect.element('@successFlag').to.be.visible;
    flagPage.expect.element('@successFlag').text.to.contain('Success flag');
    flagPage.expect.element('@successFlag').text.to.contain('Body text of success');
  },

  'Test error': function (browser) {
    var flagPage = browser.page.flag();
    flagPage.navigate()
    .switchToAddon()
    .click('@errorButton')
    .switchToParent()
    .waitForElementVisible('@errorFlag', 2000);

    flagPage.expect.element('@errorFlag').to.be.visible;
    flagPage.expect.element('@errorFlag').text.to.contain('Error flag');
    flagPage.expect.element('@errorFlag').text.to.contain('Body text of error');
  },

  'Test never close': function (browser) {
    var flagPage = browser.page.flag();
    flagPage.navigate()
    .switchToAddon()
    .click('@neverCloseButton')
    .switchToParent()
    .waitForElementVisible('@infoFlag', 2000)
    .expect.element('@flagCloseIcon').to.not.be.present;
  },

  'Test auto close': function (browser) {
    var flagPage = browser.page.flag();
    flagPage.navigate()
    .switchToAddon()
    .click('@autoCloseButton')
    .switchToParent();

    flagPage.expect.element('@infoFlag').to.be.visible;
    flagPage.waitForElementNotVisible('@infoFlag', 6000);
    flagPage.expect.element('@infoFlag').to.not.be.visible;
  },

  'Test manually close': function (browser) {
    var flagPage = browser.page.flag();
    flagPage.navigate()
    .switchToAddon()
    .click('@infoButton')
    .switchToParent()
    .waitForElementVisible('@infoFlag', 2000)
    .click('@flagCloseIcon')
    .waitForElementNotVisible('@infoFlag', 2000);
  },

  'Test on close event': function (browser) {
    var flagPage = browser.page.flag();
    flagPage.navigate()
    .switchToAddon()
    .click('@onCloseEventButton')
    .switchToParent()
    .waitForElementVisible('@infoFlag', 2000)
    .click('@flagCloseIcon');

    browser.pause(500).getAlertText(function(text) {
      this.assert.equal(text.value, 'Flag has closed!');
    }).acceptAlert();
  }
};
