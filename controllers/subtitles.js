const yifysubtitles = require('@amilajack/yifysubtitles');
const subtitlesModel = require('../models/Subtitle');
const fs = require('fs');
const dictionary = require('../utils/lang/comment');

module.exports = {
    searchSubtitles: async (req, res) => {
        const { imdbid } = req.params;
        const responseObject = {};
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
            // check if the movie subtitles is already downloaded
            const result = await subtitlesModel.findOne({imdbid});
    
            // if the movie is new will be downloaded and saved in the database for the next time
            if (result === null) { 
                const directory = '/movies/subtitles';
                if (!fs.existsSync(directory))
                    fs.mkdirSync(directory);
                
                responseObject.subtitles =  await yifysubtitles(imdbid, { path: directory, langs: ['en', 'fr', 'ar', 'es'] });
                if (responseObject.subtitles.length > 0) {
                    const subtitle = new subtitlesModel({
                        imdbid: imdbid,
                        subtitles: responseObject.subtitles
                    })
    
                    subtitle.save()
                        .then((result) => {
                            responseObject.preferedLang = lang;
                            res.status(200).json(responseObject);
                        })
                        .catch((error) => {
                            responseObject.message = selectedLang.ERR_GLOBAL;
                            res.status(400).json(responseObject);
                        })
                } else {
                    responseObject.message = selectedLang.SUBTITLE_NOT_FOUND;
                    res.status(200).json(responseObject);
                }
    
            } else { // if the movie is already downloaded just serve it from the database
                responseObject.subtitles = result.subtitles;
                responseObject.preferedLang = lang;
                res.status(200).json(responseObject);
            }
    
        } catch (error) {
            responseObject.message = selectedLang.ERR_GLOBAL;
            responseObject.error = error;
            res.status(400).json(responseObject);
        }
    },

    loadSubtitle: async (req, res) => {
        const { path } = req.query;
        const responseObject = {};
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
        // check first if the file is exist
        if (fs.existsSync(`/movies/subtitles/${path}`)) {
            res.setHeader('Content-Type', 'text/vtt');
            res.status(200).sendFile(`/movies/subtitles/${path}`);
        } else {
            responseObject.message = selectedLang.SUBTITLE_NOT_EXISTS;
            res.status(404).json(responseObject);
        }
    }
}
