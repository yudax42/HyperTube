const express = require('express');
const movieController = require('../controllers/movie');
const { movieWatched } = require('../middlewares/movieValidation');
const router = express.Router();
const auth = require('../middlewares/authenticate');

router.get("/search", auth, movieController.searchMovie);
router.get("/movieInfos/",auth, movieController.movieInfos);
router.get("/movies",auth,movieController.getAllMovies);
router.get("/streamvideo",auth, movieController.streamMovie);
router.put("/movieWatched",auth, movieController.movieWatched);

module.exports = router;