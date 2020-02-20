var mongoose = require('mongoose');

const watchSchema = mongoose.Schema({
    watched: { type: Boolean, required: true, default: false },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
    date: { type: Date, required: true, default: Date.now },
});

const Watch = mongoose.model('Watch', watchSchema);

module.exports = Watch;