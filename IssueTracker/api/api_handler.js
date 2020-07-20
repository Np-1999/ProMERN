const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');
const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const issue = require('./issue.js');
require('dotenv').config({ path: 'sample.env' });

const resolvers = {
  Query: {
    about: about.getAboutMessage,
    issueList: issue.List,
    issue: issue.get,
    IssueCounts: issue.counts,
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

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => { // Error report at serverside
    console.log(error);
    return error;
  },
});
function installHandler(app) {
  const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
  console.log('CORS setting:', enableCors);
  server.applyMiddleware({ app, path: '/graphql', cors: enableCors });
}
module.exports = { installHandler };
