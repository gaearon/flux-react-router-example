'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    { createStore, mergeIntoBag, isInBag } = require('../utils/StoreUtils');

var _users = {};

var UserStore = createStore({
  contains(login, fields) {
    return isInBag(_users, login, fields);
  },

  get(login) {
    return _users[login];
  }
});

UserStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload.action,
      response = action.response,
      entities = response && response.entities,
      fetchedUsers = entities && entities.users;

  if (fetchedUsers) {
    mergeIntoBag(_users, fetchedUsers);
    UserStore.emitChange();
  }
});

module.exports = UserStore;