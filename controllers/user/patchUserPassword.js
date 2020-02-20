const Joi = require('@hapi/joi');
const User = require('../../models/User');

module.exports = async (request, response, next) => {

    let dataSchema = Joi.object({
        old: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,36})/).min(8).max(36).required(),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,36})/).min(8).max(36).required(),
        passwordRe: Joi.any().valid(Joi.ref('password')).required(),
    });

    try {
        let info = await dataSchema.validateAsync(request.body, { abortEarly: false, allowUnknown: true });
        let user = request.user;
        user = request.user;
        let match = await user.validatePassword(info.old);
        if (!match)
            return response.json({error:"Incorrect password"})
        await user.setPassword(info.password);
        await user.save();
        return response.json({ success: 'User updated.' });
    } catch (error) {
        return next(error);
    }
};