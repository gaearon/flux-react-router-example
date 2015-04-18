'use strict';

import React, { PropTypes } from 'react';
import shallowEqual from 'react/lib/shallowEqual';
import { Link } from 'react-router';

class User extends React.Component {

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
    const { user } = this.props;

    return (
      <div className='User'>
        <Link to='user' params={{ login: user.login }}>
          <img src={user.avatarUrl} width='72' height='72' />
          <h3>
            {user.login} {user.name && <span>({user.name})</span>}
          </h3>
        </Link>
      </div>
    );
  }
}
// or declare it in the constructor
User.propTypes = {
  user: PropTypes.object.isRequired
};

export default User;
