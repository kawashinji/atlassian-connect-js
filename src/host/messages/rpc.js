import messages from './api';

export default function () {
  return {
    internals: {
      showMessage(name, title, body, options) {
        return messages.showMessage(name, title, body, options);
      },

      clearMessage(id) {
        return messages.clearMessage(id);
      }
    }
  };
}