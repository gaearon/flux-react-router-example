'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes');

var RepoServerActionCreators = {
  handleRepoSuccess(response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_REPO_SUCCESS,
      response: response
    });
  },

  handleRepoError(err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_REPO_ERROR
    });
  },

  handleStarredReposPageSuccess(login, response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_STARRED_REPOS_PAGE_SUCCESS,
      login: login,
      response: response
    });
  },

  handleStarredReposPageError(login, err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_STARRED_REPOS_PAGE_ERROR,
      login: login
    });
  }
};

module.exports = RepoServerActionCreators;