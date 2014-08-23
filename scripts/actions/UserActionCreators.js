'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    ActionTypes = require('../constants/ActionTypes'),
    UserAPI = require('../utils/UserAPI'),
    UserStore = require('../stores/UserStore');

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
  }
};

module.exports = UserActionCreators;