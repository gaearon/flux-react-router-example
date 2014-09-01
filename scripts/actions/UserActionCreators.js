'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes'),
    UserAPI = require('../utils/UserAPI'),
    UserStore = require('../stores/UserStore'),
    StargazerUserStore = require('../stores/StargazerUserStore');

var UserActionCreators = {
  requestUser(login, fields) {
    if (UserStore.contains(login, fields)) {
      return;
    }

    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_USER,
      login: login
    });

    UserAPI.requestUser(login);
  },

  requestStargazerPage(fullName, isInitialRequest) {
    if (StargazerUserStore.isExpectingPageFor(fullName) ||
        StargazerUserStore.isLastPageFor(fullName)) {
      return;
    }

    if (isInitialRequest && StargazerUserStore.getPageCountFor(fullName) > 0) {
      return;
    }

    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_STARGAZER_PAGE,
      fullName: fullName
    });

    var nextPageUrl = StargazerUserStore.getNextPageUrlFor(fullName);
    UserAPI.requestStargazerPage(fullName, nextPageUrl);
  }
};

module.exports = UserActionCreators;