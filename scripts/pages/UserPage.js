/** @jsx React.DOM */
'use strict';

var React = require('react'),
    User = require('../components/user'),
    Repo = require('../components/repo'),
    RepoActionCreators = require('../actions/RepoActionCreators'),
    StarredRepoStore = require('../stores/StarredRepoStore'),
    createStoreMixin = require('../mixins/createStoreMixin'),
    PropTypes = React.PropTypes;

var UserPage = React.createClass({
  mixins: [createStoreMixin(StarredRepoStore)],

  propTypes: {
    params: PropTypes.shape({
      login: PropTypes.string.isRequired
    }).isRequired
  },

  getLogin() {
    return this.props.params.login;
  },

  getStateFromStores() {
    return {
      starred: StarredRepoStore.getAllFor(this.getLogin())
    };
  },

  componentWillMount() {
    this.requestStarredPage();
  },

  render() {
    return (
      <div>
        <User login={this.getLogin()} />

        <h1>Starred repos</h1>

        {this.state.starred ?
          this.renderStarredRepos() :
          <i>Loading...</i>
        }
      </div>
    );
  },

  renderStarredRepos() {
    var login = this.getLogin(),
        isFetching = StarredRepoStore.isFetchingFor(login),
        hasMore = StarredRepoStore.hasNextPageFor(login);

    return (
      <div>
        {this.state.starred.map(fullName =>
          <Repo key={fullName} fullName={fullName} />
        )}

        {this.state.starred.length === 0 &&
          <span>None :-(</span>
        }

        {hasMore &&
          <button onClick={this.handleLoadMoreClick} disabled={isFetching}>
            Load more
          </button>
        }
      </div>
    );
  },

  handleLoadMoreClick() {
    this.requestStarredPage();
  },

  requestStarredPage() {
    RepoActionCreators.requestStarredReposPage(this.getLogin());
  }
});

module.exports = UserPage;