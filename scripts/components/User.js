'use strict';

var React = require('react'),
    UserStore = require('../stores/UserStore'),
    { PureRenderMixin } = require('react/addons'),
    { Link } = require('react-router'),
    { PropTypes } = React;

var User = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    user: PropTypes.object.isRequired
  },

  render() {
    var { user } = this.props;

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

module.exports = User;