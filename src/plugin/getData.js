import rpc from './rpc';

export default rpc.extend(function (remote) {
  return {
    apis: {
      getData: function (callback) {
        remote.getData(callback);
      }
    }
  }
};