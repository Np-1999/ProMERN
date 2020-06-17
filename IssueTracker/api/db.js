const { MongoClient } = require('mongodb');
require('dotenv').config({ path: 'sample.env' });

let db;
async function connectToDb() {
  const url = process.env.DB_URL || 'mongodb://localhost/IssueTracker';
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to mongodb at ', url);
  db = client.db();
}
async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}
function getDB() {
  return db;
}
module.exports = { connectToDb, getNextSequence, getDB };
