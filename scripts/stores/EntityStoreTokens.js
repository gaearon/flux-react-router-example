'use strict';

module.exports = [
  require('./UserStore'),
  require('./RepoStore')
].map(s => s.dispatchToken);