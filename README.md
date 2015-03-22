Flux React Router Example
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
* “Back” is immediate (because all data is in Stores);
* Router handlers are updated gracefully in `componentWillReceiveProps` if some page is requested with a different parameter.

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
const createStore = (spec) => {
  let store = assign({
    emitChange() {
      this.emit(CHANGE_EVENT);
    },

    addChangeListener(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }
  }, spec, EventEmitter.prototype);

  each(store, (val, key) => {
    if (isFunction(val)) {
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
const isInBag = (bag, id, fields) => {
  let item = bag[id];
  if (!bag[id]) {
    return false;
  }

  if (fields) {
    return fields.every(field => item.hasOwnProperty(field));
  } else {
    return true;
  }
}

const mergeIntoBag = (bag, entities, transform) => {
  if (!transform) {
    transform = (x) => x;
  }

  for (let key in entities) {
    if (!entities.hasOwnProperty(key)) {
      continue;
    }

    if (!bag.hasOwnProperty(key)) {
      bag[key] = transform(entities[key]);
    } else if (!shallowEqual(bag[key], entities[key])) {
      bag[key] = transform(assign({}, bag[key], entities[key]));
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
    this._ids = union([id], this._ids);
  }

  remove(id) {
    this._ids = without(this._ids, id);
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
      this._ids = union(this._ids, newIds);
    }

    this._isExpectingPage = false;
    this._nextPageUrl = nextPageUrl || null;
    this._pageCount++;
  }
};
```

### [`PaginatedStoreUtils`](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/utils/PaginatedStoreUtils.js)
#### `createListStore`, `createIndexedListStore`, `createListActionHandler`

Makes creation of Indexed List Stores as simple as possible by providing boilerplate methods and action handling:

```javascript
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
        getList,
        callListMethod
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
        getList,
        callListMethod
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
```

### [`connectToStores`](https://github.com/gaearon/flux-react-router-example/blob/master/scripts/utils/connectToStores.js)

A [higher-order component](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775) that allows components to tune in to Stores they're interested in.

```javascript
const connectToStores = (Component, stores, pickProps, getState) => {
  class StoreConnector extends React.Component {
    constructor(props) {
      this.state = this.getStateFromStores(props);
    }

    getStateFromStores(props) {
      return getState(pickProps(props));
    }

    componentDidMount() {
      stores.forEach(store =>
        store.addChangeListener(this.handleStoresChanged.bind(this))
      );

      this.setState(this.getStateFromStores(this.props));
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(pickProps(nextProps), pickProps(this.props))) {
        this.setState(this.getStateFromStores(nextProps));
      }
    }

    componentWillUnmount() {
      stores.forEach(store =>
        store.removeChangeListener(this.handleStoresChanged.bind(this))
      );
    }

    handleStoresChanged() {
      this.setState(this.getStateFromStores(this.props));
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  }

  return StoreConnector;
};
```
