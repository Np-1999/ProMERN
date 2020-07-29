const { UserInputError } = require('apollo-server-express');
const { getDB, getNextSequence } = require('./db.js');
const { mustBeSignedIn } = require('./auth.js');

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
const PAGE_SIZE = 10;
async function List(_, { status, effortMin, effortMax, search, page }) {
  const db = getDB();
  const filter = {};
  if (status) {
    filter.status = status;
  }
  if(search) filter.$text = { $search: search }
  if (effortMin !== undefined || effortMax !== undefined) {
    filter.effort = {};
    if (effortMin !== undefined) {
      filter.effort.$gte = effortMin;
    }
    if (effortMax !== undefined) {
      filter.effort.$lte = effortMax;
    }
  }
  const cursor = db.collection('issues').find(filter)
                .sort({id:1})
                .skip(PAGE_SIZE*(page-1))
                .limit(PAGE_SIZE); 
  const totalCount = await cursor.count(false);
  const issues = cursor.toArray();
  const pages = Math.ceil(totalCount/PAGE_SIZE);
  return {issues, pages};
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
async function get(_, { id }) {
  const db = getDB();
  const filter = {};
  filter.id = id;
  const issue = await db.collection('issues').findOne(filter);
  return issue;
}
async function update(_, { id, changes }) {
  const db = getDB();
  if (changes.title || changes.owner || changes.status) {
    const issue = await db.collection('issues').findOne({ id });
    Object.assign(issue, changes);
    validate(issue);
  }
  await db.collection('issues').updateOne({ id }, { $set: changes });
  const savedIssue = await db.collection('issues').findOne({ id });
  return savedIssue;
}
async function Delete(_, { id }) {
  const db = getDB();
  const issue = await db.collection('issues').findOne({ id });
  if (!issue) return false;
  issue.deleted = new Date();
  let result = await db.collection('deletedIssue').insertOne(issue);
  if (result.insertedId) {
    result = await db.collection('issues').removeOne({ id });
    console.log(result.deletedCount);
    return (result.deletedCount === 1);
  }
  return false;
}
async function counts(_,{status, effortMin, effortMax}) {
  const db = getDB();
  const filter = {};
  if (status) {
    filter.status = status;
  }
  if (effortMin !== undefined || effortMax !== undefined) {
    filter.effort = {};
    if (effortMin !== undefined) {
      filter.effort.$gte = effortMin;
    }
    if (effortMax !== undefined) {
      filter.effort.$lte = effortMax;
    }
  }
  const result =await db.collection('issues').aggregate([
    {$match: filter},
    {
      $group:{
        _id: {owner: '$owner', status:'$status'},
        count:{$sum:1}
      }
    }
  ]).toArray();
  const stats = {};
  result.forEach(result => {
    const {owner, status: statusKey } = result._id;
    if(!stats[owner]) stats[owner] = {owner};
    stats[owner][statusKey] = result.count;
  });
  return Object.values(stats);
}
async function restore(_,{id}){
  const db = getDB();
  const issue = await db.collection('deletedIssue').findOne({ id });
  if (!issue) return false;
  issue.deleted = new Date();
  let result = await db.collection('issues').insertOne(issue);
  if (result.insertedId) {
    result = await db.collection('deletedIssue').removeOne({ id });
    console.log(result.deletedCount);
    return (result.deletedCount === 1);
  }
  return false;
}
module.exports = {
  List, Add:mustBeSignedIn(Add), get, update:mustBeSignedIn(update), Delete:mustBeSignedIn(Delete), counts, restore:mustBeSignedIn(restore)
};
