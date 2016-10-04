import React from 'react';
import { render } from 'react-dom';
import { browserHistory, hashHistory } from 'react-router';
import Root from './Root';

const rootEl = document.getElementById('root');
// Use hash location for Github Pages
// but switch to HTML5 history locally.
const history = process.env.NODE_ENV === 'production' ?
  hashHistory :
  browserHistory;

render(<Root history={history} />, rootEl);
