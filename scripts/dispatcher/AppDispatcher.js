'use strict';

import { Dispatcher } from 'flux';
import PayloadSources from '../constants/PayloadSources';

const AppDispatcher = Object.assign(new Dispatcher(), {
  handleServerAction(action) {
    console.log('server action', action);

    if (!action.type) {
      throw new Error('Empty action.type: you likely mistyped the action.');
    }

    this.dispatch({
      source: PayloadSources.SERVER_ACTION,
      action
    });
  },

  handleViewAction(action) {
    console.log('view action', action);

    if (!action.type) {
      throw new Error('Empty action.type: you likely mistyped the action.');
    }

    this.dispatch({
      source: PayloadSources.VIEW_ACTION,
      action
    });
  }
});

export default AppDispatcher;
