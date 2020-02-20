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
    clientID: '114657491400-mv86g9t19nciu7feebaek9354hqiets9.apps.googleusercontent.com',
    clientSecret: 'QK_jU8Nuo7MIylRbB7hd5US9',
    callbackURL: "http://localhost:3000/login/oauth/google"
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
    clientID: '9986bf8b54add2afb841a55db1d87a57eb4483bebfbde24cbaa2a37c01c37b0b',
    clientSecret: '884254ef2dd7064af01e48237ba228b771e2b280f97b2d52fdb418a301476033',
    callbackURL: "http://localhost:3000/login/oauth/intra"
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