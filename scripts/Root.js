import React, { PropTypes, Component } from 'react';
import { Router, Route } from 'react-router';

import App from './App';
import RepoPage from './pages/RepoPage';
import UserPage from './pages/UserPage';

export default class Root extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  render() {
    const { history } = this.props;
    return (
      <Router history={history}>
        <Route name='explore' path='/' component={App}>
          <Route name='repo' path='/:login/:name' component={RepoPage} />
          <Route name='user' path='/:login' component={UserPage} />
        </Route>
      </Router>
    );
  }
}
