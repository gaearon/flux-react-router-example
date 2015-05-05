Flux React Router Example
=========================

This is a sample Flux app I wrote on a weekend.  
It uses open Github API to display starred repos by users and stargazers by repo.

![](http://i.imgur.com/MxPpyPb.png)

I made it to document a few approaches I have tried while learning Flux.  
I tried to keep it close to real world (pagination, no fake localStorage APIs).

There are a few bits here I was especially interested in:

* It uses vanilla [Flux architecture](https://github.com/facebook/flux) and [React Router](https://github.com/rackt/react-router);
* It can show user page with partial known info and load details on the go;
* It supports pagination both for users and repos;
* It parses Github's nested JSON responses with [Normalizr](https://github.com/gaearon/normalizr);
* Content Stores [don't need to contain a giant `switch` with actions](https://github.com/gaearon/flux-react-router-example/blob/82a27eb85227ef85129e8bf0444e0f8d9abd6406/scripts/stores/UserStore.js#L18-L22);
* “Back” is immediate (because all data is in Stores);
* Router handlers are updated gracefully in `componentWillReceiveProps` if some page is requested with a different parameter;
* [“Dumb”](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) components use [pure rendering](https://github.com/gaearon/react-pure-render) as a performance optimization;
* It demonstrates usage of [higher-order components](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) through [decorators](https://github.com/wycats/javascript-decorators) (experimental);
* It is is built in ES6 using [Babel](https://babeljs.io) and [Webpack](https://github.com/webpack/webpack), and has [React Hot Loader](http://gaearon.github.io/react-hot-loader/) integrated.

### Running

```
npm install
npm start
```

#### Doing Other Things

```
npm run lint # uses eslint
npm run build # build production version to dist folder
```

### How I Classify Stores

I tried to avoid some of the duplication I've seen in other Flux example, specifically in Stores.
I found it useful to logically divide Stores into three categories:

**Content Stores** hold all app entities. Everything that has an ID needs its own Content Store. Components that render individual items ask Content Stores for the fresh data.

Content Stores harvest their objects from *all* server actions. For example, `UserStore` [looks into `action.response.entities.users`](https://github.com/gaearon/flux-react-router-example/blob/82a27eb85227ef85129e8bf0444e0f8d9abd6406/scripts/stores/UserStore.js#L18-L22) if it exists *regardless* of which action fired. There is no need for a `switch`. [Normalizr](https://github.com/gaearon/normalizr) makes it easy to flatten any API reponses to this format.

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

See and run the source for more tips!
