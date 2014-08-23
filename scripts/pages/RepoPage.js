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

  getFullName() {
    var params = this.props.params;
    return params.login + '/' + params.name;
  },

  render() {
    return (
      <Repo fullName={this.getFullName()} />
    );
  }
});

module.exports = RepoPage;