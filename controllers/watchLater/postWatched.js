'use strict'
const Joi = require('@hapi/joi');
const Watch = require('../../models/Watch');
const Movie = require('../../models/Movie');
const User = require('../../models/User');
Joi.objectId = require('joi-objectid')(Joi)

module.exports = async (request, response, next) => {

    let dataSchema = Joi.object({
        imdbid: Joi.string().required(),
    });

    try {
        let info = await dataSchema.validateAsync(request.body, { abortEarly: false, allowUnknown: true });
        let user = await User.findById(request.user._id).populate({
            path: 'watched',
            populate: {
                path: 'movie'
            }
        });
        let movie = await Movie.findOne({ imdbid: info.imdbid });
        if (!movie)
            return response.status(400).json({ error: "Movie does not exist." });
        let isWatched = false;
        user.watched.forEach(element => {
            if (element.movie.imdbid == info.imdbid)
                isWatched = true;
        });
        if (isWatched)
            return response.status(400).json({error:"You already watched this movie"});
        let watched = new Watch({ movie: movie._id });
        await watched.save();
        user.watched.push(watched._id);
        await user.save();
        return response.json({ success: "You watched this movie" });
    } catch (error) {
        return next(error);
    }
};