import { createStore } from './StoreUtils';
import PaginatedList from '../utils/PaginatedList';
import invariant from 'react/lib/invariant';

const PROXIED_PAGINATED_LIST_METHODS = [
  'getIds', 'getPageCount', 'getNextPageUrl',
  'isExpectingPage', 'isLastPage'
];

function createListStoreSpec({ getList, callListMethod }) {
  const spec = { getList };

  PROXIED_PAGINATED_LIST_METHODS.forEach(method => {
    spec[method] = (...args) => {
      return callListMethod(method, args);
    };
  });

  return spec;
}

/**
 * Creates a simple paginated store that represents a global list (e.g. feed).
 */
export function createListStore(spec) {
  const list = new PaginatedList();

  const getList = () => list;

  const callListMethod = (method, args) => {
    return list[method].call(list, args);
  };

  return createStore(
    Object.assign(createListStoreSpec({
      getList,
      callListMethod
    }), spec)
  );
}

/**
 * Creates an indexed paginated store that represents a one-many
 * relationship (e.g. user's posts). Expects foreign key ID to be
 * passed as first parameter to store methods.
 */
export function createIndexedListStore(spec) {
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
    invariant(
      typeof id !== 'undefined',
      'Indexed pagination store methods expect ID as first parameter.'
    );

    const list = getList(id);
    return list[method].call(list, args);
  };

  return createStore(
    Object.assign(createListStoreSpec({
      getList,
      callListMethod
    }), spec)
  );
}

/**
 * Creates a handler that responds to list store pagination actions.
 */
export function createListActionHandler(types) {
  const { request, failure, success } = types;

  invariant(request, 'Pass a valid request action type.');
  invariant(failure, 'Pass a valid failure action type.');
  invariant(success, 'Pass a valid success action type.');

  return (action, list, emitChange) => {
    switch (action.type) {
    case request:
      list.expectPage();
      emitChange();
      break;

    case failure:
      list.cancelPage();
      emitChange();
      break;

    case success:
      list.receivePage(
        action.response.result,
        action.response.nextPageUrl
      );
      emitChange();
      break;
    }
  };
}
