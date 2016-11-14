import Events from './events';
import AP from 'simple-xdm/combined';

class PublicEvents extends Events {
  constructor(){
    super();
    this.methods = ['offPublic', 'offAllPublic', 'offAnyPublic', 'onPublic', 'onAnyPublic', 'oncePublic'];
  }

  _filterEval(filter, toCompare){
    var value = true;
    switch(typeof filter) {
    case 'function':
      value = Boolean(filter.call(null, toCompare));
      break;
    case 'object':
      value = Object.getOwnPropertyNames(filter).every(function(prop){
        return toCompare[prop] === filter[prop];
      });
      break;
    }
    return value;
  }

  on(name, listener, filter){
    listener._wrapped = function(data){
      if(this._filterEval(filter, data.sender)) {
        listener.apply(null, data.event);
      }
    }.bind(this);
    super.on(name, listener._wrapped);
  }

  off(name, listener) {
    if(listener._wrapped) {
      super.off(name, listener._wrapped);
    } else {
      super.off(name, listener);
    }
  }

  onAny(listener, filter) {
    listener._wrapped = function(data){
      if(this._filterEval(filter, data.sender)) {
        listener.apply(null, data.event);
      }
    };
    super.onAny(listener._wrapped);
  }

  offAny(listener, filter) {
    if(listener._wrapped) {
      super.offAny(name, listener._wrapped);
    } else {
      super.offAny(name, listener);
    }
  }

}

export default new PublicEvents;