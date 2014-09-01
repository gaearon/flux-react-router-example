'use strict';

var Dispatcher = require('./Dispatcher'),
    copyProperties = require('react/lib/copyProperties'),
    PayloadSources = require('../constants/PayloadSources');

var AppDispatcher = copyProperties(new Dispatcher(), {
  handleServerAction(action) {
    console.log('\n-=-=-=-=-=-=-=-=-=-');
    console.log(action);

    if (!action.type) {
      throw new Error('Empty action.type: you likely mistyped the action.');
    }

    this.dispatch({
      source: PayloadSources.SERVER_ACTION,
      action: action
    });

    console.log('-=-=-=-=-=-=-=-=-=-\n');
  },

  handleViewAction(action) {
    console.log('\n-=-=-=-=-=-=-=-=-=-');
    console.log(action);

    if (!action.type) {
      throw new Error('Empty action.type: you likely mistyped the action.');
    }

    this.dispatch({
      source: PayloadSources.VIEW_ACTION,
      action: action
    });

    console.log('-=-=-=-=-=-=-=-=-=-\n');
  }
});

module.exports = AppDispatcher;