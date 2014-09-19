'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes'),
    UserStore = require('./UserStore'),
    PaginatedStoreUtils = require('../utils/PaginatedStoreUtils'),
    { createIndexedListStore, createListActionHandler } = PaginatedStoreUtils;

var StargazersByRepoStore = createIndexedListStore({
  getUsers(repoFullName) {
    return this.getIds(repoFullName).map(UserStore.get);
  }
});

var handleListAction = createListActionHandler({
  request: ActionTypes.REQUEST_STARGAZER_PAGE,
  success: ActionTypes.REQUEST_STARGAZER_PAGE_SUCCESS,
  error: ActionTypes.REQUEST_STARGAZER_PAGE_ERROR,
});

AppDispatcher.register(function (payload) {
  AppDispatcher.waitFor([UserStore.dispatchToken]);

  var action = payload.action,
      fullName = action.fullName;

  if (fullName) {
    handleListAction(
      action,
      StargazersByRepoStore.getList(fullName),
      StargazersByRepoStore.emitChange
    );
  }
});

module.exports = StargazersByRepoStore;