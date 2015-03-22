'use strict';

import React, { PropTypes } from 'react';
import shallowEqual from 'react/lib/shallowEqual';
import { Link } from 'react-router';

class Repo extends React.Component {

  // TODO: make it either a HigherOrderComponent
  // or a subclass of `React.Component` and extend from it
  // Example:
  //    class PureComponent extends React.Component
  //
  //    class MyComponent extends PureComponent
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) ||
           !shallowEqual(this.state, nextState);
  }

  render() {
    const { repo, owner } = this.props;

    return (
      <div className='Repo'>
        <h3>
          <Link to='repo' params={{login: owner.login, name: repo.name}}>
            {repo.name}
          </Link>
          {' by '}
          <Link to='user' params={{login: owner.login}}>
            {owner.login}
          </Link>
        </h3>
        <p>{repo.description}</p>
      </div>
    );
  }
}
// or declare it in the constructor
Repo.propTypes = {
  repo: PropTypes.object.isRequired,
  owner: PropTypes.object.isRequired
};

export default Repo;
