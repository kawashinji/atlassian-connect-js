import FlagComponent from 'src/host/components/flag';
import FlagActions from 'src/host/actions/flag_actions';

/**
* Because we have no idea when aui/flag will be available
* we have to make all these tests async whilst we wait for it.
*/

describe('Flag Component', () => {

  beforeEach(() => {
  });

  afterEach(() => {
    $('.aui-flag').remove();
  });

  describe('close', () => {

    it('the flag returns a close method', (done) => {
      window.require(['aui/flag'], () => {
        var $flag = FlagComponent.render({
          id: 'some-id',
          type: 'success',
          body: 'hello world',
          title: 'some title'
        });
        expect($('.aui-flag').attr('aria-hidden')).toEqual('false');
        $flag.close();
        expect($('.aui-flag').attr('aria-hidden')).toEqual('true');
        done();
      });
    });


    it('the close action closes the flag', (done) => {
      window.require(['aui/flag'], () => {
        var $flag = FlagComponent.render({
          id: 'some-id',
          type: 'success',
          body: 'hello world',
          title: 'some title'
        });
        expect($('.aui-flag').attr('aria-hidden')).toEqual('false');
        FlagActions.close($flag.attr('id'));
        expect($('.aui-flag').attr('aria-hidden')).toEqual('true');
        done();
      });
    });

    it('the close action closes the correct flag when multiple flags are open', (done) => {
      window.require(['aui/flag'], () => {
        var $flag = FlagComponent.render({
          id: 'some-id',
          type: 'success',
          body: 'hello world',
          title: 'some title'
        });
        var $flag2 = FlagComponent.render({
          id: 'some-other-id',
          type: 'success',
          body: 'hello world 2',
          title: 'some title 2'
        });
        var $flag3 = FlagComponent.render({
          id: 'some-third-id',
          type: 'success',
          body: 'hello world 3',
          title: 'some title 3'
        });
        expect($flag.attr('aria-hidden')).toEqual('false');
        expect($flag2.attr('aria-hidden')).toEqual('false');
        expect($flag3.attr('aria-hidden')).toEqual('false');
        FlagActions.close($flag2.attr('id'));
        expect($flag.attr('aria-hidden')).toEqual('false');
        expect($flag2.attr('aria-hidden')).toEqual('true');
        expect($flag3.attr('aria-hidden')).toEqual('false');
        done();
      });
    });


  });


  describe('rendering', () => {

    it('renders a flag', (done) => {
      window.require(['aui/flag'], () => {
        var $flag = FlagComponent.render({
          id: 'some-id',
          type: 'success',
          body: 'hello world',
          title: 'some title'
        });
        expect($flag.hasClass('aui-flag')).toBe(true);
        expect($flag.attr('id')).toEqual('ap-flag-some-id');
        done();
      });
    });

    it('renders a html body', (done) => {
      window.require(['aui/flag'], () => {
        var $flag = FlagComponent.render({
          id: 'some-id',
          type: 'success',
          body: 'hello <b>world</b>',
          title: 'some title'
        });
        expect($flag.find('b').text()).toEqual('world');
        done();
      });
    });

    it('renders a html body from jQuery', (done) => {
      window.require(['aui/flag'], () => {
        var $flag = FlagComponent.render({
          id: 'some-id',
          type: 'success',
          body: $('<p>hello <b>world</b></p>'),
          title: 'some title'
        });
        expect($flag.find('b').text()).toEqual('world');
        done();
      });
    });

    it('renders a plain text title', (done) => {
      window.require(['aui/flag'], () => {
        var $flag = FlagComponent.render({
          id: 'some-id',
          type: 'success',
          body: 'hello world',
          title: 'some title'
        });
        expect($flag.find('.title').text()).toEqual('some title');
        done();
      });
    });

    it('escapes a html title', (done) => {
      window.require(['aui/flag'], () => {
        var $flag = FlagComponent.render({
          id: 'some-id',
          type: 'success',
          body: 'hello world',
          title: '<b>some title</b>'
        });
        expect($flag.find('.title b').length).toEqual(0);
        done();
      });
    });

    it('escapes a jQuery title', (done) => {
      window.require(['aui/flag'], () => {
        var $flag = FlagComponent.render({
          id: 'some-id',
          type: 'success',
          body: 'hello world',
          title: AJS.$('<b>some title</b>')
        });
        expect($flag.find('b').length).toEqual(0);
        done();
      });
    });

  });

});
