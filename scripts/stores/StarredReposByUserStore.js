'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import RepoStore from './RepoStore';
import UserStore from './UserStore';
import { createIndexedListStore, createListActionHandler }
  from '../utils/PaginatedStoreUtils';

const StarredReposByUserStore = createIndexedListStore({
  getRepos(userLogin) {
    return this.getIds(userLogin).map(RepoStore.get);
  }
});

const handleListAction = createListActionHandler({
  request: ActionTypes.REQUEST_STARRED_REPOS_PAGE,
  success: ActionTypes.REQUEST_STARRED_REPOS_PAGE_SUCCESS,
  error: ActionTypes.REQUEST_STARRED_REPOS_PAGE_ERROR
});

AppDispatcher.register((payload) => {
  AppDispatcher.waitFor([ RepoStore.dispatchToken, UserStore.dispatchToken ]);

  const { action } = payload;
  const { login } = action;

  if (login) {
    handleListAction(
      action,
      StarredReposByUserStore.getList(login),
      StarredReposByUserStore.emitChange
    );
  }
});

export default StarredReposByUserStore;
