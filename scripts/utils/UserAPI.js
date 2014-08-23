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

      var { entities } = normalizeUserResponse(res.body);
      UserServerActionCreators.handleUserSuccess(entities);
    });
  }
};

module.exports = UserAPI;