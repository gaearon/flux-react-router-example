'use strict';

var Im = require('immutable'),
    { createStore } = require('./StoreUtils');

function createEntityStore(getEntityById) {
  return createStore({
    contains(id, fields) {
      var item = getEntityById(id);
      if (!item) {
        return false;
      }

      if (fields) {
        return fields.every(field => item.has(field));
      } else {
        return true;
      }
    },

    get(id) {
      var item = getEntityById(id);
      if (item) {
        return item;
      }
    }
  });
}

function handleEntityAction(action, responseKey) {
  var receivedEntities = Im.fromJS(action).getIn(['response', 'entities', responseKey]);
  if (!receivedEntities) {
    return;
  }

  return entities => entities ?
    entities.mergeDeep(receivedEntities) :
    receivedEntities;
}

module.exports = {
  createEntityStore,
  handleEntityAction
};