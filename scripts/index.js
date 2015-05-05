import React from 'react';
import router from './router';

const rootEl = document.getElementById('root');
router.run((Handler, state) =>
  React.render(<Handler {...state} />, rootEl)
);
