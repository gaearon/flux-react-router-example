'use strict';

import { create as createRouter, HistoryLocation, HashLocation } from 'react-router';
import routes from './routes';

export default createRouter({
  location: process.env.NODE_ENV === 'production' ? HashLocation : HistoryLocation,
  routes
});
