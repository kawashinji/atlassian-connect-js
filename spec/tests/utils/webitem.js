import WebItemUtils from 'src/host/utils/webitem';

describe('webitem utils', () => {
  describe('sanitizeTriggers', () => {
    it('sanitizes array', () => {
      const triggers = ['mouseover', 'click'];
      const expected = 'mouseover click';
      expect(WebItemUtils.sanitizeTriggers(triggers));
    });

    it('sanitizes string', () => {
      const triggers = '   mouseover click  ';
      const expected = 'mouseover click';
      expect(WebItemUtils.sanitizeTriggers(triggers));
    });
  });

  describe('uniqueId', () => {
    it('returns a unique webitem id', () => {
      const id1 = WebItemUtils.uniqueId();
      const id2 = WebItemUtils.uniqueId();
      expect(id1).not.toEqual(id2);
    });
  });

  describe('getExtensionKey', () => {
    it('returns false if key is missing from class name', () => {
      const $target = $('<div class=""></div>');
      expect(WebItemUtils.getExtensionKey($target)).toBe(false);
    });

    it('returns extension key', () => {
      const expectedKey = 'somekey1234';
      const $target = $(`<div class="ap-plugin-key-${expectedKey}"></div>`);
      expect(WebItemUtils.getExtensionKey($target)).toBe(expectedKey);
    });
  });

  describe('getKey', () => {
    it('returns false if key is missing from class name', () => {
      const $target = $('<div class=""></div>');
      expect(WebItemUtils.getKey($target)).toBe(false);
    });

    it('returns module key', () => {
      const expectedKey = 'somekey1234';
      const $target = $(`<div class="ap-module-key-${expectedKey}"></div>`);
      expect(WebItemUtils.getKey($target)).toBe(expectedKey);
    });
  });

  describe('getOptionsForWebItem', () => {
    const dialogOptions = {
      options: {
        someKey: 'someVal'
      }
    };

    const inlineDialogOptions = {
      options: {
        someKey: 'otherSomeVal'
      }
    };

    const dialogOptionsWithProductContext = {
      options: {
        productContext: {
          key1: 'val1',
          key2: 'val2'
        }
      }
    };

    beforeEach(() => {
      window._AP = {
        _convertConnectOptions: function(data){
          return {
            options: {
              productContext: JSON.parse(data.productCtx),
              structuredContext: JSON.parse(data.structuredContext)
            }
          };
        },
        dialogModules: {
          addonKey: {
            moduleKey: dialogOptions,
            moduleWithCtxKey: dialogOptionsWithProductContext
          }
        },
        inlineDialogModules: {
          addonKey: {
            moduleKey: inlineDialogOptions
          }
        }
      };
    });

    afterEach(() => {
      delete window._AP._convertConnectOptions;
    });

    it('returns options of existing dialog webitem', () => {
      const extensionKey = 'addonKey';
      const key = 'moduleKey';
      const $target = $(`<div class="ap-module-key-${key} ap-target-key-${key} ap-plugin-key-${extensionKey}"></div>`);
      const optionsForWebItem = WebItemUtils.getOptionsForWebItem($target);
      expect(optionsForWebItem.someKey).toEqual(dialogOptions.options.someKey);
      expect(optionsForWebItem.productContext).toEqual({});
    });

    it('returns options of existing inline dialog webitem', () => {
      const extensionKey = 'addonKey';
      const key = 'moduleKey';
      const $target = $(`<div class="ap-inline-dialog ap-module-key-${key} ap-target-key-${key} ap-plugin-key-${extensionKey}"></div>`);
      const optionsForWebItem = WebItemUtils.getOptionsForWebItem($target);
      expect(optionsForWebItem.someKey).toEqual(inlineDialogOptions.options.someKey);
      expect(optionsForWebItem.productContext).toEqual({});
    });

    it('returns empty options when not defined', () => {
      const $target = $('<div class="ap-inline-dialog ap-module-key-nothing ap-target-key-nothing ap-plugin-key-something"></div>');
      const optionsForWebItem = WebItemUtils.getOptionsForWebItem($target);
      expect(optionsForWebItem).toEqual({productContext: {}, structuredContext: {}});
    });

    it('returns options with product context', () => {
      const extensionKey = 'addonKey';
      const key = 'moduleWithCtxKey';
      const $target = $(`<a class="ap-module-key-${key} ap-target-key-${key} ap-plugin-key-${extensionKey}" href="#productCtx=%7B%22user.key%22:%22admin%22,%22project.key%22:%22FDS%22,%22project.id%22:%2210000%22,%22user.id%22:%22admin%22%7D&uniqueKey=dialog-tester__dialog&origin=http://5c8fb543.ngrok.io&h=100%25&contextJwt=&timeZone=Australia/Sydney&hostOrigin=http://jiratesttenant.localhost.atl-test.space:8090&cp=/jira&url=http://5c8fb543.ngrok.io/dialog?dialog=1&tz=Australia%252FSydney&loc=en-US&user_id=admin&user_key=admin&xdm_e=http%253A%252F%252Fjiratesttenant.localhost.atl-test.space%253A8090&xdm_c=channel-dialog-tester__dialog&cp=%252Fjira&xdm_deprecated_addon_key_do_not_use=dialog-tester&lic=none&cv=2.0.0-SNAPSHOT&uid=admin&general=&contentClassifier=&addon_key=dialog-tester&w=100%25&ukey=admin&structuredContext=%7B%22project%22:%7B%22key%22:%22FDS%22,%22id%22:%2210000%22%7D%7D&key=dialog"></a>`);
      const optionsForWebItem = WebItemUtils.getOptionsForWebItem($target);
      // from the global options
      expect(optionsForWebItem.productContext['key1']).toEqual('val1');
      expect(optionsForWebItem.productContext['key2']).toEqual('val2');
      // from anchor params
      expect(optionsForWebItem.productContext['user.key']).toEqual('admin');
      expect(optionsForWebItem.productContext['project.key']).toEqual('FDS');
      expect(optionsForWebItem.structuredContext).toEqual({
        project: {
          key: 'FDS',
          id: '10000'
        }
      });
    });
  });
});
