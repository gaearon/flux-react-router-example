'use strict';

import React, { PropTypes } from 'react';
import shouldComponentUpdatePure from '../utils/shouldComponentUpdatePure';

const DEFAULT_LOGIN = 'gaearon';
const GITHUB_REPO = 'https://github.com/gaearon/flux-react-router-example';

function parseFullName(params) {
  if (!params.login) {
    return DEFAULT_LOGIN;
  }
  return params.login + (params.name ? '/' + params.name : '');
}

// TODO: update input when URL changes
export default class Explore extends React.Component {

  shouldComponentUpdate = shouldComponentUpdatePure

  static propTypes = {
    params: PropTypes.shape({
      login: PropTypes.string,
      name: PropTypes.string
    })
  }

  static contextTypes = {
    router: PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleGoClick = this.handleGoClick.bind(this);
  }

  render() {
    return (
      <div className='Explore'>
        <p>Type a username or repo full name and hit 'Go':</p>
        <input
          size='45'
          ref='loginOrRepo'
          onKeyUp={this.handleKeyUp}
          defaultValue={parseFullName(this.props.params)} />
        <button onClick={this.handleGoClick}>Go!</button>
        <p>Code on <a href={GITHUB_REPO} target='_blank'>Github</a>.</p>
      </div>
    );
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleGoClick();
    }
  }

  handleGoClick() {
    const val = React.findDOMNode(this.refs.loginOrRepo).value;
    this.context.router.transitionTo(`/${val}`);
  }
}
