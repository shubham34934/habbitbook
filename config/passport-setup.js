const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_URL } = require('./config');
const User = require("./../models/user");
const Profile = require('../models/profile');


passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((id, done) => {
    models.User.findById(id, (err, user) => done(err, user));
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${APP_URL}/api/v1/auth/google/redirect`,
},
    async (req, accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({ googleId: profile.id });
            if (user) {
                req.user = user;
                done(null, user);
            } else {
                const newUser = new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    avatar: profile.photos[0].value
                });
                await newUser.save();
                const userProfile = new Profile({ user: newUser.id });
                await userProfile.save();
                req.user = newUser;
                done(null, newUser);
            }
        } catch (error) {
            done(error, null);
        }
    }
));