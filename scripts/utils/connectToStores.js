'use strict';

import React from 'react';
import shallowEqual from 'react/lib/shallowEqual';

// FIXME: `isMounted` is deprecated in React 0.13
// but we need this otherwise we get a warning
//
//    Warning: setState(...): Can only update a mounted or mounting component.
//    This usually means you called setState() on an unmounted component.
//    This is a no-op.
//
// Apparently this is because `handleStoresChanged` is called multiple times,
// even when the component is unmounted. Not sure how to fix this yet...
const isMounted = (component) => {
  try {
    React.findDOMNode(component);
    return true;
  } catch (e) {
    return false;
  }
};

export default (Component, stores, pickProps, getState) => {
  class StoreConnector extends React.Component {
    constructor(props) {
      super(props);
      this.state = this.getStateFromStores(props);
    }

    getStateFromStores(props) {
      return getState(pickProps(props));
    }

    componentDidMount() {
      stores.forEach(store =>
        store.addChangeListener(this.handleStoresChanged.bind(this))
      );
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
      if (isMounted(this)) {
        this.setState(this.getStateFromStores(this.props));
      }
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  }

  return StoreConnector;
};
