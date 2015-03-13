'use strict';

import React from 'react';
import router from './router';

router.run((Handler, state) => {
  React.render(<Handler {...state} />, document.body);
});
