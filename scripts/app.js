/** @jsx React.DOM */
'use strict';

var React = require('react'),
    User = require('./components/User');

var App = React.createClass({
  render() {
    return (
      <User login='gaearon' />
    );
  }
});

module.exports = App;