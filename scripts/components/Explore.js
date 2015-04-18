'use strict';

import React, { PropTypes } from 'react';

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

  static propTypes = {
    transitionTo: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      loginOrRepo: parseFullName(props.params)
    };

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleGoClick = this.handleGoClick.bind(this);
  }

  render() {
    return (
      <div className='Explore'>
        <p>Type a username or repo full name and hit 'Go':</p>
        <input
          ref='loginOrRepo'
          onKeyUp={this.handleKeyUp}
          defaultValue={this.state.loginOrRepo} />
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
    this.setState({ loginOrRepo: val });
    this.props.transitionTo(`/${val}`);
  }
}
