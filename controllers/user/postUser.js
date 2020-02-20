const Joi = require('@hapi/joi');
const User = require('../../models/User');
const uuidv1 = require('uuid/v1');

module.exports = async (request, response, next) => {

    let dataSchema = Joi.object({
        username: Joi.string().pattern(/^[A-z0-9]{5,20}$/).min(5).max(20).required(),
        mail: Joi.string().email().required(),
        lastName: Joi.string().pattern(/^[A-z]{3,15}$/).min(3).max(15).required(),
        firstName: Joi.string().pattern(/^[A-z]{3,15}$/).min(3).max(15).required(),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,36})/).min(8).max(36).required(),
        passwordRe: Joi.any().valid(Joi.ref('password')).required(),
    });

    try {
        let info = await dataSchema.validateAsync(request.body, { abortEarly: false, allowUnknown: true });
        let user = await User.findOne({ username: info.username });
        if (user)
            return response.json({ errors: { username: 'Username already exists.' } });
        user = await User.findOne({ mail: info.mail });
        if (user)
            return response.json({ errors: { mail: 'E-Mail already exists.' } });
        user = new User({ username: info.username, firstName: info.firstName, lastName: info.lastName, mail: info.mail });
        await user.setPassword(info.password);
        let token = uuidv1();
        user.token = token;
        await user.save();
        await user.sendMail('Validate your account', `http://localhost:3000/validate/${token}`);
        return response.json({ success: 'Account has been created.Please check your mail for activation' });
    } catch (error) {
        return next(error);
    }
};