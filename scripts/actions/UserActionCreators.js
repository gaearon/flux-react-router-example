import { dispatchAsync } from '../AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as UserAPI from '../api/UserAPI';
import UserStore from '../stores/UserStore';
import StargazersByRepoStore from '../stores/StargazersByRepoStore';

export function requestUser(login, fields) {
  // Exit early if we know enough about this user
  if (UserStore.contains(login, fields)) {
    return;
  }

  dispatchAsync(UserAPI.getUser(login), {
    request: ActionTypes.REQUEST_USER,
    success: ActionTypes.REQUEST_USER_SUCCESS,
    failure: ActionTypes.REQUEST_USER_ERROR
  }, { login });
}

export function requestStargazerPage(fullName, isInitialRequest) {
  // Exit early if already fetching, or if there is nothing to fetch.
  if (StargazersByRepoStore.isExpectingPage(fullName) ||
      StargazersByRepoStore.isLastPage(fullName)) {
    return;
  }

  // Ignore first page request when component is mounting if we already
  // loaded at least one page before. This gives us instant Back button.
  if (isInitialRequest && StargazersByRepoStore.getPageCount(fullName) > 0) {
    return;
  }

  const nextPageUrl = StargazersByRepoStore.getNextPageUrl(fullName);
  dispatchAsync(UserAPI.getStargazerPage(fullName, nextPageUrl), {
    request: ActionTypes.REQUEST_STARGAZER_PAGE,
    success: ActionTypes.REQUEST_STARGAZER_PAGE_SUCCESS,
    failure: ActionTypes.REQUEST_STARGAZER_PAGE_ERROR
  }, { fullName });
}
