import React, { PropTypes } from 'react';
import Explore from './components/Explore';
import DocumentTitle from 'react-document-title';
import { RouteHandler } from 'react-router';

export default class App {
  static propTypes = {
    params: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired
  };

  render() {
    return (
      <DocumentTitle title='Sample App'>
        <div className='App'>
          <Explore {...this.props} />
          <hr />
          {this.props.children}
        </div>
      </DocumentTitle>
    );
  }
}
