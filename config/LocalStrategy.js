const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20')
var FortyTwoStrategy = require('passport-42').Strategy;

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            let user = await User.findOne({ username });

            if (!user || !(await user.validatePassword(password)))
                return done(null, false, { message: 'Username or password is incorrect.' });
            else if (!user.activated)
                return done(null, false, { message: 'Your account is not activated.' });
            return done(null, user);
        } catch (error) {

            done(error)
        }
    }
));

passport.use(new GoogleStrategy({
    clientID: '', // use your own, change the value
    clientSecret: '',
    callbackURL: ""
},
    async function (accessToken, refreshToken, profile, done) {
        let user = await User.findOne({ googleId: profile.id });
        if (!user)
            user = await User.findOne({ mail: profile.emails[0].value });
        if (!user) {
            user = new User({
                mail: profile.emails[0].value,
                username: profile.provider + Date.now(),
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                googleId: profile.id,
                activated: true
            })
            await user.save();

        }
        return done(null, user);
    }
));

passport.use(new FortyTwoStrategy({
    clientID: '', /// use your own, change the value
    clientSecret: '',
    callbackURL: ""
},
    async function (accessToken, refreshToken, profile, done) {
        try {

            let user = await User.findOne({ intraId: profile.id });
            if (user)
                return done(null, user);
            user = await User.findOne({ mail: profile.emails[0].value });
            if (user)
                return done(null, false, { message: 'E-Mail already exists.' });
            user = new User({
                mail: profile.emails[0].value,
                username: profile.username + Date.now(),
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                intraId: profile.id,
                activated: true
            })
            await user.save();

            return done(null, user);
        } catch (error) {

        }
    }
));

module.exports = passport;