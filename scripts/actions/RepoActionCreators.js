import { dispatchAsync } from '../AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import * as RepoAPI from '../api/RepoAPI';
import StarredReposByUserStore from '../stores/StarredReposByUserStore';
import RepoStore from '../stores/RepoStore';

export function requestRepo(fullName, fields) {
  // Exit early if we know about this repo
  if (RepoStore.contains(fullName, fields)) {
    return;
  }

  dispatchAsync(RepoAPI.getRepo(fullName), {
    request: ActionTypes.REQUEST_REPO,
    success: ActionTypes.REQUEST_REPO_SUCCESS,
    failure: ActionTypes.REQUEST_REPO_ERROR
  }, { fullName });
}

export function requestStarredReposPage(login, isInitialRequest) {
  // Exit early if already fetching, or if there is nothing to fetch.
  if (StarredReposByUserStore.isExpectingPage(login) ||
      StarredReposByUserStore.isLastPage(login)) {
    return;
  }

  // Ignore first page request when component is mounting if we already
  // loaded at least one page before. This gives us instant Back button.
  if (isInitialRequest && StarredReposByUserStore.getPageCount(login) > 0) {
    return;
  }

  const nextPageUrl = StarredReposByUserStore.getNextPageUrl(login);
  dispatchAsync(RepoAPI.getStarredReposPage(login, nextPageUrl), {
    request: ActionTypes.REQUEST_STARRED_REPOS_PAGE,
    success: ActionTypes.REQUEST_STARRED_REPOS_PAGE_SUCCESS,
    failure: ActionTypes.REQUEST_STARRED_REPOS_PAGE_ERROR
  }, { login });
}
