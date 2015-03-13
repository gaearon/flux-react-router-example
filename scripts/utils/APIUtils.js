'use strict';

import { Schema, arrayOf, normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import assign from 'object-assign';
import superagent from 'superagent';

const API_ROOT = 'https://api.github.com/';

const user = new Schema('users', { idAttribute: 'login' });
const repo = new Schema('repos', { idAttribute: 'fullName' });

repo.define({
  owner: user
});

function extractPagination(response) {
  const { link } = response.headers;
  if (!link) {
    return null;
  }

  const nextLink = link.split(',').filter(s => s.indexOf('rel="next"') > -1)[0];
  if (!nextLink) {
    return null;
  }

  return {
    nextPageUrl: nextLink.split(';')[0].slice(1, -1)
  };
}

export function request(endpoint) {
  if (endpoint.indexOf(API_ROOT) === -1) {
    endpoint = API_ROOT + endpoint;
  }

  return superagent(endpoint);
}

export function normalizeUserResponse(response) {
  return assign(
    normalize(camelizeKeys(response.body), user),
    extractPagination(response)
  );
}

export function normalizeUserArrayResponse(response) {
  return assign(
    normalize(camelizeKeys(response.body), arrayOf(user)),
    extractPagination(response)
  );
}

export function normalizeRepoResponse(response) {
  return assign(
    normalize(camelizeKeys(response.body), repo),
    extractPagination(response)
  );
}

export function normalizeRepoArrayResponse(response) {
  return assign(
    normalize(camelizeKeys(response.body), arrayOf(repo)),
    extractPagination(response)
  );
}