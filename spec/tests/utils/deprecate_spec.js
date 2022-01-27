import deprecateHost from '../../../src/host/deprecate';
import Analytics from '../../../src/host/modules/analytics';

const callback = () => {};
callback._id = 'some-extension-id';
callback._context = {
  extension: {
    addon_key: 'some-addon-key',
    key: 'some-module-key',
    options: jasmine.objectContaining({})
  }
};
describe('host side deprecation', function () {
  it('should deprecate function tracks analytics', function () {
    const deprecateSpy = jasmine.createSpy('test function');
    const analyticsSpy = spyOn(Analytics, 'trackDeprecatedMethodUsed');
    const deprecated = deprecateHost(deprecateSpy, 'test function');
    deprecated(callback);
    expect(deprecateSpy).toHaveBeenCalled();
    expect(analyticsSpy).toHaveBeenCalled();
  });
});