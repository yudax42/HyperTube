const router = require('express').Router();

router.use('/user', require('./user'))

router.use('/watch', require('./watch'))

module.exports = router