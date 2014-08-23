'use strict';

function createStoreMixin(...stores) {
  var StoreMixin = {
    getInitialState() {
      return this.getStateFromStores();
    },

    componentDidMount() {
      stores.forEach(store =>
        store.addChangeListener(this.handleStoresChanged)
      );
    },

    componentWillUnmount() {
      stores.forEach(store =>
        store.removeChangeListener(this.handleStoresChanged)
      );
    },

    handleStoresChanged() {
      this.setState(this.getStateFromStores());
    }
  };

  return StoreMixin;
}

module.exports = createStoreMixin;