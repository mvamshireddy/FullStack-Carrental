const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { sendLoginMail } = require('../utils/mailer'); // ADD THIS

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email =
        profile.emails && profile.emails[0] ? profile.emails[0].value : '';
      let user = await User.findOne({ googleId: profile.id });
      let isNew = false;
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email,
          name: profile.displayName,
        });
        isNew = true;
      }
      // Send login mail for Google login
      if (email && user && !isNew) {
        sendLoginMail(user.email, user.name).catch(e =>
          console.error('[MAIL DEBUG] Google login mail failed:', e)
        );
      }
      // No session, just pass user to callback
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

module.exports = passport;