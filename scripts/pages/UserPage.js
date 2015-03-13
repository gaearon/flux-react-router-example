'use strict';

var React = require('react'),
    User = require('../components/User'),
    Repo = require('../components/Repo'),
    RepoActionCreators = require('../actions/RepoActionCreators'),
    UserActionCreators = require('../actions/UserActionCreators'),
    StarredReposByUserStore = require('../stores/StarredReposByUserStore'),
    RepoStore = require('../stores/RepoStore'),
    UserStore = require('../stores/UserStore'),
    connectToStores = require('../utils/connectToStores'),
    DocumentTitle = require('react-document-title'),
    { PropTypes } = React;

function parseLogin(params) {
  return params.login;
}

var UserPage = React.createClass({
  propTypes: {
    params: PropTypes.shape({
      login: PropTypes.string.isRequired
    }).isRequired,
    user: PropTypes.object,
    starred: PropTypes.arrayOf(PropTypes.object).isRequired,
    starredOwners: PropTypes.arrayOf(PropTypes.object).isRequired
  },

  componentDidMount() {
    this.userDidChange(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (parseLogin(nextProps.params) !== parseLogin(this.props.params)) {
      this.userDidChange(nextProps);
    }
  },

  userDidChange(props) {
    var userLogin = parseLogin(props.params);

    UserActionCreators.requestUser(userLogin, ['name', 'avatarUrl']);
    RepoActionCreators.requestStarredReposPage(userLogin, true);
  },

  render() {
    var { user, starredRepos } = this.props;

    return (
      <DocumentTitle title={'Starred by ' + parseLogin(this.props.params)}>
        <div>
          {user ?
            <User user={user} /> :
            <h1>Loading...</h1>
          }

          <h1>Starred repos</h1>
          {this.renderStarredRepos()}
        </div>
      </DocumentTitle>
    );
  },

  renderStarredRepos() {
    var userLogin = parseLogin(this.props.params),
        isEmpty = this.props.starred.length === 0,
        isFetching = StarredReposByUserStore.isExpectingPage(userLogin),
        isLastPage = StarredReposByUserStore.isLastPage(userLogin);

    return (
      <div>
        {this.props.starred.map((repo, index) =>
          <Repo key={repo.fullName}
                repo={repo}
                owner={this.props.starredOwners[index]} />
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
    RepoActionCreators.requestStarredReposPage(parseLogin(this.props.params));
  }
});

module.exports = connectToStores(UserPage,
  [UserStore, StarredReposByUserStore, RepoStore],
  ({ params }) => ({ params }),
  ({ params }) => {
    var userLogin = parseLogin(params),
        user = UserStore.get(userLogin),
        starred = StarredReposByUserStore.getRepos(userLogin),
        starredOwners = starred.map(repo => UserStore.get(repo.owner));

    return {
      user: user,
      starred: starred,
      starredOwners: starredOwners
    };
  }
);
