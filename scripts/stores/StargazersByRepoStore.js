'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import RepoStore from './RepoStore';
import UserStore from './UserStore';
import { createIndexedListStore, createListActionHandler } from '../utils/PaginatedStoreUtils';

const StargazersByRepoStore = createIndexedListStore({
  getUsers(repoFullName) {
    return this.getIds(repoFullName).map(UserStore.get);
  }
});

const handleListAction = createListActionHandler({
  request: ActionTypes.REQUEST_STARGAZER_PAGE,
  success: ActionTypes.REQUEST_STARGAZER_PAGE_SUCCESS,
  error: ActionTypes.REQUEST_STARGAZER_PAGE_ERROR
});

AppDispatcher.register(function (payload) {
  AppDispatcher.waitFor([RepoStore.dispatchToken, UserStore.dispatchToken]);

  const { action } = payload;
  const { fullName } = action;

  if (fullName) {
    handleListAction(
      action,
      StargazersByRepoStore.getList(fullName),
      StargazersByRepoStore.emitChange
    );
  }
});

export default StargazersByRepoStore;
