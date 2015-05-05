import { each, isFunction } from 'underscore';
import { EventEmitter } from 'events';
import shallowEqual from 'react-pure-render/shallowEqual';

const CHANGE_EVENT = 'change';

export function createStore(spec) {
  const emitter = new EventEmitter();
  emitter.setMaxListeners(0);

  const store = Object.assign({
    emitChange() {
      emitter.emit(CHANGE_EVENT);
    },

    addChangeListener(callback) {
      emitter.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
      emitter.removeListener(CHANGE_EVENT, callback);
    }
  }, spec);

  // Auto-bind store methods for convenience
  each(store, (val, key) => {
    if (isFunction(val)) {
      store[key] = store[key].bind(store);
    }
  });

  return store;
}

export function isInBag(bag, id, fields) {
  let item = bag[id];
  if (!bag[id]) {
    return false;
  }

  if (fields) {
    return fields.every(field => item.hasOwnProperty(field));
  } else {
    return true;
  }
}

export function mergeIntoBag(bag, entities) {
  for (let id in entities) {
    if (!entities.hasOwnProperty(id)) {
      continue;
    }

    if (!bag.hasOwnProperty(id)) {
      bag[id] = entities[id];
    } else if (!shallowEqual(bag[id], entities[id])) {
      bag[id] = Object.assign({}, bag[id], entities[id]);
    }
  }
}
