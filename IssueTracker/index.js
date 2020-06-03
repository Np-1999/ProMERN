const express=require('express');
const { ApolloServer }= require('apollo-server-express');
console.log(require('apollo-server-express'));
const app=express();
let aboutMessage = "Issue Tracker API v1.0"; 
const typeDefs=`
type Query{
    about :String!
}
type Mutation{
    setAboutMessage(message:String!): String
}
`;
const resolvers={
    Query:{
        about:()=>{
            return aboutMessage;
        },
    },
    Mutation:{
        setAboutMessage:setAboutMessage,
    },
};
const server=new ApolloServer({
    typeDefs,
    resolvers
});

function setAboutMessage(_,{message}){
    return aboutMessage=message;
}
const fileMiddleWare=express.static('public/');
app.use('/public',fileMiddleWare);
server.applyMiddleware({app,path:'/graphql'});
app.listen(3000,()=>{
    console.log("Server listening on 3000");
})