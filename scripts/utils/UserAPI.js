'use strict';

var UserServerActionCreators = require('../actions/UserServerActionCreators'),
    { request, normalizeUserResponse } = require('./APIUtils');

var UserAPI = {
  requestUser(login) {
    request('users/' + login).end(function (res) {
      if (!res.ok) {
        UserServerActionCreators.handleUserError(res.text);
        return;
      }

      var response = normalizeUserResponse(res);
      UserServerActionCreators.handleUserSuccess(response);
    });
  }
};

module.exports = UserAPI;