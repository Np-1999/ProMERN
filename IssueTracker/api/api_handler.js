const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const issue = require('./issue.js');
const auth = require('./auth.js');
require('dotenv').config({ path: 'sample.env' });

const resolvers = {
  Query: {
    about: about.getAboutMessage,
    issueList: issue.List,
    issue: issue.get,
    IssueCounts: issue.counts,
    user: auth.resolveUser,
  },
  Mutation: {
    setAboutMessage: about.setAboutMessage,
    issueAdd: issue.Add,
    issueUpdate: issue.update,
    issueDelete: issue.Delete,
    issueRestore: issue.restore,
  },
  GraphQLDate,
};

function getContext({req}) {
  const user = auth.getUser(req);
  return { user };
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  context:getContext,
  formatError: (error) => { // Error report at serverside
    console.log(error);
    return error;
  },
});
function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  
  let cors;
  if(enableCors){
    const origin = process.env.UI_SERVER_ORIGIN || 'http://localhost:8000';
    const methods = 'POST';
    cors = {origin, methods, credentials: true};
  }else{
    cors = 'false';
  }
  console.log('CORS setting:', enableCors);
  server.applyMiddleware({ app, path: '/graphql', cors});
}
module.exports = { installHandler };
