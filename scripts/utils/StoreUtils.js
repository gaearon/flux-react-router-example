'use strict';

var _ = require('underscore'),
    EventEmitter = require('events').EventEmitter,
    merge = require('react/lib/merge'),
    shallowEqual = require('react/lib/shallowEqual'),
    CHANGE_EVENT = 'change';

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

    _.each(store, function (val, key) {
      if (_.isFunction(val)) {
        store[key] = store[key].bind(store);
      }
    });

    store.setMaxListeners(0);
    return store;
  },

  isInBag(bag, id, fields) {
    var item = bag[id];
    if (!bag[id]) {
      return false;
    }

    if (fields) {
      return fields.every(field => item.hasOwnProperty(field));
    } else {
      return true;
    }
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