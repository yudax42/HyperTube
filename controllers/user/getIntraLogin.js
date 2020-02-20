const passport = require('../../config/LocalStrategy');
const Joi = require('@hapi/joi');

module.exports = async (request, response, next) => {

    try {
        passport.authenticate('42', async (error, user, info) => {
            if (error)
                return response.status(400).json({ error: error.message });
            if (!user)
                return response.json({ error: info.message });
            let token = await user.generateJWT();
            return response.cookie('token', token, { httpOnly: true }).json({ success: "You are now logged in." });
        })(request, response, next)
    } catch (error) {
        return next(error);
    }
};