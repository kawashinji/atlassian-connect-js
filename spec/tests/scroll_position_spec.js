import ScrollPosition from 'src/host/modules/scroll-position';

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
});
