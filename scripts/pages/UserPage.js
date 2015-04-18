'use strict';

import React, { PropTypes } from 'react';
import User from '../components/User';
import Repo from '../components/Repo';
import RepoActionCreators from '../actions/RepoActionCreators';
import UserActionCreators from '../actions/UserActionCreators';
import StarredReposByUserStore from '../stores/StarredReposByUserStore';
import RepoStore from '../stores/RepoStore';
import UserStore from '../stores/UserStore';
import connectToStores from '../utils/connectToStores';
import DocumentTitle from 'react-document-title';

const parseLogin = (params) => {
  return params.login;
};

class UserPage extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      login: PropTypes.string.isRequired
    }).isRequired,
    user: PropTypes.object,
    starred: PropTypes.arrayOf(PropTypes.object).isRequired,
    starredOwners: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  componentDidMount() {
    this.userDidChange.call(this, this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (parseLogin(nextProps.params) !== parseLogin(this.props.params)) {
      this.userDidChange.call(this, nextProps);
    }
  }

  userDidChange(props) {
    const userLogin = parseLogin(props.params);

    UserActionCreators.requestUser(userLogin, [ 'name', 'avatarUrl' ]);
    RepoActionCreators.requestStarredReposPage(userLogin, true);
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
          {this.renderStarredRepos.call(this)}
        </div>
      </DocumentTitle>
    );
  }

  renderStarredRepos() {
    const { starred, starredOwners, params } = this.props;
    const login = parseLogin(params);

    const isEmpty = starred.length === 0;
    const isFetching = StarredReposByUserStore.isExpectingPage(login);
    const isLastPage = StarredReposByUserStore.isLastPage(login);

    return (
      <div>
        {starred.map((repo, index) =>
          <Repo key={repo.fullName}
                repo={repo}
                owner={starredOwners[index]} />
        )}

        {isEmpty && !isFetching &&
          <span>None :-(</span>
        }

        {isEmpty && isFetching &&
          <span>Loading...</span>
        }

        {!isEmpty && (isFetching || !isLastPage) &&
          <button
            onClick={this.handleLoadMoreClick.bind(this)}
            disabled={isFetching}>
            {isFetching ? 'Loading...' : 'Load more'}
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

if (module.makeHot) {
  // Because we don't export UserPage directly,
  // we need to tell React Hot Loader about it,
  // or the state will be lost on file change.
  UserPage = module.makeHot(UserPage);
}

const pickProps = ({ params }) => {
  return { params };
};

const getState = ({ params }) => {
  const login = parseLogin(params);

  const user = UserStore.get(login);
  const starred = StarredReposByUserStore.getRepos(login);
  const starredOwners = starred.map(repo => UserStore.get(repo.owner));

  return { user, starred, starredOwners };
};

export default connectToStores(UserPage,
  [ UserStore, StarredReposByUserStore, RepoStore ],
  pickProps,
  getState
);
