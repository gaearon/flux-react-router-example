import React from 'react';
import { Route } from 'react-router';
import App from './App';
import RepoPage from './pages/RepoPage';
import UserPage from './pages/UserPage';

export default (
  <Route name='explore' path='/' handler={App}>
    <Route name='repo' path='/:login/:name' handler={RepoPage} />
    <Route name='user' path='/:login' handler={UserPage} />
  </Route>
);
