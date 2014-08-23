'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes'),
    { createIndexedPaginatedStore } = require('../utils/PaginatedStoreUtils');

var StargazerUserActions = {
  request: ActionTypes.REQUEST_STARGAZER_PAGE,
  success: ActionTypes.REQUEST_STARGAZER_PAGE_SUCCESS,
  error: ActionTypes.REQUEST_STARGAZER_PAGE_ERROR,
};

var { store, handler } = createIndexedPaginatedStore(
  action => action.fullName,
  StargazerUserActions
);

AppDispatcher.register(function (payload) {
  handler(payload);
});

module.exports = store;