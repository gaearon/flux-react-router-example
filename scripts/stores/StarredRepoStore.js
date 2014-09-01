'use strict';

var Im = require('immutable'),
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes'),
    EntityStoreTokens = require('./EntityStoreTokens'),
    { getIn, updateIn } = require('./StoreRoot'),
    { createIndexedListStore, handleIndexedListAction } = require('../utils/IndexedListStoreUtils');

var StarredRepoStore = createIndexedListStore(
  userLogin => getIn(['lists', 'starredReposByUser', userLogin], Im.Map())
);

StarredRepoStore.dispatchToken = AppDispatcher.register(function (payload) {
  AppDispatcher.waitFor(EntityStoreTokens);

  var action = payload.action,
      userLogin = action.login,
      updater;

  updater = handleIndexedListAction(action, {
    request: ActionTypes.REQUEST_STARRED_REPOS_PAGE,
    success: ActionTypes.REQUEST_STARRED_REPOS_PAGE_SUCCESS,
    error: ActionTypes.REQUEST_STARRED_REPOS_PAGE_ERROR,
  });

  if (updater) {
    updateIn(['lists', 'starredReposByUser', userLogin], Im.Map(), updater);
    StarredRepoStore.emitChange();
  }
});

module.exports = StarredRepoStore;