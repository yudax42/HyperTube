'use strict'
const User = require('../../models/User');

module.exports = async (request, response,next) => {

    try {
        let user = await User.findById(request.user._id).populate({path:'watchLater'});
        return response.json(user.watchLater);
    } catch (error) {
        return next(error);
    }
};