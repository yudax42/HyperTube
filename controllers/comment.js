const commentModel = require('../models/Comment');
const movieModel = require('../models/Movie');
const fs = require('fs');
const _ = require('underscore');
const dictionary = require('../utils/lang/comment');

module.exports = {
    addComment: async (req, res) => { // save new added comment
        const { commentBody, imdbid } = req.body;
        const { _id } = req.user;
        const responseObject = {
            message: ""
        }
        const lang = req.user.lang;
        let selectedLang;
        switch (lang) {
            case "fr":
                selectedLang = dictionary.fr;
                break;
            case "ar":
                selectedLang = dictionary.ar;
                break;
            default:
                selectedLang = dictionary.en;
        }
        try {
            // Check if the movie is exist
            const movie = await movieModel.findOne({imdbid}).exec();

            if (movie) {
                const comment = new commentModel({
                    author: _id,
                    imdbid,
                    body: commentBody,
                })
                return comment.save()
                        .then((result) => {
                            responseObject.message = selectedLang.COMMENT_ADDED;
                            responseObject.comment = result;
                            return res.status(200).json(responseObject);
                        })
                        .catch((error) => {
                            responseObject.message = selectedLang.ERR_GLOBAL;
                            return res.status(400).json(responseObject);
                        })
            } else {
                responseObject.message = selectedLang.ERR_MOVIE_404;
                res.status(400).json(responseObject);
            }
        } catch (error) {
            responseObject.message = selectedLang.ERR_GLOBAL;
            res.status(400).json(responseObject);
        }


    },

    getComments: async (req, res) => { // get movie comments
        const { imdbid } = req.params;
        const responseObject = {
            message: ""
        }
        const lang = req.user.lang;
        let selectedLang;
        switch (lang) {
            case "fr":
                selectedLang = dictionary.fr;
                break;
            case "ar":
                selectedLang = dictionary.ar;
                break;
            default:
                selectedLang = dictionary.en;
        }
        // Check if the movie is exist
        const movie = await movieModel.findOne({imdbid}).exec();

        if (movie) {
            // fetch all the comments for the given movie
            commentModel.find({imdbid}).populate('author')
                .exec()
                .then((comments) => {

                    // sort with votes
                    const sortedComments = comments.sort((a, b) => {
                        return b.votes.length - a.votes.length
                    });

                    // pick only needed fields from the author object
                    sortedComments.forEach((comment) => {
                        comment.author = _.pick(comment.author, ['imagePath' ,'username', 'firstName', 'lastName']);
                        let img = comment.author.imagePath;
                        img = fs.readFileSync(img, { encoding: 'base64' });
                        img = "data:" + "image/jpg" + ";base64," + img;
                        comment.author.imagePath = img;
                    })

                    responseObject.comments = sortedComments;
                    res.status(200).json(responseObject);
                })
                .catch((error) => {
                    responseObject.message = selectedLang.ERR_GLOBAL;
                    res.status(400).json(responseObject);
                })
        } else {
            responseObject.message = selectedLang.ERR_MOVIE_404;
            res.status(400).json(responseObject);
        }

    },

    vote: async (req, res) => { // vote for a comment
        const { commentId } = req.body;
        const { _id } = req.user;
        const responseObject = {
            message: ""
        }
        const lang = req.user.lang;
        let selectedLang;
        switch (lang) {
            case "fr":
                selectedLang = dictionary.fr;
                break;
            case "ar":
                selectedLang = dictionary.ar;
                break;
            default:
                selectedLang = dictionary.en;
        }
        try {

            // check if the comment is exist
            const comment = await commentModel.findById(commentId);
            if (comment !== null ) {
                // if the comment exist check if the user is already voted
                const alreadyVoted = comment.votes.indexOf(_id);
                if (alreadyVoted < 0) {
                    const updated = await commentModel.updateOne( {_id: commentId}, {votes: [...comment.votes, _id]} );
                    responseObject.message = selectedLang.VOTE_ADDED;
                    res.status(200).json(responseObject);
                } else {
                    responseObject.message = selectedLang.VOTE_ALREADY_EXISTS;
                    res.status(401).json(responseObject);
                }
                
            } else {
                responseObject.message = selectedLang.VOTE_COMMENT_NOT_EXISTS;
                res.status(400).json(responseObject);
            }

        } catch (error) {
            responseObject.message = selectedLang.ERR_MOVIE_404;
            res.status(400).json(responseObject);
        }
    }
}