'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes'),
    RepoAPI = require('../utils/RepoAPI'),
    StarredRepoStore = require('../stores/StarredRepoStore'),
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
  },

  requestStarredReposPage(login, isInitialRequest) {
    if (StarredRepoStore.isExpectingPageFor(login) ||
        StarredRepoStore.isLastPageFor(login)) {
      return;
    }

    if (isInitialRequest && StarredRepoStore.getPageCountFor(login) > 0) {
      return;
    }

    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_STARRED_REPOS_PAGE,
      login: login
    });

    var nextPageUrl = StarredRepoStore.getNextPageUrlFor(login);
    RepoAPI.requestStarredReposPage(login, nextPageUrl);
  }
};

module.exports = RepoActionCreators;