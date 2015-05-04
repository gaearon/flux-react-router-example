'use strict';

import React, { PropTypes } from 'react';
import Repo from '../components/Repo';
import User from '../components/User';
import RepoActionCreators from '../actions/RepoActionCreators';
import UserActionCreators from '../actions/UserActionCreators';
import StargazersByRepoStore from '../stores/StargazersByRepoStore';
import UserStore from '../stores/UserStore';
import RepoStore from '../stores/RepoStore';
import DocumentTitle from 'react-document-title';
import connectToStores from '../utils/connectToStores';

function parseFullName(params) {
  return params.login + '/' + params.name;
}

class RepoPage extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      login: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    repo: PropTypes.object,
    owner: PropTypes.object,
    stargazers: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  constructor() {
    super();

    this.repoDidChange = this.repoDidChange.bind(this);
    this.renderStargazers = this.renderStargazers.bind(this);
    this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this);
  }

  componentWillMount() {
    this.repoDidChange(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (parseFullName(nextProps.params) !== parseFullName(this.props.params)) {
      this.repoDidChange(nextProps);
    }
  }

  repoDidChange(props) {
    const fullName = parseFullName(props.params);

    RepoActionCreators.requestRepo(fullName);
    UserActionCreators.requestStargazerPage(fullName, true);
  }

  render() {
    const { repo, owner, params } = this.props;
    const fullName = parseFullName(params);

    return (
      <DocumentTitle title={`Stargazers of ${fullName}`}>
        <div>
          {repo && owner ?
            <Repo repo={repo} owner={owner} /> :
            <h1>Loading {fullName}...</h1>
          }

          <h1>Stargazers</h1>
          {this.renderStargazers()}
        </div>
      </DocumentTitle>
    );
  }

  renderStargazers() {
    const { stargazers } = this.props;
    const fullName = parseFullName(this.props);

    const isEmpty = stargazers.length === 0;
    const isFetching = StargazersByRepoStore.isExpectingPage(fullName);
    const isLastPage = StargazersByRepoStore.isLastPage(fullName);

    return (
      <div>
        {stargazers.map(user =>
          <User key={user.login} user={user} />
        )}

        {isEmpty && !isFetching &&
          <span>None :-(</span>
        }

        {isEmpty && isFetching &&
          <span>Loading...</span>
        }

        {!isEmpty && (isFetching || !isLastPage) &&
          <button
            onClick={this.handleLoadMoreClick}
            disabled={isFetching}>
            {isFetching ? 'Loading...' : 'Load more'}
          </button>
        }
      </div>
    );
  }

  handleLoadMoreClick() {
    const fullName = parseFullName(this.props.params);
    UserActionCreators.requestStargazerPage(fullName);
  }
}

if (module.makeHot) {
  // Because we don't export RepoPage directly,
  // we need to tell React Hot Loader about it,
  // or the state will be lost on file change.
  RepoPage = module.makeHot(RepoPage);
}

function pickProps({ params }) {
  return { params };
}

function getState({ params }) {
  const repoFullName = parseFullName(params);
  const stargazers = StargazersByRepoStore.getUsers(repoFullName);
  const repo = RepoStore.get(repoFullName);
  const owner = repo && UserStore.get(repo.owner);

  return { repo, owner, stargazers };
}

export default connectToStores(RepoPage,
  [ RepoStore, StargazersByRepoStore, UserStore ],
  pickProps,
  getState
);
