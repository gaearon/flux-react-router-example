import { union, without } from 'underscore';
import invariant from 'invariant';

/**
 * Encapsulates a paginated lists of IDs.
 */
export default class PaginatedList {
  constructor(ids) {
    this._ids = ids || [];
    this._pageCount = 0;
    this._nextPageUrl = undefined;
    this._isExpectingPage = false;
  }

  getIds() {
    return this._ids;
  }

  getPageCount() {
    return this._pageCount;
  }

  isExpectingPage() {
    return this._isExpectingPage;
  }

  getNextPageUrl() {
    return this._nextPageUrl;
  }

  isLastPage() {
    return !this.getNextPageUrl() && this.getPageCount() > 0;
  }

  prepend(id) {
    this._ids = union([id], this._ids);
  }

  remove(id) {
    this._ids = without(this._ids, id);
  }

  expectPage() {
    invariant(
      !this._isExpectingPage,
      'Cannot call expectPage twice without prior cancelPage or ' +
      'receivePage call.'
    );
    this._isExpectingPage = true;
  }

  cancelPage() {
    invariant(
      this._isExpectingPage,
      'Cannot call cancelPage without prior expectPage call.'
    );
    this._isExpectingPage = false;
  }

  receivePage(newIds, nextPageUrl) {
    invariant(
      this._isExpectingPage,
      'Cannot call receivePage without prior expectPage call.'
    );

    if (newIds.length) {
      this._ids = union(this._ids, newIds);
    }

    this._isExpectingPage = false;
    this._nextPageUrl = nextPageUrl;
    this._pageCount++;
  }
}
