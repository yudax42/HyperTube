const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    imdbid: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    body: String,
    date: { type: Date, default: Date.now },
    votes: { type: Array, default: []}
})

module.exports = mongoose.model('Comment', commentSchema);