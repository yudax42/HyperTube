const Joi = require('@hapi/joi');

module.exports = {
    searchSubtitles: async (req, res, next) => {
        const schema = Joi.object({
            imdbid: Joi.string().required().max(25),
        })
    
        try {
            const value = await schema.validateAsync(req.params);
            next();
        } catch (error) {
            next(error);
        }
    },

    loadSubtitles: async (req, res, next) => {
        const schema = Joi.object({
            path: Joi.string().required().max(800)
        })
    
        try {
            const value = await schema.validateAsync(req.query);
            next();
        } catch (error) {
            next(error);
        }
    }
}

