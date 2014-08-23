/** @jsx React.DOM */
'use strict';

var React = require('react'),
    User = require('./components/User'),
    Repo = require('./components/Repo');

var App = React.createClass({
  render() {
    return (
      <div>
        <User login='gaearon' />
        <Repo fullName='gaearon/react-hot-loader' />
      </div>
    );
  }
});

module.exports = App;