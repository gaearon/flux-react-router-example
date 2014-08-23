'use strict';

var humps = require('humps'),
    normalizr = require('normalizr'),
    camelizeKeys = humps.camelizeKeys,
    Schema = normalizr.Schema,
    arrayOf = normalizr.arrayOf,
    normalize = normalizr.normalize;

var user = new Schema('users', { idAttribute: 'login' }),
    repo = new Schema('repos');

var APIUtils = {
  normalizeUserResponse(response) {
    return normalize(camelizeKeys(response), user);
  }
};

module.exports = APIUtils;