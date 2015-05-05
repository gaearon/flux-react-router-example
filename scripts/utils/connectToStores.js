import React, { Component } from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';

/**
 * Exports a higher-order component that connects the component to stores.
 * This higher-order component is most easily used as an ES7 decorator.
 * Decorators are just a syntax sugar over wrapping class in a function call.
 *
 * Read more about higher-order components: https://goo.gl/qKYcHa
 * Read more about decorators: https://github.com/wycats/javascript-decorators
 */
export default function connectToStores(stores, getState) {
  return function (DecoratedComponent) {
    const displayName =
      DecoratedComponent.displayName ||
      DecoratedComponent.name ||
      'Component';

    return class StoreConnector extends Component {
      static displayName = `connectToStores(${displayName})`;

      constructor(props) {
        super(props);
        this.handleStoresChanged = this.handleStoresChanged.bind(this);

        this.state = getState(props);
      }

      componentWillMount() {
        stores.forEach(store =>
          store.addChangeListener(this.handleStoresChanged)
        );
      }

      componentWillReceiveProps(nextProps) {
        if (!shallowEqual(nextProps, this.props)) {
          this.setState(getState(nextProps));
        }
      }

      componentWillUnmount() {
        stores.forEach(store =>
          store.removeChangeListener(this.handleStoresChanged)
        );
      }

      handleStoresChanged() {
        this.setState(getState(this.props));
      }

      render() {
        return <DecoratedComponent {...this.props} {...this.state} />;
      }
    };
  };
}
