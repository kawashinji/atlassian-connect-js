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
      var hashFragment = encodeURI(JSON.stringify({
        structuredContext: '{"project":{"key":"FDS","id":"10000"}}',
        productCtx:'{"user.key":"admin","project.key":"FDS","key1":"val1","key2":"val2","user.id":"admin","issue.key":"FDS-12","issuetype.id":"10003"}'
      }));
      var urlAnchor = '#' + hashFragment;
      const $target = $(`<a class="ap-module-key-${key} ap-target-key-${key} ap-plugin-key-${extensionKey}" href=""></a>`).attr('href', urlAnchor);
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
