flux-react-router-example
=========================

This is a sample Flux app I wrote on a weekend.  
It uses open Github API to display starred repos by users and stargazers by repo.

![](http://i.imgur.com/MxPpyPb.png)

I made it to document a few approaches I have tried while learning Flux.  
I tried to keep it close to real world (pagination, no fake localStorage APIs).

There are a few interesting bits here I was especially interested in:

* It uses [Flux architecture](https://github.com/facebook/flux) and [react-router](https://github.com/rackt/react-router);
* It can show user page with partial known info and loads details on the go;
* It supports pagination both for users and repos;
* It parses Github's nested JSON responses with [normalizr](https://github.com/gaearon/normalizr);
* Content Stores [don't need to contain a giant `switch` with actions](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/stores/UserStore.js#L27);
* “Back” is immediate (because all data is in Stores).

### How I Classify Stores

I tried to avoid some of the duplication I've seen in other Flux example, specifically in Stores.
I found it useful to logically divide Stores into three categories:

**Content Stores** hold all app entities. Everything that has an ID needs its own Content Store. Components that render individual items ask Content Stores for the fresh data.

Content Stores harvest their objects from *all* server actions. For example, `UserStore` [looks into `action.response.entities.users`](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/stores/UserStore.js#L27) if it exists *regardless* of which action fired. There is no need for a `switch`. [Normalizr](https://github.com/gaearon/normalizr) makes it easy to flatten any API reponses to this format.

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

They normally respond to just a few actions (e.g. `REQUEST_FEED`, `REQUEST_FEED_SUCCESS`, `REQUEST_FEED_ERROR`). They [`waitFor`](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/dispatcher/Dispatcher.js#L156) all Content Stores.

```javascript
// Paginated Stores keep their data like this
[7, 10, 5, ...]
```

**Indexed List Stores** are like List Stores but they define one-to-many relationship. For example, “user's subscribers”, “repository's stargazers”, “user's repositories”. They also handle pagination.

They also normally respond to just a few actions (e.g. `REQUEST_USER_REPOS`, `REQUEST_USER_REPOS_SUCCESS`, `REQUEST_USER_REPOS_ERROR`). They `waitFor` all Content Stores.

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

  // Mute the warning because Stores will have a lot of subscribers
  store.setMaxListeners(0);

  return store;
}
```

I use it to create all Stores.

#### `isInBag`, `mergeIntoBag`

Small helpers useful for Content Stores.

```javascript
isInBag(bag, id, fields) {
  if (!fields) {
    fields = [];
  }

  var item = bag[id];
  if (!bag[id]) {
    return;
  }

  return fields.every(field => item.hasOwnProperty(field));
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
```

### [`PaginatedStoreUtils`](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/utils/PaginatedStoreUtils.js)
#### `createIndexedPaginatedStore`

Makes creation of Indexed List Stores as simple as possible by providing boilerplate methods and action handling:

```javascript
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

  function applyIfExists(id, f, defaultValue) {
    if (typeof defaultValue === 'undefined') {
      defaultValue = null;
    }

    return lists.hasOwnProperty(id) ?
      f(lists[id]) :
      defaultValue;
  }

  store = createStore({
    hasRequestedFor(id) {
      return lists.hasOwnProperty(id);
    },

    getAllFor(id) {
      return applyIfExists(id, list => list.getAll());
    },

    getPageCountFor(id) {
      return applyIfExists(id, list => list.getPageCount());
    },

    isFetchingFor(id) {
      return applyIfExists(id, list => list.isExpectingPage());
    },

    mayHaveNextPageFor(id) {
      return applyIfExists(
        id,
        list => list.hasNextPage() || list.getPageCount() === 0,
        true
      );
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
```

### [`createStoreMixin`](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/mixins/createStoreMixin.js)

A mixin that allows components to tune in to Stores they're interested in, e.g. `mixins: [createStoreMixin(UserStore)]`.

```javascript
function createStoreMixin(...stores) {
  var StoreMixin = {
    getInitialState() {
      return this.getStateFromStores();
    },

    componentDidMount() {
      stores.forEach(store =>
        store.addChangeListener(this.handleStoresChanged)
      );
    },

    componentWillUnmount() {
      stores.forEach(store =>
        store.removeChangeListener(this.handleStoresChanged)
      );
    },

    handleStoresChanged() {
      if (this.isMounted()) {
        this.setState(this.getStateFromStores());
      }
    }
  };

  return StoreMixin;
}
```
