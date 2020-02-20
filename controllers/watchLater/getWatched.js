'use strict'
const User = require('../../models/User');

module.exports = async (request, response,next) => {

    try {
        let user = await User.findById(request.user._id).populate({path:'watched'});
        return response.json(user.watched);
    } catch (error) {
        return next(error);
    }
};