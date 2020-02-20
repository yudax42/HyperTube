'use strict'
const User = require('../../models/User');
module.exports = async (request, response) => {

    try {
        let users = await User.find();
        return response.json(users).populate({ path: 'watchLater' }).populate({ path: 'watched' });
    } catch (error) {
        return next(error);
    }
};