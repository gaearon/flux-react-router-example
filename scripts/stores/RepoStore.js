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

RepoStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload.action,
      response = action.response,
      entities = response && response.entities,
      fetchedRepos = entities && entities.repos;

  if (fetchedRepos) {
    mergeIntoBag(repos, fetchedRepos);
    RepoStore.emitChange();
  }
});

module.exports = RepoStore;