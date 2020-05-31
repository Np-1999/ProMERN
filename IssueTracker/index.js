const express=require('express');
const app=express();
const fileMiddleWare=express.static('public/');
app.use('/',fileMiddleWare);
app.listen(3000,()=>{
    console.log("Server listening on 3000");
})