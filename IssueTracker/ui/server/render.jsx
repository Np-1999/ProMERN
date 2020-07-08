import React from 'react';
import About from '../src/About.jsx';
import store from '../src/store.js'
import template from './template.js';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import Page from '../src/Page.jsx';
import routes from '../src/routes.js';


async function render(req,res) {
    const activeRoute = routes.find(
        route => matchPath(req.path, route),
    );
    let intialData;
    if(activeRoute && activeRoute.component.fetchData) {
        const match = matchPath(req.path, activeRoute);
        const index = req.url.indexOf('?');
        const search = index != -1 ? req.url.substr(index) : null;
        intialData = await activeRoute.component.fetchData(match,search);
    }
    store.intialData = intialData;
    const context={};
    const element = (
        <StaticRouter location={req.url} context={context}>
            <Page />
        </StaticRouter>
    );
    const body = ReactDOMServer.renderToString(element);
    if(context.url) {
        res.redirect(301,context.url);
    }else{
        res.send(template(body,intialData));
    }
       
}
export default render;