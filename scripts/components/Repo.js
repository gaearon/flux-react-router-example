'use strict';

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import shouldComponentUpdatePure from '../utils/shouldComponentUpdatePure';

export default class Repo extends React.Component {

  shouldComponentUpdate = shouldComponentUpdatePure

  static propTypes = {
    repo: PropTypes.object.isRequired,
    owner: PropTypes.object.isRequired
  }

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
