'use strict';

import React from 'react';
import shallowEqual from 'react/lib/shallowEqual';

export default function connectToStores(Component, stores, pickProps, getState) {
  class StoreConnector extends React.Component {
    constructor(props) {
      this.state = this.getStateFromStores(props);
    }

    getStateFromStores(props) {
      return getState(pickProps(props));
    }

    componentDidMount() {
      stores.forEach(store =>
        store.addChangeListener(this.handleStoresChanged.bind(this))
      );

      this.setState(this.getStateFromStores(this.props));
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(pickProps(nextProps), pickProps(this.props))) {
        this.setState(this.getStateFromStores(nextProps));
      }
    }

    componentWillUnmount() {
      stores.forEach(store =>
        store.removeChangeListener(this.handleStoresChanged.bind(this))
      );
    }

    handleStoresChanged() {
      this.setState(this.getStateFromStores(this.props));
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  }

  return StoreConnector;
};
