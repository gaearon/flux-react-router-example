'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    StoreUtils = require('../utils/StoreUtils'),
    createStore = StoreUtils.createStore,
    mergeIntoEntityBag = StoreUtils.mergeIntoEntityBag;

var repos = {};

var RepoStore = createStore({
  get(fullName) {
    return repos[fullName];
  }
});

AppDispatcher.register(function (payload) {
  var action = payload.action,
      entities = action.entities;

  if (entities && entities.repos) {
    mergeIntoEntityBag(repos, entities.repos);
    RepoStore.emitChange();
  }
});

module.exports = RepoStore;