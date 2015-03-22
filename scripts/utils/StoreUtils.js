'use strict';

import { each, isFunction } from 'underscore';
import { EventEmitter } from 'events';
import assign from 'object-assign';
import shallowEqual from 'react/lib/shallowEqual';

const CHANGE_EVENT = 'change';

export default {
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

    each(store, (val, key) => {
      if (isFunction(val)) {
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
}
