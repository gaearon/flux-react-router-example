'use strict';

import { Dispatcher } from 'flux';

class AppDispatcher extends Dispatcher {
  dispatch(action) {
    // In production, thanks to DefinePlugin in webpack.config.production.js,
    // this comparison will turn `false`, and UglifyJS will cut it out as dead code.
    if (process.env.NODE_ENV !== 'production') {
      // All data that flows into our application comes in form of actions.
      // Actions are just plain JavaScript objects describing “what happened”.
      // Think of them as newspapers.
      console.log(action.type, action);
    }

    // Generally, inheritance and super() calls are a terrible idea,
    // but we're only going one level deep here so it's not a big issue.
    // Try to avoid it though!
    super.dispatch(action);
  }

  // Some Flux examples have methods like `handleViewAction`
  // or `handleServerAction` here. They are only useful if you
  // want to have extra pre-processing or logging for such actions,
  // but I have usually found a single dispatch() method to be more convenient.
}

// We only need a single dispatcher per application.
export default new AppDispatcher();