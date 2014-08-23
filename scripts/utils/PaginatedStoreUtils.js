'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher'),
    invariant = require('react/lib/invariant'),
    ContentStores = require('../stores/ContentStores'),
    PaginatedList = require('./PaginatedList'),
    { createStore } = require('./StoreUtils');

var PaginatedStoreUtils = {
  createIndexedPaginatedStore(getIndexFromAction, {
    request: requestAction,
    success: successAction,
    error: errorAction
  }) {

    invariant(requestAction, 'Pass a valid request action.');
    invariant(successAction, 'Pass a valid success action.');
    invariant(errorAction, 'Pass a valid error action.');

    var lists = {},
        store,
        handler;

    function applyIfExists(id, f) {
      var list = lists[id];
      return list ? f(list) : null;
    }

    store = createStore({
      getAllFor(id) {
        return applyIfExists(id, list => list.getAll());
      },

      getPageCountFor(id) {
        return applyIfExists(id, list => list.getPageCount());
      },

      isFetchingFor(id) {
        return applyIfExists(id, list => list.isExpectingPage());
      },

      hasNextPageFor(id) {
        return applyIfExists(id, list => list.hasNextPage());
      },

      getNextPageUrlFor(id) {
       return applyIfExists(id, list => list.getNextPageUrl());
      }
    });

    handler = function (payload) {
      var action = payload.action,
          id = getIndexFromAction(action);

      switch (action.type) {
      case requestAction:
        if (!lists[id]) {
          lists[id] = new PaginatedList();
        }

        lists[id].expectPage();
        store.emitChange();
        break;

      case errorAction:
        lists[id].cancelPage();
        store.emitChange();
        break;

      case successAction:
        AppDispatcher.waitFor(ContentStores.map(store => store.dispatchToken));

        var { result, nextPageUrl } = action.response;
        lists[id].receivePage(result, nextPageUrl);
        store.emitChange();
        break;
      }
    };

    return {
      store: store,
      handler: handler
    };
  }
};

module.exports = PaginatedStoreUtils;