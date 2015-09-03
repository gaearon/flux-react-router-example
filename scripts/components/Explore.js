import React, { Component, PropTypes, findDOMNode } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

const DEFAULT_LOGIN = 'gaearon';
const GITHUB_REPO = 'https://github.com/gaearon/flux-react-router-example';

function parseFullName(params) {
  if (!params.login) {
    return DEFAULT_LOGIN;
  }

  return params.login + (params.name ? '/' + params.name : '');
}

export default class Explore extends Component {
  static propTypes = {
    params: PropTypes.shape({
      login: PropTypes.string,
      name: PropTypes.string
    })
  };

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);

    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleGoClick = this.handleGoClick.bind(this);
    this.getInputValue = this.getInputValue.bind(this);

    // State that depends on props is often an anti-pattern, but in our case
    // that's what we need to we can update the input both in response to route
    // change and in response to user typing.
    this.state = {
      loginOrRepo: parseFullName(props.params)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loginOrRepo: parseFullName(nextProps.params)
    });
  }

  render() {
    return (
      <div className='Explore'>
        <p>Type a username or repo full name and hit 'Go':</p>
        <input size='45'
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
    // Update the internal state because we are using a controlled input.
    // This way we can update it *both* in response to user input *and*
    // in response to navigation in `componentWillReceiveProps`.
    this.setState({
      loginOrRepo: this.getInputValue()
    });
  }

  handleGoClick() {
    this.context.history.pushState(null, `/${this.getInputValue()}`);
  }

  getInputValue() {
    return findDOMNode(this.refs.loginOrRepo).value;
  }
}
