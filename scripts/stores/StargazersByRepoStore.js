import AppDispatcher from '../AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import RepoStore from './RepoStore';
import UserStore from './UserStore';
import {
  createIndexedListStore,
  createListActionHandler
} from '../utils/PaginatedStoreUtils';

const StargazersByRepoStore = createIndexedListStore({
  getUsers(repoFullName) {
    return this.getIds(repoFullName).map(UserStore.get);
  }
});

const handleListAction = createListActionHandler({
  request: ActionTypes.REQUEST_STARGAZER_PAGE,
  success: ActionTypes.REQUEST_STARGAZER_PAGE_SUCCESS,
  failure: ActionTypes.REQUEST_STARGAZER_PAGE_ERROR
});

AppDispatcher.register(action => {
  // Let the entity stores consume entities first, or else by the time we
  // emit a change in IDs, they might not have entities for those IDs.
  AppDispatcher.waitFor([RepoStore.dispatchToken, UserStore.dispatchToken]);

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
