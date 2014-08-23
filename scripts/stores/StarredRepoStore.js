'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes'),
    { createIndexedPaginatedStore } = require('../utils/PaginatedStoreUtils');

var StarredRepoActions = {
  request: ActionTypes.REQUEST_STARRED_REPOS_PAGE,
  success: ActionTypes.REQUEST_STARRED_REPOS_PAGE_SUCCESS,
  error: ActionTypes.REQUEST_STARRED_REPOS_PAGE_ERROR,
};

var { store, handler } = createIndexedPaginatedStore(
  action => action.login,
  StarredRepoActions
);

AppDispatcher.register(function (payload) {
  handler(payload);
});

module.exports = store;