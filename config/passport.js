const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

const GOOGLE_CLIENT_CALLBACK_URL = `/auth/google/callback`;

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CLIENT_CALLBACK_URL,
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          // console.log(profile);
          const { id: googleId, displayName, name, photos } = profile;
          const { givenName: firstName, familyName: lastName } = name;
          const { value: image } = photos[0];

          let user = await User.findOne({ googleId });
          if (user) {
            return done(null, user);
          }
          if (!user) {
            user = await User.create({
              googleId,
              displayName,
              firstName,
              lastName,
              image,
            });
            return done(null, user);
          }
        } catch (err) {
          console.error(err);
        }

        // await User.findOrCreate(
        //   {
        //     googleId,
        //     displayName,
        //     firstName,
        //     lastName,
        //     image,
        //   },
        //   function (err, user) {
        //     return done(err, user);
        //   }
        // );
        done();
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) =>
    User.findById(id, (err, user) => {
      done(err, user);
    })
  );
};
