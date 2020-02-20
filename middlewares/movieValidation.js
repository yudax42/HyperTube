const Joi = require('@hapi/joi');

module.exports = {
    movieWatched: async (req, res, next) => {
        const schema = Joi.object({
            imdbid: Joi.string().required().max(25),
        })
    
        try {
            const value = await schema.validateAsync(req.query);
            next();
        } catch (error) {
            next(error);
        }
    },
}

