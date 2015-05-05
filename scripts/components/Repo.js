import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class Repo {
  static propTypes = {
    repo: PropTypes.object.isRequired,
    owner: PropTypes.object.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { repo, owner } = this.props;

    return (
      <div className='Repo'>
        <h3>
          <Link to='repo' params={{ login: owner.login, name: repo.name }}>
            {repo.name}
          </Link>
          {' by '}
          <Link to='user' params={{ login: owner.login }}>
            {owner.login}
          </Link>
        </h3>
        <p>{repo.description}</p>
      </div>
    );
  }
}
