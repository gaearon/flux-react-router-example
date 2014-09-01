'use strict';

var Im = require('immutable');

var root;

function setRoot(newRoot) {
  if (root === newRoot) {
    return false;
  }

  root = newRoot;

  if ('production' !== process.env.NODE_ENV) {
    window['__StoreRoot'] = root.toJS();
  }

  return true;
}

setRoot(Im.Map());

var StoreRoot = {
  getIn(keyPath, notSetValue) {
    return root.getIn(keyPath, notSetValue);
  },

  updateIn(keyPath, notSetValue, updater) {
    var oldRoot = root,
        newRoot = root.updateIn(keyPath, notSetValue, updater),
        didUpdate;

    didUpdate = setRoot(newRoot);

    if ('production' !== process.env.NODE_ENV && didUpdate) {
      var oldVal = oldRoot.getIn(keyPath),
          newVal = newRoot.getIn(keyPath);

      console.log('*', keyPath.join('/'));
      console.log('    old:', oldVal && oldVal.toJS());
      console.log('    new:', newVal && newVal.toJS());
    }
  }
};

module.exports = StoreRoot;