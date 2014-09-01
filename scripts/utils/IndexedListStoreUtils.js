'use strict';

var Im = require('immutable'),
    invariant = require('react/lib/invariant'),
    { createStore } = require('./StoreUtils'),
    { getAll, isExpectingPage, isLastPage, getNextPageUrl, getPageCount,
      requestPage, cancelPage, receivePage } = require('../utils/PaginationUtils');

function createIndexedListStore(getListById) {
  return createStore({
    getAllFor(id) {
      var data = getListById(id);
      return getAll(data);
    },

    isExpectingPageFor(id) {
      var data = getListById(id);
      return isExpectingPage(data);
    },

    isLastPageFor(id) {
      var data = getListById(id);
      return isLastPage(data);
    },

    getNextPageUrlFor(id) {
      var data = getListById(id);
      return getNextPageUrl(data);
    },

    getPageCountFor(id) {
      var data = getListById(id);
      return getPageCount(data);
    }
  });
}

function handleIndexedListAction(action, actions) {
  invariant(actions.request, 'Pass a valid request action.');
  invariant(actions.error, 'Pass a valid error action.');
  invariant(actions.success, 'Pass a valid success action.');

  switch (action.type) {
  case actions.request:
    return requestPage;

  case actions.error:
    return cancelPage;

  case actions.success:
    return (data) => receivePage(
      data,
      action.response.result,
      action.response.nextPageUrl
    );
  }
}

module.exports = {
  createIndexedListStore,
  handleIndexedListAction
};