import ScrollPosition from 'src/host/modules/scroll-position';
beforeEach(() => {
  window.document.body.style.overflow = 'visible';
});
describe('scroll position', () => {
  it('gets the scroll position of parent page', (done) => {
    var elementId = Math.random().toString(36).substring(2, 8);
    var callback = function (position) {
      expect(position).toEqual({
        scrollY: 900,
        scrollX: -100,
        width: window.innerWidth,
        height: window.innerHeight
      });
      done();
    };
    callback._context = {
      extension: {
        options: {
          isFullPage: true
        }
      },
      extension_id: elementId
    };
    $('<iframe>').attr({id: elementId}).appendTo('body');
    $('body').css({
      height: 2000,
      margin: 100
    });
    window.scrollTo(0, 1000);
    ScrollPosition.getPosition(callback);
  });

  it('sets the scroll position of the page', (done) => {
    var elementId = Math.random().toString(36).substring(2, 8);
    var scrollPosition = 200;
    var callback = function (position) {
      expect(position.scrollY).toEqual(scrollPosition);
      done();
    };
    callback._context = {
      extension: {
        options: {
          isFullPage: true
        }
      },
      extension_id: elementId
    };
    $('<iframe>').attr({id: elementId}).css({
      width: '2000px',
      height: '5000px'
    }).appendTo('body');
    window.scrollTo(0, 0);
    ScrollPosition.setVerticalPosition(scrollPosition, callback);
    expect($(window).scrollTop()).toEqual(scrollPosition);
    ScrollPosition.getPosition(callback);
  });
});
