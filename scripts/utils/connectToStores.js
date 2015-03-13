'use strict';

var React = require('react');
var shallowEqual = require('react/lib/shallowEqual');

function connectToStores(Component, stores, pickProps, getState) {
  var StoreConnector = React.createClass({
    getStateFromStores(props) {
      return getState(pickProps(props));
    },

    getInitialState() {
      return this.getStateFromStores(this.props);
    },

    componentDidMount() {
      stores.forEach(store =>
        store.addChangeListener(this.handleStoresChanged)
      );

      this.setState(this.getStateFromStores(this.props));
    },

    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(pickProps(nextProps), pickProps(this.props))) {
        this.setState(this.getStateFromStores(nextProps));
      }
    },

    componentWillUnmount() {
      stores.forEach(store =>
        store.removeChangeListener(this.handleStoresChanged)
      );
    },

    handleStoresChanged() {
      if (this.isMounted()) {
        this.setState(this.getStateFromStores(this.props));
      }
    },

    render() {
      return <Component {...this.props} {...this.state} />
    }
  });

  return StoreConnector;
}

module.exports = connectToStores;