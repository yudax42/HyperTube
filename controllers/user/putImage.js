'use strict'
const User = require('../../models/User');
const { loadImage } =  require('canvas');
const Joi = require('@hapi/joi');
const fs = require('fs');

module.exports = async (request, response, next) => {
    try {
        if (!request.file || request.file.size < 100)
            return response.status(400).json({ error: "Please upload an image." });

        loadImage(request.file.path)
            .then(async () => {
                let user = request.user;
                user.imagePath = request.file.path;
                const image = await user.save();
                let img = fs.readFileSync(image.imagePath, { encoding: 'base64' });
                img = "data:" + "image/jpg" + ";base64," + img;
                response.json({ image: img });
            })
            .catch(() => {
                return response.status(400).json({ error: "Please upload a valid image." });
            })

    } catch (err) {
        return next(err);
    }

};