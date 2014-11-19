'use strict';

var React = require('react'),
    createStoreMixin = require('../mixins/createStoreMixin'),
    { PureRenderMixin } = require('react/addons'),
    { Link } = require('react-router'),
    { PropTypes } = React;

var Repo = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    repo: PropTypes.object.isRequired,
    owner: PropTypes.object.isRequired
  },

  render() {
    var { repo, owner } = this.props;

    return (
      <div className='Repo'>
        <h3>
          <Link to='repo' params={{login: owner.login, name: repo.name}}>
            {repo.name}
          </Link>
          {' by '}
          <Link to='user' params={{login: owner.login}}>
            {owner.login}
          </Link>
        </h3>
        <p>{repo.description}</p>
      </div>
    );
  }
});

module.exports = Repo;