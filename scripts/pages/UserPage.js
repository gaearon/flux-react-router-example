import React, { PropTypes } from 'react';
import * as RepoActionCreators from '../actions/RepoActionCreators';
import * as UserActionCreators from '../actions/UserActionCreators';
import StarredReposByUserStore from '../stores/StarredReposByUserStore';
import RepoStore from '../stores/RepoStore';
import UserStore from '../stores/UserStore';
import User from '../components/User';
import Repo from '../components/Repo';
import DocumentTitle from 'react-document-title';
import connectToStores from '../utils/connectToStores';

function parseLogin(params) {
  return params.login;
}

/**
 * Requests data from server for current props.
 */
function requestData(props) {
  const { params } = props;
  const userLogin = parseLogin(params);

  UserActionCreators.requestUser(userLogin, ['name', 'avatarUrl']);
  RepoActionCreators.requestStarredReposPage(userLogin, true);
}

/**
 * Retrieves state from stores for current props.
 */
function getState(props) {
  const login = parseLogin(props.params);

  const user = UserStore.get(login);

  const starred = StarredReposByUserStore.getRepos(login);
  const starredOwners = starred.map(repo => UserStore.get(repo.owner));
  const isLoadingStarred = StarredReposByUserStore.isExpectingPage(login);
  const isLastPageOfStarred = StarredReposByUserStore.isLastPage(login);

  return {
    user,
    starred,
    starredOwners,
    isLoadingStarred,
    isLastPageOfStarred
  };
}

@connectToStores([StarredReposByUserStore, UserStore, RepoStore], getState)
export default class UserPage {
  static propTypes = {
    // Injected by React Router:
    params: PropTypes.shape({
      login: PropTypes.string.isRequired
    }).isRequired,

    // Injected by @connectToStores:
    user: PropTypes.object,
    starred: PropTypes.arrayOf(PropTypes.object).isRequired,
    starredOwners: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoadingStarred: PropTypes.bool.isRequired,
    isLastPageOfStarred: PropTypes.bool.isRequired
  };

  constructor() {
    this.renderStarredRepos = this.renderStarredRepos.bind(this);
    this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this);
  }

  componentWillMount() {
    requestData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (parseLogin(nextProps.params) !== parseLogin(this.props.params)) {
      requestData(nextProps);
    }
  }

  render() {
    const { user, params } = this.props;
    const login = parseLogin(params);

    return (
      <DocumentTitle title={`Starred by ${login}`}>
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
  }

  renderStarredRepos() {
    const {
      starred,
      starredOwners,
      isLoadingStarred: isLoading,
      isLastPageOfStarred: isLastPage
    } = this.props;
    const isEmpty = starred.length === 0;

    return (
      <div>
        {starred.map((repo, index) =>
          <Repo key={repo.fullName}
                repo={repo}
                owner={starredOwners[index]} />
        )}

        {isEmpty && !isLoading &&
          <span>None :-(</span>
        }

        {isEmpty && isLoading &&
          <span>Loading...</span>
        }

        {!isEmpty && (isLoading || !isLastPage) &&
          <button onClick={this.handleLoadMoreClick}
                  disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load more'}
          </button>
        }
      </div>
    );
  }

  handleLoadMoreClick() {
    const login = parseLogin(this.props.params);
    RepoActionCreators.requestStarredReposPage(login);
  }
}
