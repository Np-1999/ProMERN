const { mustBeSignedIn } = require('./auth.js');
let aboutMessage = 'Issue Tracker API v1.0';
function setAboutMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}
function getAboutMessage() {
  return aboutMessage;
}
module.exports = { getAboutMessage, setAboutMessage:mustBeSignedIn(setAboutMessage) };
