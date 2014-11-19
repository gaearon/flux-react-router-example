'use strict';

var _ = require('underscore'),
    { EventEmitter } = require('events'),
    assign = require('object-assign'),
    shallowEqual = require('react/lib/shallowEqual'),
    CHANGE_EVENT = 'change';

var StoreUtils = {
  createStore(spec) {
    var store = assign({
      emitChange() {
        this.emit(CHANGE_EVENT);
      },

      addChangeListener(callback) {
        this.on(CHANGE_EVENT, callback);
      },

      removeChangeListener(callback) {
        this.removeListener(CHANGE_EVENT, callback);
      }
    }, spec, EventEmitter.prototype);

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
        bag[key] = transform(assign({}, bag[key], entities[key]));
      }
    }
  }
};

module.exports = StoreUtils;