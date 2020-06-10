const express=require('express');
const fs=require('fs');
const { ApolloServer }= require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language'); 
const app=express();
let aboutMessage = "Issue Tracker API v1.0"; 
const issuesDB = [  
    {    
        id: 1, 
        status: 'New', 
        owner: 'Ravan', 
        effort: 5,    
        created: new Date('2019-01-15'), 
        due: undefined,    
        title: 'Error in console when clicking Add',  
    },  
    {    
        id: 2, 
        status: 'Assigned', 
        owner: 'Eddie', 
        effort: 14,    
        created: new Date('2019-01-16'), 
        due: new Date('2019-02-01'),    
        title: 'Missing bottom border on panel',  
    }, 
];
const GraphQLDate=new GraphQLScalarType({
    name:'GraphQLDate',
    description:'A Date() type in GraphQL as a Scalar',
    serialize(value){
        return value.toISOString();
    },
    parseValue(value){
        return new Date(value);
    },
    parseLiteral(ast){
        return (ast.kind == Kind.STRING) ? new Date(ast.value) : undefined;
    }
})
const resolvers={
    Query:{
        about:()=>{
            return aboutMessage;
        },
        issueList:issueList,
    },
    Mutation:{
        setAboutMessage:setAboutMessage,
        issueAdd:issueAdd
    },
    GraphQLDate
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
function issueAdd(_,{issue}){
    issue.created=new Date();
    issue.id=issuesDB.length+1;
    if(issue.status==undefined)
        issue.status='New';
    issuesDB.push(issue);
    return issue;
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