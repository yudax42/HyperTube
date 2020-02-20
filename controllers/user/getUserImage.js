'use strict'
const fs = require('fs');
const Joi = require('@hapi/joi');
const User = require('../../models/User');
Joi.objectId = require('joi-objectid')(Joi)

module.exports = async (request, response) => {

    let dataSchema = Joi.object({
        userId: Joi.objectId().required(),
    });

    try {
        let info = await dataSchema.validateAsync(request.params, { abortEarly: false, allowUnknown: true });
        let user = await User.findById(info.userId);
        let img = user.imagePath;
        if (!img)
            return response.json({ image: false });
        img = fs.readFileSync(img, { encoding: 'base64' });
        img = "data:" + "image/jpg" + ";base64," + img;
        response.json({ image: img });
    } catch (error) {
        return next(error);
    }
};