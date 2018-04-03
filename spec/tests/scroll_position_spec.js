import ScrollPosition from 'src/host/modules/scroll-position';
beforeEach(() => {
  window.document.body.style.overflow = 'visible';
});
describe('scroll position', () => {
  // it('gets the scroll position of parent page', (done) => {
  //   var elementId = Math.random().toString(36).substring(2, 8);
  //   var callback = function (position) {
  //     expect(position).toEqual({
  //       scrollY: 900,
  //       scrollX: -100,
  //       width: window.innerWidth,
  //       height: window.innerHeight
  //     });
  //     done();
  //   };
  //   callback._context = {
  //     extension: {
  //       options: {
  //         isFullPage: true
  //       }
  //     },
  //     extension_id: elementId
  //   };
  //   $('<iframe>').attr({id: elementId}).appendTo('body');
  //   $('body').css({
  //     height: 2000,
  //     margin: 100
  //   });
  //   window.scrollTo(0, 1000);
  //   ScrollPosition.getPosition(callback);
  // });

  it('sets the scroll position of the iframe', () => {
    var elementId = Math.random().toString(36).substring(2, 8);
    var callback = function (position) {
      expect(position).toEqual({
        scrollY: 200,
        scrollX: 100,
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
    $('<iframe>').attr({id: elementId}).css({
      width: '2000px',
      height: '5000px'
    }).appendTo('body');
    window.scrollTo(0, 0);
    ScrollPosition.setPosition(100, 200, callback);
    expect($(window).scrollLeft()).toEqual(100);
    expect($('iframe').scrollTop()).toEqual(200);
    // ScrollPosition.getPosition(callback);
  });
});
