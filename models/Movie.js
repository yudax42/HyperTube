const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    imdbid: String,
    path: String,
    lastSeen: {type: Date, default: Date.now},
    hasFile: {type: Boolean, default: false, required: true}
})

module.exports = mongoose.model('Movie', movieSchema);