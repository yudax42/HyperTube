const router = require('express').Router();
const auth = require('../middlewares/authenticate');

router.post('/later', auth, require('../controllers/watchLater/postWatchLater'));

router.post('', auth, require('../controllers/watchLater/postWatched'));

router.get('/later', auth, require('../controllers/watchLater/getWatchLater'));

router.get('', auth, require('../controllers/watchLater/getWatched'));

module.exports = router;