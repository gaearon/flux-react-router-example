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

  constructor() {
    super();

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleGoClick = this.handleGoClick.bind(this);
  }

  // FIXME: update input when URL changes.
  //
  // What we want is the `input` field to reflect
  // the current URL and still be editable by the user.
  //
  // Since we want the user to edit the field, we have to
  // use an `uncontrolled` component (and provide a
  // `defaultValue` to initialize the field).
  //
  // Problem here is that we can't programmatically update
  // the field with other values. To do that, we would have
  // to use a `controlled` component with a `value`,
  // but this will prevent the user to change the field.
  //
  // To enable user input in this case, we have to provide
  // an `onChange` event, which is triggered whenever the
  // user types something (and we can't check the key event here).
  //
  // Any idea?
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
