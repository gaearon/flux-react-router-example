/** @jsx React.DOM */
'use strict';

var React = require('react'),
    createStoreMixin = require('../mixins/createStoreMixin'),
    UserStore = require('../stores/UserStore'),
    UserActionCreators = require('../actions/UserActionCreators'),
    PropTypes = React.PropTypes;

var User = React.createClass({
  mixins: [createStoreMixin(UserStore)],

  propTypes: {
    login: PropTypes.string.isRequired
  },

  getStateFromStores() {
    return {
      user: UserStore.get(this.props.login)
    };
  },

  componentWillMount() {
    UserActionCreators.requestUser(this.props.login);
  },

  render() {
    var user = this.state.user;
    if (!user) {
      return <span>Loading...</span>;
    }

    return (
      <div className='User'>
        <img src={user.avatarUrl} width='200' height='200' />
        <h3>{user.name}</h3>
        <h4>{user.company}</h4>
      </div>
    );
  }
});

module.exports = User;