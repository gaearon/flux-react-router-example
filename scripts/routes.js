import React from 'react';
import { Route } from 'react-router';
import App from './App';
import RepoPage from './pages/RepoPage';
import UserPage from './pages/UserPage';

export default (
  <Route  path='/' component={App}>
    <Route  path='/:login/:name' component={RepoPage} />
    <Route  path='/:login' component={UserPage} />
  </Route>
);
