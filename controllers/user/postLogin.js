const passport = require('../../config/LocalStrategy');
const Joi = require('@hapi/joi');

module.exports = async (request, response, next) => {

    let dataSchema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    });

    try {
        await dataSchema.validateAsync(request.body, { abortEarly: false, allowUnknown: true });
        passport.authenticate('local', async (error, user, info) => {
            if (error)
                return response.status(500).json({ error: 'Internal server error.' });
            if (!user)
                return response.json({ error: info.message });
            let token = await user.generateJWT();
            return response.cookie('token', token, { httpOnly: true }).json({ success: "You are now logged in." });
        })(request, response, next)
    } catch (error) {
        return next(error);
    }
};