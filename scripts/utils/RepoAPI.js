'use strict';

var RepoServerActionCreators = require('../actions/RepoServerActionCreators');

var {
  request,
  normalizeRepoResponse,
  normalizeRepoArrayResponse
} = require('./APIUtils');

var RepoAPI = {
  requestRepo(fullName) {
    request('repos/' + fullName).end(function (res) {
      if (!res.ok) {
        RepoServerActionCreators.handleRepoError(res.text);
        return;
      }

      var response = normalizeRepoResponse(res);
      RepoServerActionCreators.handleRepoSuccess(response);
    });
  },

  requestStarredReposPage(login, serverSuppliedUrl) {
    var url = serverSuppliedUrl || 'users/' + login + '/starred';

    request(url).end(function (res) {
      if (!res.ok) {
        RepoServerActionCreators.handleStarredReposPageError(login, res.text);
        return;
      }

      var response = normalizeRepoArrayResponse(res);
      RepoServerActionCreators.handleStarredReposPageSuccess(login, response);
    });
  }
};

module.exports = RepoAPI;