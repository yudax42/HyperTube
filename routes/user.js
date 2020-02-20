const router = require('express').Router();
const auth = require('../middlewares/authenticate');
const passport = require('../config/LocalStrategy');

router.get('', require('../controllers/user/getLoggedUser'));

router.post('', require('../controllers/user/postUser'));

router.patch('/password', auth, require('../controllers/user/patchUserPassword'));

router.patch('/activation', require('../controllers/user/patchUserActivated'));

router.get('/users', require('../controllers/user/getUsers'));

router.post('/login', require('../controllers/user/postLogin'));

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/auth', require('../controllers/user/getGoogleLogin'));

router.get('/intra/auth', require('../controllers/user/getIntraLogin'));

router.get('/intra', passport.authenticate('42'));

router.put('/image', auth, require('../controllers/user/putImage'));

router.patch('', auth, require('../controllers/user/patchUserInfo'));

router.get('/username/:username', auth, require('../controllers/user/getUserByUsername'));

router.get('/:userId', auth, require('../controllers/user/getUserInfo'));

router.get('/image/:userId', auth, require('../controllers/user/getUserImage'));

router.delete('/logout', auth, require('../controllers/user/deleteUserLogin'));

router.post('/reset/password', require('../controllers/user/postResetPass'));

router.patch('/reset/password', require('../controllers/user/patchResetPass'));

module.exports = router;