const Joi = require('@hapi/joi');
const User = require('../../models/User');

module.exports = async (request, response, next) => {

    let dataSchema = Joi.object({
        lastName: Joi.string().pattern(/^[A-z]{3,15}$/),
        firstName: Joi.string().pattern(/^[A-z]{3,15}$/),
        bio: Joi.string().pattern(/^[A-z0-9-_ ]{5,300}$/),
        mail: Joi.string().email(),
        username: Joi.string().pattern(/^[A-z0-9]{5,20}$/).min(5).max(20),
        lang: Joi.string().valid('en', 'fr'),
    });

    try {
        let info = await dataSchema.validateAsync(request.body, { abortEarly: false, allowUnknown: true });
        let user = await User.findOne({ username: info.username });
        let errors = {}
        if (request.user.username !== info.username && user)
            errors.username = "Username already exists.";
        user = await User.findOne({ mail: info.mail });
        if (request.user.mail !== info.mail && user)
            errors.mail = "E-Mail already exists.";
        if (errors.username || errors.mail)
            return response.json({ errors });
        user = request.user;
        user.username = info.username ? info.username : user.username;
        user.mail = info.mail ? info.mail : user.mail;
        user.lastName = info.lastName ? info.lastName : user.firstName;
        user.firstName = info.firstName ? info.firstName : user.firstName;
        user.bio = info.bio ? info.bio : user.bio;
        user.lang = info.lang ? info.lang : user.lang;
        await user.save();
        return response.json({ success: 'User updated.' });
    } catch (error) {
        return next(error);
    }
};