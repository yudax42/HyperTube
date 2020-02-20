const router = require('express').Router();
const subtitlesController = require('../controllers/subtitles');
const { searchSubtitles, loadSubtitles } = require('../middlewares/subtitlesValidation');
const auth = require('../middlewares/authenticate');

router.get('/search/:imdbid', auth, searchSubtitles, subtitlesController.searchSubtitles);
router.get('/load/', auth, loadSubtitles, subtitlesController.loadSubtitle);

module.exports = router;