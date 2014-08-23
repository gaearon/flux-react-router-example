'use strict';

var UserServerActionCreators = require('../actions/UserServerActionCreators');

var {
  request,
  normalizeUserResponse,
  normalizeUserArrayResponse
} = require('./APIUtils');

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
  },

  requestStargazerPage(fullName, serverSuppliedUrl) {
    var url = serverSuppliedUrl || 'repos/' + fullName + '/stargazers';

    request(url).end(function (res) {
      if (!res.ok) {
        UserServerActionCreators.handleStargazerPageError(fullName, res.text);
        return;
      }

      var response = normalizeUserArrayResponse(res);
      UserServerActionCreators.handleStargazerPageSuccess(fullName, response);
    });
  }
};

module.exports = UserAPI;