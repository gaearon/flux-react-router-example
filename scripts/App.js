/** @jsx React.DOM */
'use strict';

var React = require('react'),
    Explore = require('./components/Explore'),
    DocumentTitle = require('react-document-title'),
    { PropTypes } = React;

var App = React.createClass({
  propTypes: {
    activeRouteHandler: PropTypes.func
  },

  render() {
    return (
      <DocumentTitle title='Sample App'>
        <div className='App'>
          <Explore />
          <hr />
          <this.props.activeRouteHandler />
        </div>
      </DocumentTitle>
    );
  }
});

module.exports = App;