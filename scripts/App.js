/** @jsx React.DOM */
'use strict';

var React = require('react'),
    Explore = require('./components/Explore'),
    { PropTypes } = React;

var App = React.createClass({
  propTypes: {
    activeRouteHandler: PropTypes.func
  },

  render() {
    return (
      <div className='App'>
        <Explore />
        <hr />
        <this.props.activeRouteHandler />
      </div>
    );
  }
});

module.exports = App;