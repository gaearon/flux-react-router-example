'use strict';

var React = require('react'),
    Repo = require('../components/Repo'),
    User = require('../components/User'),
    RepoActionCreators = require('../actions/RepoActionCreators'),
    UserActionCreators = require('../actions/UserActionCreators'),
    StargazersByRepoStore = require('../stores/StargazersByRepoStore'),
    UserStore = require('../stores/UserStore'),
    RepoStore = require('../stores/RepoStore'),
    DocumentTitle = require('react-document-title'),
    connectToStores = require('../utils/connectToStores'),
    { PropTypes } = React;

function parseFullName(params) {
  return params.login + '/' + params.name;
}

var RepoPage = React.createClass({
  propTypes: {
    params: PropTypes.shape({
      login: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,

    repo: PropTypes.object,
    owner: PropTypes.object,
    stargazers: PropTypes.arrayOf(PropTypes.object).isRequired
  },

  componentDidMount() {
    this.repoDidChange(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (parseFullName(nextProps.params) !== parseFullName(this.props.params)) {
      this.repoDidChange(nextProps);
    }
  },

  repoDidChange(props) {
    var fullName = parseFullName(props.params);

    RepoActionCreators.requestRepo(fullName);
    UserActionCreators.requestStargazerPage(fullName, true);
  },

  render() {
    var { repo, owner, params } = this.props;

    return (
      <DocumentTitle title={'Stargazers of ' + parseFullName(params)}>
        <div>
          {repo && owner ?
            <Repo repo={repo} owner={owner} /> :
            <h1>Loading {parseFullName(params)}...</h1>
          }

          <h1>Stargazers</h1>
          {this.renderStargazers()}
        </div>
      </DocumentTitle>
    );
  },

  renderStargazers() {
    var fullName = parseFullName(this.props),
        isEmpty = this.props.stargazers.length === 0,
        isFetching = StargazersByRepoStore.isExpectingPage(fullName),
        isLastPage = StargazersByRepoStore.isLastPage(fullName);

    return (
      <div>
        {this.props.stargazers.map(user =>
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
    UserActionCreators.requestStargazerPage(parseFullName(this.props));
  }
});

module.exports = connectToStores(RepoPage,
  [RepoStore, StargazersByRepoStore, UserStore],
  ({ params }) => ({ params }),
  ({ params }) => {
    var repoFullName = parseFullName(params),
        stargazers = StargazersByRepoStore.getUsers(repoFullName),
        repo = RepoStore.get(repoFullName),
        owner = repo && UserStore.get(repo.owner);

    return {
      repo: repo,
      owner: owner,
      stargazers: stargazers
    };
  }
);
