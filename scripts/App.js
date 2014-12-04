'use strict';

var React = require('react'),
    Explore = require('./components/Explore'),
    DocumentTitle = require('react-document-title'),
    { RouteHandler } = require('react-router'),
    { PropTypes } = React;

var App = React.createClass({
  propTypes: {
    params: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired
  },

  render() {
    return (
      <DocumentTitle title='Sample App'>
        <div className='App'>
          <Explore />
          <hr />
          <RouteHandler {...this.props} />
        </div>
      </DocumentTitle>
    );
  }
});

module.exports = App;