const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your SMTP service
  auth: {
    user: process.env.MAIL_USER, // your email
    pass: process.env.MAIL_PASS  // your app password (for gmail, use an App Password)
  }
});

exports.sendWelcomeMail = async (to, name) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: 'Welcome to ShadowCars!',
    html: `<h2>Hello ${name},</h2><p>Thank you for registering with us!</p>`
  };
  return transporter.sendMail(mailOptions);
};