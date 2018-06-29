import React from 'react';
import { render } from 'react-dom';

import App from './app';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;
// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;
// Render the main component into the dom
render(
  (
    <App />
  ), document.querySelector('#app')
);
