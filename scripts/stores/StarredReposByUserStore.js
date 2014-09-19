'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes'),
    RepoStore = require('./RepoStore'),
    PaginatedStoreUtils = require('../utils/PaginatedStoreUtils'),
    { createIndexedListStore, createListActionHandler } = PaginatedStoreUtils;

var StarredReposByUserStore = createIndexedListStore({
  getRepos(userLogin) {
    return this.getIds(userLogin).map(RepoStore.get);
  }
});

var handleListAction = createListActionHandler({
  request: ActionTypes.REQUEST_STARRED_REPOS_PAGE,
  success: ActionTypes.REQUEST_STARRED_REPOS_PAGE_SUCCESS,
  error: ActionTypes.REQUEST_STARRED_REPOS_PAGE_ERROR,
});

AppDispatcher.register(function (payload) {
  AppDispatcher.waitFor([RepoStore.dispatchToken]);

  var action = payload.action,
      login = action.login;

  if (login) {
    handleListAction(
      action,
      StarredReposByUserStore.getList(login),
      StarredReposByUserStore.emitChange
    );
  }
});

module.exports = StarredReposByUserStore;