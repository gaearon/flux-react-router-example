'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes');

var UserServerActionCreators = {
  handleUserSuccess(response) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_USER_SUCCESS,
      response: response
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
      fullName: fullName,
      response: response
    });
  },

  handleStargazerPageError(fullName, err) {
    console.log(err);

    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_STARGAZER_PAGE_ERROR,
      fullName: fullName
    });
  }
};

module.exports = UserServerActionCreators;