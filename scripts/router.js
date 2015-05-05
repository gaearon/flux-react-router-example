import routes from './routes';
import {
  create as createRouter,
  HistoryLocation,
  HashLocation
} from 'react-router';

// Use hash location for Github Pages
// but switch to HTML5 history locally.
const location = process.env.NODE_ENV === 'production' ?
  HashLocation :
  HistoryLocation;

export default createRouter({ routes, location });
