import { register } from '../AppDispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';
import selectn from 'selectn';

const _repos = {};

const RepoStore = createStore({
  contains(fullName, fields) {
    return isInBag(_repos, fullName, fields);
  },

  get(fullName) {
    return _repos[fullName];
  }
});

RepoStore.dispatchToken = register(action => {
  const responseRepos = selectn('response.entities.repos', action);
  if (responseRepos) {
    mergeIntoBag(_repos, responseRepos);
    RepoStore.emitChange();
  }
});

export default RepoStore;
