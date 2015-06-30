import React, { PropTypes } from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import RepoPage from './pages/RepoPage';
import UserPage from './pages/UserPage';

export default class Root extends React.Component {

  static propTypes = {
    history: PropTypes.object.isRequired
  }

  render() {
    const { history } = this.props;
    return (
      <Router history={history}>
        <Route name='explore' path='/' handler={App}>
          <Route name='repo' path='/:login/:name' handler={RepoPage} />
          <Route name='user' path='/:login' handler={UserPage} />
        </Route>
      </Router>
    );
  }
}
