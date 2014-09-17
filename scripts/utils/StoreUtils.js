'use strict';

var EventEmitter = require('events').EventEmitter,
    merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

function createStore(spec) {
  var store = merge(EventEmitter.prototype, merge(spec, {
    emitChange() {
      this.emit(CHANGE_EVENT);
    },

    addChangeListener(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }
  }));

  // Mute the warning because Stores will have a lot of subscribers
  store.setMaxListeners(0);

  return store;
}

module.exports = {
  createStore
};