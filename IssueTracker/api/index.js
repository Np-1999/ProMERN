const express = require('express');
const { installHandler } = require('./api_handler.js');
const { connectToDb } = require('./db.js');
require('dotenv').config({ path: 'sample.env' });
const auth = require('./auth.js');

const app = express();
const cookieParser = require('cookie-parser');
/* app.get('/',(req,res)=>{
    res.sendFile('public/index.html');
}); */
app.use(cookieParser());
app.use('/auth', auth.routes);
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
