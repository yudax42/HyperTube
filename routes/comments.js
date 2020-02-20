const express = require('express');
const auth = require('../middlewares/authenticate');
const router = express.Router();
const commentController = require('../controllers/comment');
const { addComment, getComments, vote } = require('../middlewares/commentValidation');

router.post('/', auth, addComment, commentController.addComment);
router.post('/vote', auth, vote, commentController.vote);
router.get('/:imdbid', auth, getComments, commentController.getComments);

module.exports = router;