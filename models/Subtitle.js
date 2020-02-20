const mongoose = require('mongoose');

const subtitleModel =  mongoose.Schema({
    imdbid: String,
    subtitles: Array
});

module.exports = mongoose.model('Subtitle', subtitleModel);