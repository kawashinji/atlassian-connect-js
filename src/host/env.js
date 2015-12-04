export default function () {
  return {
    internals: {
      getLocation: function () {
        return window.location.href;
      }
    }
  };
}