const User = require('../../models/User');
const Joi = require('@hapi/joi');
const uuidv1 = require('uuid/v1');

module.exports = async (request, response, next) => {

    let dataSchema = Joi.object({
        mail: Joi.string().email().required(),
    });

    try {
        let info = await dataSchema.validateAsync(request.body, { abortEarly: false, allowUnknown: true });
        let user = await User.findOne({ mail: info.mail });
        if (!user)
            return response.json({ error: "User does not exist" });
        let token = uuidv1();
        user.token = token;
        await user.save();
        await user.sendMail('Reset your password', `http://localhost:3000/resetpassword/${token}`);
        return response.json({ success: "A message has been sent to your E-Mail." })
    } catch (error) {
        return next(error);
    }
};