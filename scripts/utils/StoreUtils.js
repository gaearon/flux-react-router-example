'use strict';

var EventEmitter = require('events').EventEmitter,
    merge = require('react/lib/merge'),
    shallowEqual = require('react/lib/shallowEqual');

var CHANGE_EVENT = 'change';

var StoreUtils = {
  createStore(spec) {
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
  },

  isInBagWith(bag, id, fields) {
    if (!fields) {
      fields = [];
    }

    var item = bag[id];
    if (!bag[id]) {
      return;
    }

    return fields.every(field => item.hasOwnProperty(field));
  },

  mergeIntoBag(bag, entities, transform) {
    if (!transform) {
      transform = (x) => x;
    }

    for (var key in entities) {
      if (!entities.hasOwnProperty(key)) {
        continue;
      }

      if (!bag.hasOwnProperty(key)) {
        bag[key] = transform(entities[key]);
      } else if (!shallowEqual(bag[key], entities[key])) {
        bag[key] = transform(merge(bag[key], entities[key]));
      }
    }
  }
};

module.exports = StoreUtils;