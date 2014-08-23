/** @jsx React.DOM */
'use strict';

var React = require('react'),
    User = require('../components/user'),
    Repo = require('../components/repo'),
    createStoreMixin = require('../mixins/createStoreMixin'),
    PropTypes = React.PropTypes;

var UserPage = React.createClass({
  propTypes: {
    params: PropTypes.shape({
      login: PropTypes.string.isRequired
    }).isRequired
  },

  render() {
    return (
      <User login={this.props.params.login} />
    );
  }
});

module.exports = UserPage;