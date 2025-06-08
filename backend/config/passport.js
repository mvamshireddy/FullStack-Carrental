const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Adjust path if necessary

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract email safely
      const email =
        profile.emails && profile.emails[0] ? profile.emails[0].value : '';

      // Try to find the user by Google ID
      let user = await User.findOne({ googleId: profile.id });

      // If not found, create a new user
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email,
          name: profile.displayName,
          // add more fields if needed
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Serialize by user ID (best practice)
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize gets full user from DB
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;