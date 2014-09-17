'use strict';

var Im = require('immutable'),
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes'),
    EntityStoreTokens = require('./EntityStoreTokens'),
    { getIn, updateIn } = require('./StoreRoot'),
    { createIndexedListStore, handleIndexedListAction } = require('../utils/IndexedListStoreUtils');

var StargazerUserStore = createIndexedListStore(
  repoFullName => getIn(['lists', 'stargazersByRepo', repoFullName], Im.Map())
);

StargazerUserStore.dispatchToken = AppDispatcher.register(function (payload) {
  AppDispatcher.waitFor(EntityStoreTokens);

  var action = payload.action,
      repoFullName = action.fullName,
      updater;

  updater = handleIndexedListAction(action, {
    request: ActionTypes.REQUEST_STARGAZER_PAGE,
    success: ActionTypes.REQUEST_STARGAZER_PAGE_SUCCESS,
    error: ActionTypes.REQUEST_STARGAZER_PAGE_ERROR,
  });

  if (updater) {
    updateIn(['lists', 'stargazersByRepo', repoFullName], Im.Map(), updater);
    StargazerUserStore.emitChange();
  }
});

module.exports = StargazerUserStore;