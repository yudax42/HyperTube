"use strict";
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (request, res, next) => {

    const cookies = request.cookies;
    // return res.json( request.body);
    let result;
    if (cookies && cookies.token) {
        const token = cookies.token; // Bearer <token>
        const options = {
            expiresIn: '2d'
        };
        try {
            // Verify makes sure that the token hasn't expired and has been issued by us.
            result = jwt.verify(token, process.env.JWT_SECRET || "GALATA", options);

            // Let's pass back the decoded token to the request object.
            const user = await User.findById(result.id).populate({
                path:'watched',
                populate:{
                    path:'movie'
                }
            });
            if (!user)
                return res.status(404).json({ error: `Authentication error.` });
            if (!user.activated)
                return res.status(403).json({ error: `Account not activated.` });
            request.user = user;
            // We call next to pass execution to the subsequent middleware.
            return next();
        } catch (err) {
            // Throw an error just in case anything goes wrong with verification.
            return res.status(401).json({
                error: "Authentication error."
            })
        }
    }
    else {
        result = {
            error: `Authentication error. Token required.`,
        };
        return res.status(401).send(result);
    }
};