/** @jsx React.DOM */
'use strict';

var React = require('react'),
    createStoreMixin = require('../mixins/createStoreMixin'),
    UserStore = require('../stores/UserStore'),
    UserActionCreators = require('../actions/UserActionCreators'),
    PureRenderMixin = require('react/addons').PureRenderMixin,
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

  componentWillMount() {
    UserActionCreators.requestUser(this.props.login, ['name', 'avatarUrl']);
  },

  render() {
    var user = this.state.user;
    if (!user) {
      return <span>Loading {this.props.login}...</span>;
    }

    return (
      <div className='User'>
        <img src={user.avatarUrl} width='72' height='72' />
        <h3>{user.name}</h3>
      </div>
    );
  }
});

module.exports = User;