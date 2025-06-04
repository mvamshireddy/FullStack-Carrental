require('dotenv').config()
const { sendWelcomeMail } = require('./utils/mailer');
sendWelcomeMail('mvamshireddy9848@gmail.com', 'Test User').then(() => {
  console.log('Mail sent!');
}).catch(e => {
  console.error('Mail failed:', e);
});