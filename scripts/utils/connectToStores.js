'use strict';

import React from 'react';
import shallowEqual from 'react/lib/shallowEqual';

export default function connectToStores(
  Component, stores, pickProps, getState) {

  return class StoreConnector extends React.Component {

    constructor(props) {
      super(props);
      this.state = this.getStateFromStores(props);

      this.handleStoresChanged = this.handleStoresChanged.bind(this);
    }

    getStateFromStores(props) {
      return getState(pickProps(props));
    }

    componentDidMount() {
      stores.forEach(store =>
        store.addChangeListener(this.handleStoresChanged)
      );
    }

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(pickProps(nextProps), pickProps(this.props))) {
        this.setState(this.getStateFromStores(nextProps));
      }
    }

    componentWillUnmount() {
      stores.forEach(store =>
        store.removeChangeListener(this.handleStoresChanged)
      );
    }

    handleStoresChanged() {
      this.setState(this.getStateFromStores(this.props));
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  };
}
