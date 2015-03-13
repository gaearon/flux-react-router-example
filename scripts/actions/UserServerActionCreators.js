'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
  handleUserSuccess(response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_USER_SUCCESS,
      response
    });
  },

  handleUserError(err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_USER_ERROR
    });
  },

  handleStargazerPageSuccess(fullName, response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_STARGAZER_PAGE_SUCCESS,
      fullName,
      response
    });
  },

  handleStargazerPageError(fullName, err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_STARGAZER_PAGE_ERROR,
      fullName
    });
  }
};
