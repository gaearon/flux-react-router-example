'use strict';

import React from 'react';

class Explore extends React.Component {

  constructor() {
    this.state = {
      loginOrRepo: 'gaearon'
    };
  }

  render() {
    return (
      <div className='Explore'>
        <p>Type a username or repo full name and hit 'Go':</p>
        <input
          ref='loginOrRepo'
          onKeyUp={this.handleKeyUp.bind(this)}
          defaultValue={this.state.loginOrRepo} />
        <button onClick={this.handleGoClick.bind(this)}>Go!</button>
        <p>Code on <a href='https://github.com/gaearon/flux-react-router-example' target='_blank'>Github</a>.</p>
      </div>
    );
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleGoClick.call(this);
    }
  }

  handleGoClick() {
    let val = React.findDOMNode(this.refs.loginOrRepo).value;
    this.setState({loginOrRepo: val});
    this.props.transitionTo('/' + val);
  }
}
// or declare it in the constructor
Explore.propTypes = {
  transitionTo: React.PropTypes.func.isRequired
};

export default Explore;
