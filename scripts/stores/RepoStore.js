'use strict';

var Im = require('immutable'),
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    { getIn, updateIn } = require('./StoreRoot'),
    { createEntityStore, handleEntityAction } = require('../utils/EntityStoreUtils');

var RepoStore = createEntityStore(
  fullName => getIn(['entities', 'users', fullName])
);

RepoStore.dispatchToken = AppDispatcher.register(function (payload) {
  var updater = handleEntityAction(payload.action, 'repos');
  if (updater) {
    updateIn(['entities', 'users'], updater);
    RepoStore.emitChange();
  }
});

module.exports = RepoStore;