/* eslint "no-alert": "off" */
import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Page from '../src/Page.jsx';
import store from '../src/store.js';

store.intialData = window.__INITIAL_DATA__;
const element = (
  <Router>
    <Page />
  </Router>
);
ReactDOM.hydrate(element, document.getElementById('content'));
if (module.hot) {
  module.hot.accept();
}
