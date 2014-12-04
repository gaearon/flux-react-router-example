'use strict';

var React = require('react'),
    { Route, DefaultRoute } = require('react-router'),
    App = require('./App'),
    RepoPage = require('./pages/RepoPage'),
    UserPage = require('./pages/UserPage');

module.exports = (
  <Route name='explore' path='/' handler={App}>
    <Route name='repo' path='/:login/:name' handler={RepoPage} />
    <Route name='user' path='/:login' handler={UserPage} />
  </Route>
);
