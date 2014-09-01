'use strict';

var Im = require('immutable'),
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    { getIn, updateIn } = require('./StoreRoot'),
    { createEntityStore, handleEntityAction } = require('../utils/EntityStoreUtils');

var UserStore = createEntityStore(
  login => getIn(['entities', 'users', login])
);

UserStore.dispatchToken = AppDispatcher.register(function (payload) {
  var updater = handleEntityAction(payload.action, 'users');
  if (updater) {
    updateIn(['entities', 'users'], updater);
    UserStore.emitChange();
  }
});


module.exports = UserStore;