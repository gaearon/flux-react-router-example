'use strict';

var RepoServerActionCreators = require('../actions/RepoServerActionCreators'),
    { request, normalizeRepoResponse } = require('./APIUtils');

var RepoAPI = {
  requestRepo(fullName) {
    request('repos/' + fullName).end(function (res) {
      if (!res.ok) {
        RepoServerActionCreators.handleRepoError(res.text);
        return;
      }

      var { entities } = normalizeRepoResponse(res.body);
      RepoServerActionCreators.handleRepoSuccess(entities);
    });
  }
};

module.exports = RepoAPI;