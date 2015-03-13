'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import UserAPI from '../api/UserAPI';
import UserStore from '../stores/UserStore';
import StargazersByRepoStore from '../stores/StargazersByRepoStore';

export default {
  requestUser(login, fields) {
    if (UserStore.contains(login, fields)) {
      return;
    }

    // Although this action is currently not handled by any store,
    // it is fired for consistency. You might want to use it later,
    // e.g. to show a spinner or have a more detailed log.

    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_USER,
      login
    });

    UserAPI.requestUser(login);
  },

  requestStargazerPage(fullName, isInitialRequest) {
    if (StargazersByRepoStore.isExpectingPage(fullName) ||
        StargazersByRepoStore.isLastPage(fullName)) {
      return;
    }

    if (isInitialRequest && StargazersByRepoStore.getPageCount(fullName) > 0) {
      return;
    }

    AppDispatcher.handleViewAction({
      type: ActionTypes.REQUEST_STARGAZER_PAGE,
      fullName
    });

    const nextPageUrl = StargazersByRepoStore.getNextPageUrl(fullName);
    UserAPI.requestStargazerPage(fullName, nextPageUrl);
  }
};
