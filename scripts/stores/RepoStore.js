'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';

const _repos = {};

const RepoStore = createStore({
  contains(fullName, fields) {
    return isInBag(_repos, fullName, fields);
  },

  get(fullName) {
    return _repos[fullName];
  }
});

RepoStore.dispatchToken = AppDispatcher.register(action => {
  const { response } = action;
  const entities = response && response.entities;
  const fetchedRepos = entities && entities.repos;

  if (fetchedRepos) {
    mergeIntoBag(_repos, fetchedRepos);
    RepoStore.emitChange();
  }
});

export default RepoStore;
