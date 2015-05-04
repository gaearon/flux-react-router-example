'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
  handleRepoSuccess(response) {
    AppDispatcher.dispatch({
      type: ActionTypes.REQUEST_REPO_SUCCESS,
      response
    });
  },

  handleRepoError(err) {
    console.log(err);

    AppDispatcher.dispatch({
      type: ActionTypes.REQUEST_REPO_ERROR
    });
  },

  handleStarredReposPageSuccess(login, response) {
    AppDispatcher.dispatch({
      type: ActionTypes.REQUEST_STARRED_REPOS_PAGE_SUCCESS,
      login,
      response
    });
  },

  handleStarredReposPageError(login, err) {
    console.log(err);

    AppDispatcher.dispatch({
      type: ActionTypes.REQUEST_STARRED_REPOS_PAGE_ERROR,
      login
    });
  }
};
