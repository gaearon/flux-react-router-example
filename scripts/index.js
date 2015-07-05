import React from 'react';
import { Router, Route} from 'react-router';
import { history } from 'react-router/lib/HashHistory';
import { browserHistory } from 'react-router/lib/BrowserHistory';
import appRoutes from './routes';

const rootEl = document.getElementById('root');

React.render((
  <Router history={history}>
   {appRoutes}
  </Router>
), rootEl);