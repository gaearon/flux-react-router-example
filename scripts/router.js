'use strict';

var { create: createRouter, HistoryLocation, HashLocation } = require('react-router'),
    routes = require('./routes');

var router = createRouter({
  location: process.env.NODE_ENV === 'production' ? HashLocation : HistoryLocation,
  routes: routes
});

module.exports = router;