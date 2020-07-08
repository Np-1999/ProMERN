import express from 'express';
import dotenv from 'dotenv';
import {createProxyMiddleware} from 'http-proxy-middleware';
import path from 'path'; 
import render from './render.jsx';
import SourceMapSupport from 'source-map-support';

const result = dotenv.config({path: (path.resolve(process.cwd(), 'sample.env'))});

if (result.error) {
  console.log( result.error);
}

const app = express();
SourceMapSupport.install();
const apiProxyTarget = process.env.API_PROXY_TARGET;
if (apiProxyTarget) {
  app.use('/graphql', createProxyMiddleware({ target: apiProxyTarget }));
}
if(!process.env.UI_API_ENDPOINT) {
  process.env.UI_API_ENDPOINT = 'http://localhost:3000/graphql';
}
if(!process.env.UI_SERVER_API_ENDPOINT) {
  process.env.UI_SERVER_API_ENDPOINT = process.env.UI_API_ENDPOINT;
}
app.get('/env.js', (req, res) => {
  const env = { UI_API_ENDPOINT: process.env.UI_API_ENDPOINT };
  res.send(`window.ENV=${JSON.stringify(env)}`);
});
const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';
if (enableHMR && (process.env.NODE_ENV !== 'production')) {
  console.log('Adding dev middleware, enabling HMR');
  /* eslint "global-require": "off" */
  /* eslint "import/no-extraneous-dependencies": "off" */
  const webpack = require('webpack');
  const devMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');
  const config = require('../webpack.config.js')[0];
  config.entry.app.push('webpack-hot-middleware/client');
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}
app.use(express.static('public'));
app.get('*',(req, res, next)=>{
  render(req, res, next);
});
const port = process.env.UI_SERVER_PORT || 8000;
app.listen(port, () => {
  console.log('UI server listening on port', port);
});
if (module.hot) {
  module.hot.accept('./render.jsx');
}