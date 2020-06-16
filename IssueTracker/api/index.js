const express=require('express');
const fs=require('fs');
const { ApolloServer, UserInputError }= require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language'); 
const { MongoClient }=require('mongodb');
require('dotenv').config({path:'sample.env'}); 
const app=express();
let aboutMessage = "Issue Tracker API v1.0";
let db;
const url = 'mongodb://localhost/IssueTracker';
async function connectToDb(){
    const client = new MongoClient(url,{useNewUrlParser:true});
    await client.connect();
    console.log("Connected to mongodb at ",url);
    db=client.db();
 } 
async function getNextSequence(name) {  
    const result = await db.collection('counters').findOneAndUpdate(    
         { _id: name },    
         { $inc: { current: 1 } },    
         { returnOriginal: false },  
    );  
    return result.value.current; 
}

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
        const dateValue = new Date(value);    
        return isNaN(dateValue) ? undefined : dateValue; 
    },
    parseLiteral(ast){
        if (ast.kind == Kind.STRING) {      
            const value = new Date(ast.value);      
            return isNaN(value) ? undefined : value;    
        } 
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
    resolvers,
    formatError: error => { //Error report at serverside    
        console.log(error);    
        return error;   
    },
});
function validateIssue(issue){
    const errors = [];  
    if (issue.title.length < 3) {    
        errors.push('Field "title" must be at least 3 characters long.')  
    }  
    if (issue.status == 'Assigned' && !issue.owner) {    
        errors.push('Field "owner" is required when status is "Assigned"');  
    }  
    if (errors.length > 0) {    
        throw new UserInputError('Invalid input(s)', { errors });  
    } 
}
async function issueList(){
    const issues= await db.collection('issues').find({}).toArray();
    return issues;
}
function setAboutMessage(_,{message}){
    return aboutMessage=message;
}
async function issueAdd(_,{issue}){
    console.log(issue);
    validateIssue(issue);
    issue.created=new Date();
    issue.id=await getNextSequence('issues');
    const result = await db.collection('issues').insertOne(issue);
    const savedIssue = await db.collection('issues').findOne({_id:result.insertedId}); 
    return savedIssue;
}

server.applyMiddleware({app,path:'/graphql'});
/*app.get('/',(req,res)=>{
    res.sendFile('public/index.html');
});*/
const port= process.env.API_SERVER_PORT ||3000;
(async function (){
    try{
        await connectToDb();
        app.listen(port,()=>{
            console.log("API Server listening on ",port);
        });
    }catch(err){
        console.log("Error:",err)
    }
})();
