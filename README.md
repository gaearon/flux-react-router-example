flux-react-router-example
=========================

This is a sample Flux app I wrote on a weekend.  
It uses open Github API to display starred repos by users and stargazers by repo.

![](http://i.imgur.com/MxPpyPb.png)

I made it to document a few approaches I have tried while learning Flux.  
I tried to keep it close to real world (pagination, no fake localStorage APIs).

There are a few bits here I was especially interested in:

* It uses [Flux architecture](https://github.com/facebook/flux) and [react-router](https://github.com/rackt/react-router);
* It can show user page with partial known info and load details on the go;
* It supports pagination both for users and repos;
* It parses Github's nested JSON responses with [normalizr](https://github.com/gaearon/normalizr);
* Content Stores [don't need to contain a giant `switch` with actions](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/stores/UserStore.js#L25);
* “Back” is immediate (because all data is in Stores).

### Running

```
npm install
npm start
```

### How I Classify Stores

I tried to avoid some of the duplication I've seen in other Flux example, specifically in Stores.
I found it useful to logically divide Stores into three categories:

**Content Stores** hold all app entities. Everything that has an ID needs its own Content Store. Components that render individual items ask Content Stores for the fresh data.

Content Stores harvest their objects from *all* server actions. For example, `UserStore` [looks into `action.response.entities.users`](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/stores/UserStore.js#L25) if it exists *regardless* of which action fired. There is no need for a `switch`. [Normalizr](https://github.com/gaearon/normalizr) makes it easy to flatten any API reponses to this format.

```javascript
// Content Stores keep their data like this
{
  7: {
    id: 7,
    name: 'Dan'
  },
  ...
}
```

**List Stores** keep track of IDs of entities that appear in some global list (e.g. “feed”, “your notifications”). In this project, I don't have such Stores, but I thought I'd mention them anyway. They handle pagination.

They normally respond to just a few actions (e.g. `REQUEST_FEED`, `REQUEST_FEED_SUCCESS`, `REQUEST_FEED_ERROR`).

```javascript
// Paginated Stores keep their data like this
[7, 10, 5, ...]
```

**Indexed List Stores** are like List Stores but they define one-to-many relationship. For example, “user's subscribers”, “repository's stargazers”, “user's repositories”. They also handle pagination.

They also normally respond to just a few actions (e.g. `REQUEST_USER_REPOS`, `REQUEST_USER_REPOS_SUCCESS`, `REQUEST_USER_REPOS_ERROR`).

In most social apps, you'll have lots of these and you want to be able to quickly create one more of them.

```javascript
// Indexed Paginated Stores keep their data like this
{
  2: [7, 10, 5, ...],
  6: [7, 1, 2, ...],
  ...
}
```

Note: these are not actual classes or something; it's just how I like to think about Stores.
I made a few helpers though.

### [`StoreUtils`](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/utils/StoreUtils.js)

#### `createStore`

This method gives you the most basic Store:

```javascript
createStore(spec) {
  var store = merge(EventEmitter.prototype, merge(spec, {
    emitChange() {
      this.emit(CHANGE_EVENT);
    },

    addChangeListener(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }
  }));

  _.each(store, function (val, key) {
    if (_.isFunction(val)) {
      store[key] = store[key].bind(store);
    }
  });

  store.setMaxListeners(0);
  return store;
}
```

I use it to create all Stores.

#### `isInBag`, `mergeIntoBag`

Small helpers useful for Content Stores.

```javascript
isInBag(bag, id, fields) {
  var item = bag[id];
  if (!bag[id]) {
    return false;
  }

  if (fields) {
    return fields.every(field => item.hasOwnProperty(field));
  } else {
    return true;
  }
},

mergeIntoBag(bag, entities, transform) {
  if (!transform) {
    transform = (x) => x;
  }

  for (var key in entities) {
    if (!entities.hasOwnProperty(key)) {
      continue;
    }

    if (!bag.hasOwnProperty(key)) {
      bag[key] = transform(entities[key]);
    } else if (!shallowEqual(bag[key], entities[key])) {
      bag[key] = transform(merge(bag[key], entities[key]));
    }
  }
}
```

### [`PaginatedList`](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/utils/PaginatedList.js)

Stores pagination state and enforces certain assertions (can't fetch page while fetching, etc).

```javascript
class PaginatedList {
  constructor(ids) {
    this._ids = ids || [];
    this._pageCount = 0;
    this._nextPageUrl = null;
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
    return this.getNextPageUrl() === null && this.getPageCount() > 0;
  }

  prepend(id) {
    this._ids = _.union([id], this._ids);
  }

  remove(id) {
    this._ids = _.without(this._ids, id);
  }

  expectPage() {
    invariant(!this._isExpectingPage, 'Cannot call expectPage twice without prior cancelPage or receivePage call.');
    this._isExpectingPage = true;
  }

  cancelPage() {
    invariant(this._isExpectingPage, 'Cannot call cancelPage without prior expectPage call.');
    this._isExpectingPage = false;
  }

  receivePage(newIds, nextPageUrl) {
    invariant(this._isExpectingPage, 'Cannot call receivePage without prior expectPage call.');

    if (newIds.length) {
      this._ids = _.union(this._ids, newIds);
    }

    this._isExpectingPage = false;
    this._nextPageUrl = nextPageUrl || null;
    this._pageCount++;
  }
}
```

### [`PaginatedStoreUtils`](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/utils/PaginatedStoreUtils.js)
#### `createIndexedPaginatedStore`

Makes creation of Indexed List Stores as simple as possible by providing boilerplate methods and action handling:

```javascript
var PROXIED_PAGINATED_LIST_METHODS = [
  'getIds', 'getPageCount', 'getNextPageUrl',
  'isExpectingPage', 'isLastPage'
];

function createListStoreSpec({ getList, callListMethod }) {
  var spec = {
    getList: getList
  };

  PROXIED_PAGINATED_LIST_METHODS.forEach(method => {
    spec[method] = function (...args) {
      return callListMethod(method, args);
    };
  });

  return spec;
}

/**
 * Creates a simple paginated store that represents a global list (e.g. feed).
 */
function createListStore(spec) {
  var list = new PaginatedList();

  function getList() {
    return list;
  }

  function callListMethod(method, args) {
    return list[method].call(list, args);
  }

  return createStore(
    merge(spec, createListStoreSpec({
      getList: getList,
      callListMethod: callListMethod
    }))
  );
}

/**
 * Creates an indexed paginated store that represents a one-many relationship
 * (e.g. user's posts). Expects foreign key ID to be passed as first parameter
 * to store methods.
 */
function createIndexedListStore(spec) {
  var lists = {};

  function getList(id) {
    if (!lists[id]) {
      lists[id] = new PaginatedList();
    }

    return lists[id];
  }

  function callListMethod(method, args) {
    var id = args.shift();
    if (typeof id ===  'undefined') {
      throw new Error('Indexed pagination store methods expect ID as first parameter.');
    }

    var list = getList(id);
    return list[method].call(list, args);
  }

  return createStore(
    merge(spec, createListStoreSpec({
      getList: getList,
      callListMethod: callListMethod
    }))
  );
}

/**
 * Creates a handler that responds to list store pagination actions.
 */
function createListActionHandler(actions) {
  var {
    request: requestAction,
    error: errorAction,
    success: successAction,
    preload: preloadAction
  } = actions;

  invariant(requestAction, 'Pass a valid request action.');
  invariant(errorAction, 'Pass a valid error action.');
  invariant(successAction, 'Pass a valid success action.');

  return function (action, list, emitChange) {
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

var PaginatedStoreUtils = {
  createListStore: createListStore,
  createIndexedListStore: createIndexedListStore,
  createListActionHandler: createListActionHandler
};
```

### [`createStoreMixin`](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/mixins/createStoreMixin.js)

A mixin that allows components to tune in to Stores they're interested in, e.g. `mixins: [createStoreMixin(UserStore)]`.

```javascript
function createStoreMixin(...stores) {
  var StoreMixin = {
    getInitialState() {
      return this.getStateFromStores(this.props);
    },

    componentDidMount() {
      stores.forEach(store =>
        store.addChangeListener(this.handleStoresChanged)
      );

      this.setState(this.getStateFromStores(this.props));
    },

    componentWillUnmount() {
      stores.forEach(store =>
        store.removeChangeListener(this.handleStoresChanged)
      );
    },

    handleStoresChanged() {
      if (this.isMounted()) {
        this.setState(this.getStateFromStores(this.props));
      }
    }
  };

  return StoreMixin;
}
```
