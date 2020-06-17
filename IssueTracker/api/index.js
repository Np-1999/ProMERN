const express = require('express');
const { installHandler } = require('./api_handler.js');
const { connectToDb } = require('./db.js');
require('dotenv').config({ path: 'sample.env' });

const app = express();
/* app.get('/',(req,res)=>{
    res.sendFile('public/index.html');
}); */
installHandler(app);
const port = process.env.API_SERVER_PORT || 3000;
(async function () {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log('API Server listening on ', port);
    });
  } catch (err) {
    console.log('Error:', err);
  }
}());
