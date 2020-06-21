/* eslint "no-alert": "off" */
import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Page from './Page.jsx';

const element = (
  <Router>
    <Page />
  </Router>
);
ReactDOM.render(element, document.getElementById('content'));
if (module.hot) {
  module.hot.accept();
}
