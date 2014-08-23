'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes');

var UserServerActionCreators = {
  handleUserSuccess(userId, entities) {
    AppDispatcher.handleServerAction({
      type: ActionTypes.REQUEST_USER_SUCCESS,
      entities: entities
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