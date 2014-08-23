/** @jsx React.DOM */
'use strict';

var React = require('react'),
    Repo = require('../components/repo'),
    createStoreMixin = require('../mixins/createStoreMixin'),
    PropTypes = React.PropTypes;

var RepoPage = React.createClass({
  propTypes: {
    params: PropTypes.shape({
      login: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  },

  getLogin() {
    return this.props.params.login;
  },

  getName() {
    return this.props.params.name;
  },

  getFullName() {
    return this.getLogin() + '/' + this.getName();
  },

  render() {
    return (
      <Repo fullName={this.getFullName()} />
    );
  }
});

module.exports = RepoPage;