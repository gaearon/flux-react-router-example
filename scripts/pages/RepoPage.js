'use strict';

var React = require('react'),
    Repo = require('../components/Repo'),
    User = require('../components/User'),
    RepoActionCreators = require('../actions/RepoActionCreators'),
    UserActionCreators = require('../actions/UserActionCreators'),
    StargazersByRepoStore = require('../stores/StargazersByRepoStore'),
    UserStore = require('../stores/UserStore'),
    RepoStore = require('../stores/RepoStore'),
    createStoreMixin = require('../mixins/createStoreMixin'),
    DocumentTitle = require('react-document-title'),
    { PropTypes } = React;

var RepoPage = React.createClass({
  mixins: [createStoreMixin(RepoStore, StargazersByRepoStore, UserStore)],

  propTypes: {
    params: PropTypes.shape({
      login: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  },

  parseFullName(props) {
    props = props || this.props;
    return props.params.login + '/' + props.params.name;
  },

  getStateFromStores(props) {
    var repoFullName = this.parseFullName(props),
        stargazers = StargazersByRepoStore.getUsers(repoFullName),
        repo = RepoStore.get(repoFullName),
        owner = repo && UserStore.get(repo.owner);

    return {
      repo: repo,
      owner: owner,
      stargazers: stargazers
    };
  },

  componentDidMount() {
    this.repoDidChange(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (this.parseFullName(nextProps) !== this.parseFullName(this.props)) {
      this.setState(this.getStateFromStores(nextProps));
      this.repoDidChange(nextProps);
    }
  },

  repoDidChange(props) {
    var fullName = this.parseFullName(props);

    RepoActionCreators.requestRepo(fullName);
    UserActionCreators.requestStargazerPage(fullName, true);
  },

  render() {
    var { repo, owner } = this.state;

    return (
      <DocumentTitle title={'Stargazers of ' + this.parseFullName()}>
        <div>
          {repo && owner ?
            <Repo repo={repo} owner={owner} /> :
            <h1>Loading {this.parseFullName()}...</h1>
          }

          <h1>Stargazers</h1>
          {this.renderStargazers()}
        </div>
      </DocumentTitle>
    );
  },

  renderStargazers() {
    var fullName = this.parseFullName(),
        isEmpty = this.state.stargazers.length === 0,
        isFetching = StargazersByRepoStore.isExpectingPage(fullName),
        isLastPage = StargazersByRepoStore.isLastPage(fullName);

    return (
      <div>
        {this.state.stargazers.map(user =>
          <User key={user.login} user={user} />
        )}

        {isEmpty && !isFetching &&
          <span>None :-(</span>
        }

        {isEmpty && isFetching &&
          <span>Loading...</span>
        }

        {!isEmpty && (isFetching || !isLastPage) &&
          <button onClick={this.handleLoadMoreClick} disabled={isFetching}>
            {isFetching ? 'Loading...' : 'Load more'}
          </button>
        }
      </div>
    );
  },

  handleLoadMoreClick() {
    UserActionCreators.requestStargazerPage(this.parseFullName());
  }
});

module.exports = RepoPage;
