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
  }
};

module.exports = UserServerActionCreators;