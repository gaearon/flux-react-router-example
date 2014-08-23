'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');

var {
  createStore,
  mergeIntoBag,
  isInBag
} = require('../utils/StoreUtils');

var repos = {};

var RepoStore = createStore({
  contains(fullName, fields) {
    return isInBag(repos, fullName, fields);
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