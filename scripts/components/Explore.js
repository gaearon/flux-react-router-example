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

  constructor(props) {
    super();
    // Using `props` to initialize state is usually an anti-pattern,
    // however the only purpose here is to provide an initial value
    // to the input field (synchronization is not the goal here).
    this.state = {
      loginOrRepo: parseFullName(props.params)
    };

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleGoClick = this.handleGoClick.bind(this);
    this.getInputValue = this.getInputValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loginOrRepo: parseFullName(nextProps.params) });
  }

  render() {
    return (
      <div className='Explore'>
        <p>Type a username or repo full name and hit 'Go':</p>
        <input
          size='45'
          ref='loginOrRepo'
          onKeyUp={this.handleKeyUp}
          onChange={this.handleOnChange}
          value={this.state.loginOrRepo} />
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

  handleOnChange() {
    // Just to update the internal state of the component in order
    // to reflect the input field value to the user input.
    // This is because we are using a `Controlled` component.
    this.setState({ loginOrRepo: this.getInputValue() });
  }

  handleGoClick() {
    this.context.router.transitionTo(`/${this.getInputValue()}`);
  }

  getInputValue() {
    return React.findDOMNode(this.refs.loginOrRepo).value;
  }
}
