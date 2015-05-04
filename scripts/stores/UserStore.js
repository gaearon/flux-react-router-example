'use strict';

import AppDispatcher from '../dispatcher/AppDispatcher';
import { createStore, mergeIntoBag, isInBag } from '../utils/StoreUtils';

const _users = {};

const UserStore = createStore({
  contains(login, fields) {
    return isInBag(_users, login, fields);
  },

  get(login) {
    return _users[login];
  }
});

UserStore.dispatchToken = AppDispatcher.register(action => {
  const { response } = action;
  const entities = response && response.entities;
  const fetchedUsers = entities && entities.users;

  if (fetchedUsers) {
    mergeIntoBag(_users, fetchedUsers);
    UserStore.emitChange();
  }
});

export default UserStore;
