import React, { Component, PropTypes } from 'react';
import Explore from './components/Explore';
import DocumentTitle from 'react-document-title';

export default class App extends Component {

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

App.propTypes = {
  children: PropTypes.object
};
