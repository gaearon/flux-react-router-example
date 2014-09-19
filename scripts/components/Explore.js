/** @jsx React.DOM */
'use strict';

var React = require('react'),
    LinkedStateMixin = require('react/lib/LinkedStateMixin'),
    { transitionTo } = require('react-router');

var Explore = React.createClass({
  mixins: [LinkedStateMixin],

  getInitialState() {
    return {
      loginOrRepo: 'gaearon'
    };
  },

  render() {
    return (
      <div className='Explore'>
        <p>Type a username or repo full name and hit 'Go':</p>
        <input autoFocus
               valueLink={this.linkState('loginOrRepo')}
               onKeyUp={this.handleKeyUp} />
        <button onClick={this.handleGoClick}>Go!</button>
      </div>
    );
  },

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this.handleGoClick();
    }
  },

  handleGoClick() {
    transitionTo('/' + this.state.loginOrRepo);
  }
});

module.exports = Explore;