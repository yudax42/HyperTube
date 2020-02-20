const Stream = require('../models/Stream');
const ytsProvider = require('../models/Providers/Yts');
const popcornShProvider = require('../models/Providers/PopcornSh');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const movieModel = require('../models/Movie');
const FFmpeg = require('fluent-ffmpeg');
const STREAM = new Stream();
const dictionary = require('../utils/lang/movie');

FFmpeg.setFfmpegPath(ffmpegInstaller.path);

// GET ALL MOVIES ROUTES DONE
exports.getAllMovies = async (req, res) => {
    const { page, sort, genre } = req.query;
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
    var data = {};
    try {
        // Test with popcorn provider
        var result = await ytsProvider.listMovies(page, sort, genre);
        // if the popcorn provider is not working we make another test with YTS provider
        if (result.length == 0)
            result = await popcornShProvider.listMovies(page, sort, genre);
        // if no result found send message else send data
        result.forEach((item) => {
            let watched = false;
            req.user.watched.forEach((watch) => {
                if (watch.movie.imdbid == item.imdb_code)
                watched = true;
            });
            item.watched = watched;
        });

        if (result.length == 0)
            res.json({ msg: selectedLang.FETCH_NO, data: null })
        else
            res.json({ msg: `${result.length} ${selectedLang.FETCH_YES}`, data: result });
    }
    catch (err) {
        data.msg = selectedLang.FETCH_ERR;
        data.data = null;
        return res.json(data);
    }
}

// SEARCH MOVIE ROUTE DONE 
exports.searchMovie = async (req, res) => {
    const movie_title = req.query.title;
    const page = req.query.page;
    const lang = req.user.lang;
    let selectedLang;
    let data = {};

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
        // Test with popcorn provider
        
        var result = await ytsProvider.searchMovies(movie_title,page);
        // if the popcorn provider is not working we make another test with YTS provider
        if(result.length == 0)
            result = await popcornShProvider.searchMovies(movie_title,page);
        // if no result found send message else send data
        if (result.length == 0)
            res.json({ msg: selectedLang.FETCH_NO, data: null })
        else
            res.json({ msg: `${result.length} ${selectedLang.FETCH_YES} !`, data: result });

    }
    catch (err) {
        data.msg = selectedLang.FETCH_ERR;
        data.data = null;
        return res.json(data);
    }
}


// MOVIE INFOS ROUTES DONE
exports.movieInfos = async (req, res) => {
    const imdb_code = req.query.imdb;
    const lang = req.user.lang;
    let selectedLang;
    let data = {};

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
    try
    {
        var result = await ytsProvider.getMovieInfos(imdb_code);
        
        if(result == -1)
            result = await popcornShProvider.getMovieInfos(imdb_code);

        if(result == -1)
            res.json({msg: selectedLang.MV_NO,data:null})
        else {
            const movieResult = await movieModel.findOne({imdbid: imdb_code})
            if (movieResult === null) {
                const movie = new movieModel({
                    imdbid: imdb_code
                });
                await movie.save();
            } else {
                movieResult.lastSeen = new Date();
                await movieResult.save();
            }
            res.json({ msg: selectedLang.MV_YES, data: result });
        }

    }
    catch (err) {
  
        data.msg = selectedLang.MV_ERR;
        data.data = null;
        return res.json(data);
    }
}


const convertFile = (file) => {
    try {
        const convertedFile = new FFmpeg(file.createReadStream())
            .videoCodec('libvpx')
            .audioCodec('libvorbis')
            .format('webm')
            .audioBitrate(128)
            .videoBitrate(8000)
            .outputOptions([
                `-threads 5`,
                '-deadline realtime',
                '-error-resilient 1'
            ])
            .on('error', err => { })
        return convertedFile
    }
    catch (err) {
    }
}

exports.promiseTimeout = (ms, promise) => {
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + ms + 'ms.')
        }, ms)
    })
    return Promise.race([
        promise,
        timeout
    ])
}

exports.streamMovie = async (req, res) => {
    const {hash, imdbid} = req.query;
    try {
        // SomeTimes the Engine is not created for any reason and we can't resolve The error because is not handled in the Module
        // i created this function to solve the waiting problem, what it does is resolve the first promises that are racing 
        // so if STREAM.initEngine function resolve the engine it's cool, if not it will wait 20s then throw timed out error and we close the response
        let Engine = this.promiseTimeout(20000, STREAM.initEngine(hash, imdbid));
        Engine.then(engine => {
            // find or create the engine
            var createdEngine = STREAM.findstream(engine).engine;
            // Grab  the state of the stream
            var needToConvert = STREAM.findstream(engine).needToConvert; // if the stream need to be converted
            var notFound = STREAM.findstream(engine).notFound; // if no stream found
            // grab the request headers
            var range = req.headers.range;
            var positions = range.replace(/bytes=/, "").split("-");
            var start = parseInt(positions[0], 10);
            const end = positions[1] ? parseInt(positions[1], 10) : STREAM.findstream(engine).file.length - 1;
            var chunksize = (end - start);

            // if no movie found we close the response
            if (notFound == 1)
                return res.end();
            else {
                // Fix Cross origin problem
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

                if (needToConvert == 0) {
                    res.writeHead(206, {
                        "Content-Range": "bytes " + start + "-" + end + "/" + STREAM.findstream(engine).file.length,
                        "Accept-Ranges": "bytes",
                        "Content-Length": chunksize,
                        "Content-Type": "video/mp4"
                    });
                    // create read stream from the movie file gived from the engine
                    var stream = createdEngine.createReadStream({ start: start, end: end });
                    // pipe the stream to writable stream res
                    stream.pipe(res);
                }
                else if (needToConvert == 1) {
                    res.writeHead(206, {
                        "Content-Range": "bytes " + start + "-" + end + "/*",
                        'Content-Type': 'video/webm'
                    });
                    // Convert the file using ffmpeg module and pipe it to writable stream `res`
                    convertFile(createdEngine).pipe(res);
                }
                else
                    res.end();
            }
        }).catch(error => {
            res.end();
        })

    }
    catch (err) {
        res.end();
    }
}


exports.movieWatched = async (req, res) => {
    const {imdbid, title, path} = req.body;

    try {

        const movie = await movieModel.find({imdbid});

        if (movie.length > 0) {
            movie.lastSeen = new Date();
            movie.hasFile = true;
            const result = await movie.save();
            res.status(200);
        } else {
            // const newMovie = new movieModel({
            //     im
            // })
        }

    } catch (error) {
        res.status(400);
    }
}