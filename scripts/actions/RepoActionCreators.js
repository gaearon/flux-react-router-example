'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes'),
    RepoAPI = require('../utils/RepoAPI'),
    RepoStore = require('../stores/RepoStore');

var RepoActionCreators = {
  requestRepo(fullName, fields) {
    if (RepoStore.contains(fullName, fields)) {
      return;
    }

    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_REPO,
      fullName: fullName
    });

    RepoAPI.requestRepo(fullName);
  }
};

module.exports = RepoActionCreators;