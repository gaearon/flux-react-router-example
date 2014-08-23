'use strict';

var invariant = require('react/lib/invariant');

class PaginatedList {
  constructor(items) {
    this._items = items || [];
    this._pageCount = 0;
    this._isExpectingPage = false;
  }

  getAll() {
    return this._items;
  }

  getPageCount() {
    return this._pageCount;
  }

  isExpectingPage() {
    return this._isExpectingPage;
  }

  hasNextPage() {
    return !!this.getNextPageUrl();
  }

  getNextPageUrl() {
    return this._nextPageUrl;
  }

  expectPage() {
    invariant(!this._isExpectingPage, 'Cannot call expectPage twice without prior cancelPage or receivePage call.');
    this._isExpectingPage = true;
  }

  cancelPage() {
    invariant(this._isExpectingPage, 'Cannot call cancelPage without prior expectPage call.');
    this._isExpectingPage = false;
  }

  receivePage(newItems, nextPageUrl) {
    invariant(this._isExpectingPage, 'Cannot call receivePage without prior expectPage call.');

    if (newItems.length) {
      this._items = this._items.concat(newItems);
    }

    this._isExpectingPage = false;
    this._nextPageUrl = nextPageUrl;
    this._pageCount++;
  }
}

module.exports = PaginatedList;