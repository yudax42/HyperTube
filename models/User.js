var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    mail: { type: String, required: true },
    lastName: { type: String },
    firstName: { type: String },
    bio: { type: String, required: true, default: "New member" },
    googleId: { type: String },
    intraId: { type: String },
    imagePath: { type: String, default: "images/defaultProfileImage.jpeg" },
    watchLater: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Watch' }],
    watched: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Watch' }],
    lang: { type: String, required: true, default: 'en' },
    token: { type: String, required: true, default: '0' },
    activated: { type: Boolean, required: true, default: false },
});

userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = async function () {
    const options = {
        // expiresIn: '2d'
    };
    const payload = { id: this._id };
    return await jwt.sign(payload, process.env.JWT_SECRET || "GALATA", options);
};

userSchema.methods.setPassword = async function (password) {
    let hashed = await bcrypt.hash(password, 5);
    this.password = hashed;
};

userSchema.methods.sendMail = function (subject, message) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: '', // add your email here
            pass: '' // and password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var HelperOptions = {
        from: '"HyperTube" galata@gmail.com',
        to: this.mail,
        subject: subject,
        text: message
    };

    return new Promise((resolve, reject) => {
        if (transporter.sendMail(HelperOptions)) {
            resolve("Mail Sent !");
        } else {
            reject(Error("It broke"));
        }
    });

};

const User = mongoose.model('User', userSchema);

module.exports = User;