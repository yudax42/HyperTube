const fs = require('fs');
const movieModel = require('../models/Movie');
const rimraf = require('rimraf');
var CronJob = require('cron').CronJob;

new CronJob('0 1 * * * *', async function() {

    try {
        
        // fetch all the downloaded movies from the database 
        const movies = await movieModel.find({hasFile: true}).exec();
    
        if (movies.length > 0) { // Check first if there is any movie
            movies.forEach((movie) => {
                const currentDate = new Date();
                const movieDate = new Date(movie.lastSeen);
                const differenceTime = currentDate.getTime() - movieDate.getTime();
                const differenceDays = Math.floor(differenceTime / (1000 * 3600 * 24));

                if (differenceDays > 30) {
                    fs.stat(`/movies/${movie.path}`, (error, stat) => {
                        if (stat !== undefined) {
                            rimraf(`/movies/${movie.path}`, async function(error) {
                                if (!error) {
                                    const result = await movieModel.updateOne({_id: movie._id}, {hasFile: false})
                                }
                            });
                        }
                    })
                }
            });
        }

    } catch (error) {

    }

}, null, true, 'America/Los_Angeles');