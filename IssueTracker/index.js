const express=require('express');
const fs=require('fs');
const { ApolloServer }= require('apollo-server-express');
console.log(require('apollo-server-express'));
const app=express();
let aboutMessage = "Issue Tracker API v1.0"; 
const issuesDB = [  
    {    
        id: 1, 
        status: 'New', 
        owner: 'Ravan', 
        effort: 5,    
        created: new Date('2019-01-15').toString(), 
        due: undefined,    
        title: 'Error in console when clicking Add',  
    },  
    {    
        id: 2, 
        status: 'Assigned', 
        owner: 'Eddie', 
        effort: 14,    
        created: new Date('2019-01-16').toString(), 
        due: new Date('2019-02-01').toString(),    
        title: 'Missing bottom border on panel',  
    }, 
];

const resolvers={
    Query:{
        about:()=>{
            return aboutMessage;
        },
        issueList:issueList,
    },
    Mutation:{
        setAboutMessage:setAboutMessage,
    },
};
const server=new ApolloServer({
    typeDefs:fs.readFileSync('schema.graphql','utf-8'),
    resolvers
});

function issueList(){
    return issuesDB;
}
function setAboutMessage(_,{message}){
    return aboutMessage=message;
}
const fileMiddleWare=express.static('public/');
app.use('/',fileMiddleWare);
server.applyMiddleware({app,path:'/graphql'});
/*app.get('/',(req,res)=>{
    res.sendFile('public/index.html');
});*/
app.listen(3000,()=>{
    console.log("Server listening on 3000");
})