import observe from 'src/host/utils/observe';

describe('observe', () => {
  it('fires for visible iframe', (done) => {
    const spy = jasmine.createSpy('observed');
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    observe(iframe, spy);
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      document.body.removeChild(iframe);
      done();
    }, 1000);
  });

  it('fires when iframe scrolls into view', (done) => {
    const spy = jasmine.createSpy('observed');
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '100%';
    document.body.appendChild(iframe);
    observe(iframe, spy);
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      iframe.scrollIntoView();
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        document.body.removeChild(iframe);
        done();
      }, 1000);
    }, 1000);
  });

  it('fires when iframe becomes visible', (done) => {
    const spy = jasmine.createSpy('observed');
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    observe(iframe, spy);
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      iframe.style.display = 'block';
      setTimeout(() => {
        expect(spy).toHaveBeenCalled();
        document.body.removeChild(iframe);
        done();
      }, 1000);
    }, 1000);
  });

  it('doesn\'t fire for invisible iframe', (done) => {
    const spy = jasmine.createSpy('observed');
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    observe(iframe, spy);
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      document.body.removeChild(iframe);
      done();
    }, 1000);
  });

  it('doesn\'t fire for detached iframe', (done) => {
    const spy = jasmine.createSpy('observed');
    const iframe = document.createElement('iframe');
    observe(iframe, spy);
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, 1000);
  });
});
