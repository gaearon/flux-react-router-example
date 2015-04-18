'use strict';

import { Schema, arrayOf, normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import superagent from 'superagent';

const API_ROOT = 'https://api.github.com/';

const user = new Schema('users', { idAttribute: 'login' });
const repo = new Schema('repos', { idAttribute: 'fullName' });

repo.define({
  owner: user
});

function extractPagination (response) {
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

export default {
  request(endpoint) {
    if (endpoint.indexOf(API_ROOT) === -1) {
      endpoint = API_ROOT + endpoint;
    }

    return superagent(endpoint);
  },

  normalizeUserResponse(response) {
    return Object.assign(
      normalize(camelizeKeys(response.body), user),
      extractPagination(response)
    );
  },

  normalizeUserArrayResponse(response) {
    return Object.assign(
      normalize(camelizeKeys(response.body), arrayOf(user)),
      extractPagination(response)
    );
  },

  normalizeRepoResponse(response) {
    return Object.assign(
      normalize(camelizeKeys(response.body), repo),
      extractPagination(response)
    );
  },

  normalizeRepoArrayResponse(response) {
    return Object.assign(
      normalize(camelizeKeys(response.body), arrayOf(repo)),
      extractPagination(response)
    );
  }
};
