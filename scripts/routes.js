/** @jsx React.DOM */
'use strict';

var Routes = require('react-router').Routes,
    Route = require('react-router').Route,
    DefaultRoute = require('react-router').DefaultRoute,
    ExplorePage = require('./pages/ExplorePage'),
    RepoPage = require('./pages/RepoPage'),
    UserPage = require('./pages/UserPage');

module.exports = (
  <Routes location='history'>
    <Route name='repo' path='/:login/:name' handler={RepoPage} />
    <Route name='user' path='/:login' handler={UserPage} />
    <DefaultRoute name='explore' path='/' handler={ExplorePage} />
  </Routes>
);