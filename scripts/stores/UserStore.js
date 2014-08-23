'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    StoreUtils = require('../utils/StoreUtils'),
    createStore = StoreUtils.createStore,
    mergeIntoEntityBag = StoreUtils.mergeIntoEntityBag;

var users = {};

var UserStore = createStore({
  get(login) {
    return users[login];
  }
});

AppDispatcher.register(function (payload) {
  var action = payload.action,
      entities = action.entities;

  if (entities && entities.users) {
    mergeIntoEntityBag(users, entities.users);
    UserStore.emitChange();
  }
});

module.exports = UserStore;