'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes');

var RepoServerActionCreators = {
  handleRepoSuccess(entities) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_REPO_SUCCESS,
      entities: entities
    });
  },

  handleRepoError(err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_REPO_ERROR
    });
  }
};

module.exports = RepoServerActionCreators;