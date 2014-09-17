'use strict';

var Im = require('immutable'),
    invariant = require('react/lib/invariant');

function getAll(data) {
  return data.get('items', Im.Vector());
}

function isExpectingPage(data) {
  return data.get('isExpectingPage', false);
}

function getNextPageUrl(data) {
  return data.get('nextPageUrl', null);
}

function getPageCount(data) {
  return data.get('pageCount', 0);
}

function isLastPage(data) {
  return !getNextPageUrl(data) && getPageCount(data) > 0;
}

function requestPage(data) {
  invariant(!isExpectingPage(data), 'Received a page request while a prior request is in progress.');
  invariant(!isLastPage(data), 'Received a page request while on last page.');
  return data.set('isExpectingPage', true);
}

function cancelPage(data) {
  invariant(isExpectingPage(data), 'Received an error without a prior page request.');
  return data.set('isExpectingPage', false);
}

function receivePage(data, newItems, nextPageUrl) {
  invariant(isExpectingPage(data), 'Received a page without a prior request.');
  return data
    .set('isExpectingPage', false)
    .set('nextPageUrl', nextPageUrl)
    .update('items', Im.Vector(), items => items.concat(newItems).toVector())
    .update('pageCount', 0, pageCount => pageCount + 1);
}

module.exports = {
  getAll,
  isExpectingPage,
  isLastPage,
  getPageCount,
  getNextPageUrl,
  requestPage,
  cancelPage,
  receivePage
};