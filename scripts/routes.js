'use strict';

var React = require('react'),
    { Routes, Route, DefaultRoute } = require('react-router'),
    App = require('./App'),
    RepoPage = require('./pages/RepoPage'),
    UserPage = require('./pages/UserPage');

module.exports = (
  <Routes location={process.env.NODE_ENV === 'production' ? 'hash' : 'history'}>
    <Route name='explore' path='/' handler={App}>
      <Route name='repo' path='/:login/:name' handler={RepoPage} />
      <Route name='user' path='/:login' handler={UserPage} />
    </Route>
  </Routes>
);
