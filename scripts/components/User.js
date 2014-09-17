/** @jsx React.DOM */
'use strict';

var React = require('react'),
    createStoreMixin = require('../mixins/createStoreMixin'),
    UserStore = require('../stores/UserStore'),
    PureRenderMixin = require('react/addons').PureRenderMixin,
    Link = require('react-router').Link,
    PropTypes = React.PropTypes;

var User = React.createClass({
  mixins: [createStoreMixin(UserStore), PureRenderMixin],

  propTypes: {
    login: PropTypes.string.isRequired
  },

  getStateFromStores() {
    return {
      user: UserStore.get(this.props.login)
    };
  },

  render() {
    var user = this.state.user;
    if (!user) {
      return <span>Loading {this.props.login}...</span>;
    }

    user = user.toJS();

    return (
      <div className='User'>
        <Link to='user' login={user.login}>
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