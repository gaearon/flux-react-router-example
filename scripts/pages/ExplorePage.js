/** @jsx React.DOM */
'use strict';

var React = require('react'),
    LinkedStateMixin = require('react/lib/LinkedStateMixin'),
    transitionTo = require('react-router/transitionTo');

var ExplorePage = React.createClass({
  mixins: [LinkedStateMixin],

  getInitialState() {
    return {
      loginOrRepo: null
    };
  },

  render() {
    return (
      <div className='Explore'>
        <p>Type a username or repo full name and hit 'Go':</p>
        <input valueLink={this.linkState('loginOrRepo')} />
        <button onClick={this.handleGoClick}>Go!</button>
      </div>
    );
  },

  handleGoClick() {
    transitionTo('/' + this.state.loginOrRepo);
  }
});

module.exports = ExplorePage;