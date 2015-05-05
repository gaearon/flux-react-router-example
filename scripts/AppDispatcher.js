import { Dispatcher } from 'flux';

class AppDispatcher extends Dispatcher {
  /**
   * Dispatches three actions for an async operation represented by promise.
   */
  dispatchAsync(promise, types, action = {}) {
    const { request, success, failure } = types;

    this.dispatch(request, action);
    promise.then(
      response => this.dispatch(success, { ...action, response }),
      error => this.dispatch(failure, { ...action, error })
    );
  }

  /**
   * Dispatches a single action.
   */
  dispatch(type, action = {}) {
    if (!type) {
      throw new Error('You forgot to specify type.');
    }

    // In production, thanks to DefinePlugin in webpack.config.production.js,
    // this comparison will turn `false`, and UglifyJS will cut logging out
    // as part of dead code elimination.
    if (process.env.NODE_ENV !== 'production') {
      // Logging all actions is useful for figuring out mistakes in code.
      // All data that flows into our application comes in form of actions.
      // Actions are just plain JavaScript objects describing “what happened”.
      // Think of them as newspapers.
      if (action.error) {
        console.error(type, action);
      } else {
        console.log(type, action);
      }
    }

    // Generally, inheritance and super() calls are a terrible idea,
    // but we're only going one level deep here so it's not a big issue.
    // Try to avoid it though!
    super.dispatch({ type, ...action });
  }

  // Some Flux examples have methods like `handleViewAction`
  // or `handleServerAction` here. They are only useful if you
  // want to have extra pre-processing or logging for such actions,
  // but I have usually found a single dispatch() method to be more convenient.
}

// We only need a single dispatcher per application.
export default new AppDispatcher();
