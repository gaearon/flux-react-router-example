'use strict';

import React, { PropTypes } from 'react';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import { Link } from 'react-router';

const User = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    user: PropTypes.object.isRequired
  },

  render() {
    const { user } = this.props;

    return (
      <div className='User'>
        <Link to='user' params={{login: user.login}}>
          <img src={user.avatarUrl} width='72' height='72' />
          <h3>
            {user.login} {user.name && <span>({user.name})</span>}
          </h3>
        </Link>
      </div>
    );
  }
});

export default User;
