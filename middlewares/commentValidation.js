const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi); 

module.exports = {
    addComment: async (req, res, next) => {
        const schema = Joi.object({
            imdbid: Joi.string().required().min(4).max(25),
            commentBody: Joi.string()
                .min(1)
                .max(500)
                .required()
        })
    
        try {
            const value = await schema.validateAsync(req.body);
            next();
        } catch (error) {
            next(error);
        }
    },

    getComments: async (req, res, next) => {
        const schema = Joi.object({
            imdbid: Joi.string().required().min(4).max(25),
        })
    
        try {
            const value = await schema.validateAsync(req.params);
            next();
        } catch (error) {
            next(error);
        }
    },

    vote: async (req, res, next) => {
        const schema = Joi.object({
            commentId: Joi.objectId()
        })
    
        try {
            const value = await schema.validateAsync(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }
}

