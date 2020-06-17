const { UserInputError } = require('apollo-server-express');
const { getDB, getNextSequence } = require('./db.js');

function validate(issue) {
  const errors = [];
  if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.');
  }
  if (issue.status === 'Assigned' && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned"');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}
async function List() {
  const db = getDB();
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}
async function Add(_, { issue }) {
  console.log(issue);
  validate(issue);
  const db = getDB();
  const newIssue = ({ ...issue });
  newIssue.created = new Date();
  newIssue.id = await getNextSequence('issues');
  const result = await db.collection('issues').insertOne(newIssue);
  const savedIssue = await db.collection('issues').findOne({ _id: result.insertedId });
  return savedIssue;
}
module.exports = { List, Add };
