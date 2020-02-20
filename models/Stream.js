const torrentStream = require('torrent-stream');
const movieModel = require('./Movie');
const trackers = require('./trackers');
const Path = require('../utils/path');

module.exports = class Stream
{
    constructor()
    {
        this.engines = {};
    }
    // Engine Creation
    initEngine(hash, imdbid)
    {
        // If The Engine Already Created we need to use it to avoid creating the same engine
        if (this.engines[hash])
            return (this.engines[hash]);
        
        // Creation of the new Engine       
        this.magnet = `magnet:?xt=urn:btih:${hash}`;
        this.engine = null;
        return new Promise((resolve, reject)=>{
            try
            {
                let options = {
                    path: '/movies', // Where to store the movie
                    tracker: true, // Use the default trackers
                    trackers: trackers, // assing the list of trackers included
                };
                var engine = torrentStream(this.magnet,options);
                // When the engine ready we to store it in engines object above to use later
                engine.on('ready', async () => {
                    try {
                        const path = engine.torrent.files[0].path.split('/')[0];
                        const movie = await movieModel.findOne({imdbid});
                        if (!movie) 
                            return reject("Engine Error");
                        
                        movie.path = path;
                        movie.hasFile = true;
                        await movie.save();

                        this.engines[hash] = engine;
                        return resolve(engine);
                    } catch (error) {
                        reject("Engine Error")
                    }
            
                });
                engine.on('error', () => {
                    return reject("Engine Error");
                });
            }
            catch(err)
            {   
                reject("Engine Error");
            }
        })
    }
    // Find the movie stream file
    findstream(engine)
    {
        let files = engine.torrent.files;
        let index;
        let needToConvert = 0;
        let notFound = 1;
        // loop in all files and grab the movie one
        files.forEach((file, i) => {
            let filename  = file.name;
            let extension = filename.substr(filename.length - 3).toUpperCase();
            if(
                extension == "MP4" || extension == "WEBM" || extension == "WMV" || extension == "3GP" || extension == "OGG" || extension == "FLV" 
                || extension == "AVI" || extension == "QuickTime" || extension == "HDV" || extension == "MPEG-TS"
                || extension == "MPEG-2 PS" || extension == "WAV" || extension == "VOB" || extension == "LXF" || extension == "MKV") 
            {
                index = i;
                // if the movie isn't supported we need to convert it
                (extension == "MP4" || extension == "WEBM" || extension == "MKV") ? needToConvert = 0 : needToConvert = 1;
                notFound = 0;
            }
        });
        return ({engine:engine.files[index],file:files[index],needToConvert: needToConvert,notFound:notFound});
    }

}
