'use strict';

import React, { PropTypes } from 'react';
import Explore from './components/Explore';
import DocumentTitle from 'react-document-title';
import { RouteHandler } from 'react-router';

class App extends React.Component {
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
}
// or declare it in the constructor
App.propTypes = {
  params: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired
};

export default App;
