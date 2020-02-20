'use strict'
const fs = require('fs');
const Joi = require('@hapi/joi');
const User = require('../../models/User');
Joi.objectId = require('joi-objectid')(Joi)

module.exports = async (request, response, next) => {

    let dataSchema = Joi.object({
        username: Joi.string().pattern(/^[A-z0-9]{5,20}$/).min(5).max(20).required(),
    });

    try {
        let info = await dataSchema.validateAsync(request.params, { abortEarly: false, allowUnknown: true });
        let user = await User.findOne({ username: info.username });
        if (!user)
            return response.status(404).json({ error: "Not found." });
        let img = user.imagePath;
        if (!img)
            return response.json({ image: false });
        img = fs.readFileSync(img, { encoding: 'base64' });
        img = "data:" + "image/jpg" + ";base64," + img;
        return response.json({
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            image: img
        });
    } catch (error) {
        return next(error);
    }
};