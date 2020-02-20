'use strict'
const Joi = require('@hapi/joi');
const Watch = require('../../models/Watch');
const Movie = require('../../models/Movie');
Joi.objectId = require('joi-objectid')(Joi)

module.exports = async (request, response,next) => {

    let dataSchema = Joi.object({
        imdbid: Joi.string().required(),
    });

    try {
        let info = await dataSchema.validateAsync(request.body, { abortEarly: false, allowUnknown: true });
        let user = await User.findById(request.user._id).populate({
            path: 'watchLater',
            populate: {
                path: 'movie'
            }
        });
        let movie = await Movie.findOne({imdbid:info.imdbid});

        if (!movie)
            return response.status(400).json({ error: "Movie does not exist." });
        let isWatched = false;
        user.watchLater.forEach(element => {
            if (element.movie.imdbid == info.imdbid)
                isWatched = true;
        });
        if (isWatched)
            return response.status(400).json({error:"You already added this movie to the list"});
        let watchLater = new Watch({ movie: movie._id });
        await watchLater.save();
        user.watchLater.push(watchLater._id);
        await user.save();
    } catch (error) {
        return next(error);
    }
};