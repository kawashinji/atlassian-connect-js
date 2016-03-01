import $ from '../dollar';
import _ from '../underscore';
import EventDispatcher from 'dispatchers/event_dispatcher';

class Flag {
  constructor(options, callback, idPrefix) {
    const _id = idPrefix + callback._id;

    this.flag = AJS.flag({
      type: options.type,
      title: options.title,
      body: AJS.escapeHtml(options.body),
      close: options.close
    });

    $(this.flag).attr('id', _id);
  }

  on(event, callback) {
    const id = this.flag.id;
    EventDispatcher.register('flag-' + event, (data) => {
      if (data.id === id) {
        callback();
      }
    });
  }

  close() {
    this.flag.close();
  }
}

const FlagComponent = Flag;
export default FlagComponent;