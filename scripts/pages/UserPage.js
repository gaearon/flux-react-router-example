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
    if (!StarredRepoStore.hasRequested(this.getLogin())) {
      this.requestStarredPage();
    }
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
        mayHaveMore = StarredRepoStore.mayHaveNextPageFor(login);

    return (
      <div>
        {this.state.starred.map(fullName =>
          <Repo key={fullName} fullName={fullName} />
        )}

        {this.state.starred.length === 0 &&
          <span>None :-(</span>
        }

        {mayHaveMore &&
          <button onClick={this.handleLoadMoreClick} disabled={isFetching}>
            {isFetching ? 'Loading...' : 'Load more'}
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