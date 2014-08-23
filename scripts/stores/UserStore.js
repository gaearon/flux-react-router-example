'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    StoreUtils = require('../utils/StoreUtils'),
    createStore = StoreUtils.createStore,
    mergeIntoBag = StoreUtils.mergeIntoBag,
    isInBagWith = StoreUtils.isInBagWith;

var users = {};

var UserStore = createStore({
  contains(login, fields) {
    return isInBagWith(users, login, fields);
  },

  get(login) {
    return users[login];
  }
});

AppDispatcher.register(function (payload) {
  var action = payload.action,
      entities = action.entities;

  if (entities && entities.users) {
    mergeIntoBag(users, entities.users);
    UserStore.emitChange();
  }
});

module.exports = UserStore;