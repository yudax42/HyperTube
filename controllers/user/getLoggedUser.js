'use strict'
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = async (request, response) => {

    const cookies = request.cookies;
    // return res.json( request.body );
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
            const user = await User.findById(result.id);
            if (!user)
                return response.status(404).json({ error: `Authentication error.` });
            request.user = user;
            let img = user.imagePath;
            img = fs.readFileSync(img, { encoding: 'base64' });
            img = "data:" + "image/jpg" + ";base64," + img;
            // We call next to pass execution to the subsequent middleware.
            return response.json({
                username:user.username,
                fname:user.firstName,
                lname:user.lastName,
                email:user.mail,
                bio: user.bio,
                lang: user.lang,
                id:user._id,
                image:img
            });
        } catch (err) {
            // Throw an error just in case anything goes wrong with verification.
            return response.status(401).json({
                error: "Authentication error."
            })
        }
    }
    else {
        result = {
            error: `Authentication error. Token required.`,
        };
        return response.status(401).send(result);
    }
};