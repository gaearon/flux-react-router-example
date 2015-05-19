import { register, waitFor } from '../AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import RepoStore from './RepoStore';
import UserStore from './UserStore';
import {
  createIndexedListStore,
  createListActionHandler
} from '../utils/PaginatedStoreUtils';

const StarredReposByUserStore = createIndexedListStore({
  getRepos(userLogin) {
    return this.getIds(userLogin).map(RepoStore.get);
  }
});

const handleListAction = createListActionHandler({
  request: ActionTypes.REQUEST_STARRED_REPOS_PAGE,
  success: ActionTypes.REQUEST_STARRED_REPOS_PAGE_SUCCESS,
  failure: ActionTypes.REQUEST_STARRED_REPOS_PAGE_ERROR
});

register(action => {
  // Let the entity stores consume entities first, or else by the time we
  // emit a change in IDs, they might not have entities for those IDs.
  waitFor([RepoStore.dispatchToken, UserStore.dispatchToken]);

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
