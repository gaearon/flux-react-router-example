'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    UserStore = require('./UserStore'),
    { createStore, mergeIntoBag, isInBag } = require('../utils/StoreUtils');

var _repos = {};

var RepoStore = createStore({
  contains(fullName, fields) {
    return isInBag(_repos, fullName, fields);
  },

  get(fullName) {
    return _repos[fullName];
  }
});

RepoStore.dispatchToken = AppDispatcher.register(function (payload) {
  var action = payload.action,
      response = action.response,
      entities = response && response.entities,
      fetchedRepos = entities && entities.repos;

  if (fetchedRepos) {
    mergeIntoBag(_repos, fetchedRepos);
    RepoStore.emitChange();
  }
});

module.exports = RepoStore;