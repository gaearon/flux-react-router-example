'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');

var {
  createStore,
  mergeIntoBag,
  isInBag
} = require('../utils/StoreUtils');

var users = {};

var UserStore = createStore({
  contains(login, fields) {
    return isInBag(users, login, fields);
  },

  get(login) {
    return users[login];
  }
});

UserStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload.action,
      response = action.response,
      entities = response && response.entities,
      fetchedUsers = entities && entities.users;

  if (fetchedUsers) {
    mergeIntoBag(users, fetchedUsers);
    UserStore.emitChange();
  }
});

module.exports = UserStore;