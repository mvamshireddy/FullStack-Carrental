const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, function(accessToken, refreshToken, profile, done) {
  // Here you would look up or create the user in your DB
  const User = require('../models/User'); // Adjust path as necessary
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async function(accessToken, refreshToken, profile, done) {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        // ...any other fields you want
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;

