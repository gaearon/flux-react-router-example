'use strict';

var request = require('superagent'),
    UserServerActionCreators = require('../actions/UserServerActionCreators'),
    APIUtils = require('./APIUtils'),
    normalizeUserResponse = APIUtils.normalizeUserResponse;

function requestAPI(endpoint) {
  return request('https://api.github.com/' + endpoint);
}

var UserAPI = {
  requestUser(login) {
    requestAPI('users/' + login).end(function (res) {
      if (!res.ok) {
        UserServerActionCreators.handleUserError(res.text);
        return;
      }

      var { response: userId, entities } = normalizeUserResponse(res.body);
      UserServerActionCreators.handleUserSuccess(userId, entities);
    });
  }
};

module.exports = UserAPI;