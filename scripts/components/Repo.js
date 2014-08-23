/** @jsx React.DOM */
'use strict';

var React = require('react'),
    createStoreMixin = require('../mixins/createStoreMixin'),
    RepoStore = require('../stores/RepoStore'),
    RepoActionCreators = require('../actions/RepoActionCreators'),
    PureRenderMixin = require('react/addons').PureRenderMixin,
    PropTypes = React.PropTypes;

var Repo = React.createClass({
  mixins: [createStoreMixin(RepoStore), PureRenderMixin],

  propTypes: {
    fullName: PropTypes.string.isRequired
  },

  getStateFromStores() {
    return {
      repo: RepoStore.get(this.props.fullName)
    };
  },

  componentWillMount() {
    RepoActionCreators.requestRepo(this.props.fullName);
  },

  render() {
    var repo = this.state.repo;
    if (!repo) {
      return <span>Loading {this.props.fullName}...</span>;
    }

    return (
      <div className='Repo'>
        <h3>{repo.name}</h3>
        <h4>{repo.description}</h4>
      </div>
    );
  }
});

module.exports = Repo;