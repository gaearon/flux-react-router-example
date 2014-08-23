'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    StoreUtils = require('../utils/StoreUtils'),
    createStore = StoreUtils.createStore,
    mergeIntoBag = StoreUtils.mergeIntoBag,
    isInBagWith = StoreUtils.isInBagWith;

var repos = {};

var RepoStore = createStore({
  contains(fullName, fields) {
    return isInBagWith(repos, fullName, fields);
  },

  get(fullName) {
    return repos[fullName];
  }
});

AppDispatcher.register(function (payload) {
  var action = payload.action,
      entities = action.entities;

  if (entities && entities.repos) {
    mergeIntoBag(repos, entities.repos);
    RepoStore.emitChange();
  }
});

module.exports = RepoStore;