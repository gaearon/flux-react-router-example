import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class User {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { user } = this.props;

    return (
      <div className='User'>
        <Link to={`/${user.login}`}>
          <img src={user.avatarUrl} width='72' height='72' />
          <h3>
            {user.login} {user.name && <span>({user.name})</span>}
          </h3>
        </Link>
      </div>
    );
  }
}
