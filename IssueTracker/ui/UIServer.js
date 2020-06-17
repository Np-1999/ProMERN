const express = require('express')
require('dotenv').config({path:'sample.env'});
const { createProxyMiddleware } = require('http-proxy-middleware');  
const app = express();
const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || 'http://localhost:3000/graphql'; 
const apiProxyTarget = process.env.API_PROXY_TARGET;
if (apiProxyTarget) {  
    app.use('/graphql',  createProxyMiddleware ({ target: apiProxyTarget })); 
}
const env = { UI_API_ENDPOINT };
app.get('/env.js',function(req,res){
    res.send(`window.ENV=${JSON.stringify(env)}`)
})
app.use(express.static('public'));
const port= process.env.UI_SERVER_PORT|| 8000;
app.listen(port,()=>{
    console.log("UI server listening on port",port);
})