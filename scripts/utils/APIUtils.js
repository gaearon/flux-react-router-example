'use strict';

var humps = require('humps'),
    normalizr = require('normalizr'),
    camelizeKeys = humps.camelizeKeys,
    Schema = normalizr.Schema,
    arrayOf = normalizr.arrayOf,
    normalize = normalizr.normalize,
    superagent = require('superagent');

var user = new Schema('users', { idAttribute: 'login' }),
    repo = new Schema('repos', { idAttribute: 'fullName' });

repo.define({
  owner: user
});

var APIUtils = {
  request(endpoint) {
    return superagent('https://api.github.com/' + endpoint);
  },

  normalizeUserResponse(response) {
    return normalize(camelizeKeys(response), user);
  },

  normalizeRepoResponse(response) {
    return normalize(camelizeKeys(response), repo);
  }
};

module.exports = APIUtils;