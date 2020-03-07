var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/User");

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "484399570393-u4tpf42mojf9ejfeq58m73u76fm9f6u1.apps.googleusercontent.com",
      clientSecret: "kBbpWlV0orVWtnFiDTNAlGal",
      callbackURL: "http://localhost:5000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ email: profile.emails[0].value }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          User.create(
            { name: profile.displayName, email: profile.emails[0].value },
            function(err, user) {
              if (err) {
                return done(err);
              }
              return done(null, user);
            }
          );
        }
        return done(null, user);
      });
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  },
  function(req, email, password, done) {
    if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

    // asynchronous
    process.nextTick(function() {
      User.findOne({ email: email }, function(err, user) {
        // if there are any errors, return the error
        if (err) return done(err);

        // if no user is found, return the message
        if (!user)
          return done(null, false, req.flash("error", "No user found."));

        if (!user.validPassword(password))
          return done(
            null,
            false,
            req.flash("error", "Oops! Wrong password.")
          );
        // all is well, return user
        else return done(null, user);
      });
    });
  }
));
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      if (email) email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

      // asynchronous
      process.nextTick(function() {
        if (!req.user) {
          User.findOne({ email: email }, function(err, user) {
            if (err) return done(err);
            if (user) {
              return done(
                null,
                false,
                req.flash("error", "That email is already taken.")
              );
            } else {
              var newUser = new User();
              newUser.name = email;
              newUser.email = email;
              newUser.password = newUser.generateHash(password);

              newUser.save(function(err) {
                if (err) return done(err);

                return done(null, newUser);
              });
            }
          });
        } else {
          return done(null, req.user);
        }
      });
    }
  )
);
module.exports = passport;
