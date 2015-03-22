'use strict';

import React from 'react';
import router, {transitionTo} from './router';

router.run((Handler, state) => {
  // I know, passing `transitionTo` like this is ugly,
  // haven't found a better solution yet though.
  // Since `Explore` component is not in the Router `context`
  // we have to pass it along, somehow.
  React.render(<Handler {...state} transitionTo={transitionTo} />, document.body);
});
