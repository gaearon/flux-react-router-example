'use strict';

import UserServerActionCreators from '../actions/UserServerActionCreators';
import {
  request,
  normalizeUserResponse,
  normalizeUserArrayResponse
} from '../utils/APIUtils';

export default {
  requestUser(login) {
    request(`users/${login}`).end(function (err, res) {
      if (err) {
        UserServerActionCreators.handleUserError(res.text);
        return;
      }

      const response = normalizeUserResponse(res);
      UserServerActionCreators.handleUserSuccess(response);
    });
  },

  requestStargazerPage(fullName, serverSuppliedUrl) {
    const url = serverSuppliedUrl || `repos/${fullName}/stargazers`;

    request(url).end(function (err, res) {
      if (err) {
        UserServerActionCreators.handleStargazerPageError(fullName, res.text);
        return;
      }

      const response = normalizeUserArrayResponse(res);
      UserServerActionCreators.handleStargazerPageSuccess(fullName, response);
    });
  }
};
