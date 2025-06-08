require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Set up OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });

async function createTransporter() {
  const accessToken = await oAuth2Client.getAccessToken();
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GOOGLE_MAIL_USER,
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
      accessToken: accessToken.token
    }
  });
}

exports.sendWelcomeMail = async (to, name) => {
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.GOOGLE_MAIL_USER,
    to,
    subject: 'Welcome to ShadowCars!',
    html: `<h2>Hello ${name},</h2><p>Thank you for registering with us!</p>`
  };
  return transporter.sendMail(mailOptions);
};

exports.sendLoginMail = async (to, name, loginTime = new Date()) => {
  const transporter = await createTransporter();
  const mailOptions = {
    from: process.env.GOOGLE_MAIL_USER,
    to,
    subject: 'Login Alert - ShadowCars',
    html: `<h2>Hello ${name},</h2>
      <p>Your account was just logged in at <b>${loginTime.toLocaleString()}</b>.</p>
      <p>If this wasn't you, please reset your password immediately.</p>`
  };
  return transporter.sendMail(mailOptions);
};

exports.sendCustomMail = async (to, subject, html) => {
  const transporter = await createTransporter();
  const mailOptions = { from: process.env.GOOGLE_MAIL_USER, to, subject, html };
  return transporter.sendMail(mailOptions);
};


//test
if (require.main === module) {
  exports.sendWelcomeMail('YOUR_EMAIL@gmail.com', 'Test User')
    .then(() => console.log('[MAIL DEBUG] Direct test: Welcome mail sent!'))
    .catch(err => console.error('[MAIL DEBUG] Direct test failed:', err));
}