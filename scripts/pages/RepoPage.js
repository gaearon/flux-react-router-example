/** @jsx React.DOM */
'use strict';

var React = require('react'),
    Repo = require('../components/Repo'),
    User = require('../components/User'),
    RepoActionCreators = require('../actions/RepoActionCreators'),
    UserActionCreators = require('../actions/UserActionCreators'),
    StargazerUserStore = require('../stores/StargazerUserStore'),
    createStoreMixin = require('../mixins/createStoreMixin'),
    PropTypes = React.PropTypes;

var RepoPage = React.createClass({
  mixins: [createStoreMixin(StargazerUserStore)],

  propTypes: {
    params: PropTypes.shape({
      login: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  },

  getLogin() {
    return this.props.params.login;
  },

  getName() {
    return this.props.params.name;
  },

  getFullName() {
    return this.getLogin() + '/' + this.getName();
  },

  getStateFromStores() {
    return {
      stargazers: StargazerUserStore.getAllFor(this.getFullName())
    };
  },

  componentDidMount() {
    RepoActionCreators.requestRepo(this.getFullName());
    this.requestStargazerPage(true);
  },

  render() {
    return (
      <div>
        <Repo fullName={this.getFullName()} />

        <h1>Stargazers</h1>

        {this.state.stargazers ?
          this.renderStargazers() :
          <i>Loading...</i>
        }
      </div>
    );
  },

  renderStargazers() {
    var fullName = this.getFullName(),
        isEmpty = this.state.stargazers.length === 0,
        isFetching = StargazerUserStore.isExpectingPageFor(fullName),
        mayHaveMore = !StargazerUserStore.isLastPageFor(fullName);

    return (
      <div>
        {this.state.stargazers.toJS().map(login =>
          <User key={login} login={login} />
        )}

        {isEmpty && !isFetching &&
          <span>None :-(</span>
        }

        {isEmpty && isFetching &&
          <span>Loading...</span>
        }

        {!isEmpty && (isFetching || mayHaveMore) &&
          <button onClick={this.handleLoadMoreClick} disabled={isFetching}>
            {isFetching ? 'Loading...' : 'Load more'}
          </button>
        }
      </div>
    );
  },

  handleLoadMoreClick() {
    this.requestStargazerPage();
  },

  requestStargazerPage(isInitialRequest) {
    UserActionCreators.requestStargazerPage(this.getFullName(), isInitialRequest);
  }
});

module.exports = RepoPage;
