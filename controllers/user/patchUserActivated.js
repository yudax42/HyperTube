const User = require('../../models/User');
const Joi = require('@hapi/joi');
const uuidv1 = require('uuid/v1');

module.exports = async (request, response, next) => {

    let dataSchema = Joi.object({
        token: Joi.string().required(),
    });

    try {
        let info = await dataSchema.validateAsync(request.body, { abortEarly: false, allowUnknown: true });
        if (info.token === '0')
            return response.json({ error: "BAD TOKEN." })
        let user = await User.findOne({ token: info.token });
        if (!user)
            return response.json({ error: "BAD TOKEN." })
        user.token = '0';
        user.activated = true;
        await user.save();
        return response.json({ success: "Account activated" });
    } catch (error) {
        return next(error);
    }
};
