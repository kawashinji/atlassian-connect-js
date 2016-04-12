import DialogModule from 'src/host/modules/dialog';
import DialogComponent from 'src/host/components/dialog';
import EventActions from 'src/host/actions/event_actions';

describe('Dialog module', () => {
  it('button click dispatches an event', () => {
    var extension = {
      addon_key: 'my-addon-key'
    };
    var $dialog = DialogComponent.render({
      extension:extension
    });
    spyOn(EventActions, 'broadcast');
    $dialog.find('button').first().click();
    expect(EventActions.broadcast.calls.count()).toEqual(1);
    expect(EventActions.broadcast.calls.first().args[1]).toEqual(extension);
  });
});