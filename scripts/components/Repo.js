/** @jsx React.DOM */
'use strict';

var React = require('react'),
    createStoreMixin = require('../mixins/createStoreMixin'),
    RepoStore = require('../stores/RepoStore'),
    UserStore = require('../stores/UserStore'),
    PureRenderMixin = require('react/addons').PureRenderMixin,
    Link = require('react-router/Link'),
    PropTypes = React.PropTypes;

var Repo = React.createClass({
  mixins: [createStoreMixin(RepoStore, UserStore), PureRenderMixin],

  propTypes: {
    fullName: PropTypes.string.isRequired
  },

  getStateFromStores() {
    var repo = RepoStore.get(this.props.fullName);

    return {
      repo: repo,
      owner: repo && UserStore.get(repo.owner)
    };
  },

  render() {
    var repo = this.state.repo,
        owner = this.state.owner;

    if (!repo || !owner) {
      return <span>Loading {this.props.fullName}...</span>;
    }

    return (
      <div className='Repo'>
        <h3>
          <Link to='repo' login={owner.login} name={repo.name}>
            {repo.name}
          </Link>
          {' by '}
          <Link to='user' login={owner.login}>
            {owner.login}
          </Link>
        </h3>
        <p>{repo.description}</p>
      </div>
    );
  }
});

module.exports = Repo;