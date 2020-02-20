const User = require('../../models/User');
const Joi = require('@hapi/joi');
const uuidv1 = require('uuid/v1');

module.exports = async (request, response, next) => {

    let dataSchema = Joi.object({
        token: Joi.string().required(),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,36})/).min(8).max(36).required(),
        passwordRe: Joi.any().valid(Joi.ref('password')).required(),
    });

    try {
        let info = await dataSchema.validateAsync(request.body, { abortEarly: false, allowUnknown: true });
        if (info.token === '0')
            return response.json({ error: "BAD TOKEN." })
        let user = await User.findOne({ token: info.token });
        if (!user)
            return response.json({ error: "BAD TOKEN." })
        user.token = '0';
        user.setPassword(info.password);
        await user.save();
        return response.json({ success: "Password changed successfuly" });
    } catch (error) {
        return next(error);
    }
};