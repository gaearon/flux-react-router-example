'use strict';

import { createStore } from './StoreUtils';
import PaginatedList from '../utils/PaginatedList';
import invariant from 'react/lib/invariant';
import assign from 'object-assign';

const PROXIED_PAGINATED_LIST_METHODS = [
  'getIds', 'getPageCount', 'getNextPageUrl',
  'isExpectingPage', 'isLastPage'
];

const createListStoreSpec = ({ getList, callListMethod }) => {
  const spec = { getList };

  PROXIED_PAGINATED_LIST_METHODS.forEach(method => {
    spec[method] = (...args) => {
      return callListMethod(method, args);
    };
  });

  return spec;
};

export default {
  /**
   * Creates a simple paginated store that represents a global list (e.g. feed).
   */
  createListStore(spec) {
    const list = new PaginatedList();

    const getList = () => {
      return list;
    };

    const callListMethod = (method, args) => {
      return list[method].call(list, args);
    };

    return createStore(
      assign(createListStoreSpec({
        getList: getList,
        callListMethod: callListMethod
      }), spec)
    );
  },

  /**
   * Creates an indexed paginated store that represents a one-many relationship
   * (e.g. user's posts). Expects foreign key ID to be passed as first parameter
   * to store methods.
   */
  createIndexedListStore(spec) {
    const lists = {};
    const prefix = 'ID_';

    const getList = (id) => {
      const key = prefix + id;

      if (!lists[key]) {
        lists[key] = new PaginatedList();
      }

      return lists[key];
    };

    const callListMethod = (method, args) => {
      const id = args.shift();
      if (typeof id === 'undefined') {
        throw new Error('Indexed pagination store methods expect ID as first parameter.');
      }

      const list = getList(id);
      return list[method].call(list, args);
    };

    return createStore(
      assign(createListStoreSpec({
        getList: getList,
        callListMethod: callListMethod
      }), spec)
    );
  },

  /**
   * Creates a handler that responds to list store pagination actions.
   */
  createListActionHandler(actions) {
    const {
      request: requestAction,
      error: errorAction,
      success: successAction
    } = actions;

    invariant(requestAction, 'Pass a valid request action.');
    invariant(errorAction, 'Pass a valid error action.');
    invariant(successAction, 'Pass a valid success action.');

    return (action, list, emitChange) => {
      switch (action.type) {
      case requestAction:
        list.expectPage();
        emitChange();
        break;

      case errorAction:
        list.cancelPage();
        emitChange();
        break;

      case successAction:
        list.receivePage(
          action.response.result,
          action.response.nextPageUrl
        );
        emitChange();
        break;
      }
    };
  }
}
