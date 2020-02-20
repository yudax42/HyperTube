const axios = require('axios');

module.exports = class POPCORN {
    constructor() 
    {

    }

    static makeThumbnail(movies)
    {
        const result = [];
        movies.forEach(movie => {
            let movieData = {
                title:movie.title,
                imdb_code: movie.imdb_id,
                productionYear:movie.year,
                poster: movie.images.poster,
                imdb_grade: movie.rating.percentage,
                genres: movie.genres
            };
            result.push(movieData);
        });
        return(result);
    }


    static async generateInfos(movie)
    {
        try
        {
            var torrents = [];
            
            let movies = movie.torrents.en;
            Object.keys(movies).forEach(key =>
            {
                torrents.push({
                    hash : movies[key].url.match(/[A-F\d]{40}/g)[0],
                    quality: null,
                    peers: movies[key].peer,
                    seeds: movies[key].seed,
                    size : (movies[key].size / 1073741824).toFixed(2) + "GB",
                });
            });
            const URL = `https://api.themoviedb.org/3/movie/${movie.imdb_id}/credits?api_key=e27a6c2c1ad87aeb79b889b05ef6b766`;
            const actorsInfos = (await axios.get(URL)).data;

            const infos = {
                title:movie.title,
                description:movie.synopsis,
                year:movie.year,
                rating:movie.rating.percentage,
                imdb_code:movie.imdb_id,
                cast: actorsInfos.cast,
                crew: actorsInfos.crew,
                genres:movie.genres,
                poster:movie.images.poster,
                torrents:torrents
            }
            return infos;
        }
        catch(err)
        {
            const infos = {
                title:movie.title,
                description:movie.synopsis,
                year:movie.year,
                rating:movie.rating.percentage,
                imdb_code:movie.imdb_id,
                cast: [],
                crew: [],
                genres:movie.genres,
                poster:movie.images.poster,
                torrents:torrents
            }
            return infos;
        }
    }


    static async listMovies(pageNumber,sort,genre)
    {
        (typeof genre == "undefined") ? genre = '' : genre = genre;
        (sort == "date_added") ? sort = "last added" : sort = sort;
        pageNumber == 0 ? pageNumber = 1 : pageNumber = pageNumber;
        try
        {            
            let URL         = `https://tv-v2.api-fetch.website/movies/${pageNumber}?sort=${sort}&genre=${genre}&order=-1`;
            let result      = (await axios.get(URL)).data;

            if(typeof result != "undefined" && result.length > 0)
                return this.makeThumbnail(result);
            else
                return [];
        }
        catch(error)
        {
            return [];
        }
    }

    static async searchMovies(movie_title,pageNumber)
    {
        pageNumber == 0 ? pageNumber = 1 : pageNumber = pageNumber;
        try
        {
            let URL = `https://tv-v2.api-fetch.website/movies/${pageNumber}?sort=trending&order=1&keywords=${movie_title}`;
            let result      = (await axios.get(URL)).data;

            if(typeof result != "undefined" && result.length > 0)
            {
                let movieList   = this.makeThumbnail(result);
                // Sort by names
                movieList.sort(function(a, b) {
                    var x = a.title.toLowerCase(); 
                    var y = b.title.toLowerCase();
                    if(x < y) {
                        return -1;
                    }
                    if(x > y) {
                        return 1;
                    }
                    return 0;
                });
                return movieList;
            }
            else
                return [];
        }
        catch(err)
        {
            return [];
        }
    }

    static async getMovieInfos(imdb_code)
    {
        try
        {
            
            let URL = `https://tv-v2.api-fetch.website/movie/${imdb_code}`;
            let result = (await axios.get(URL)).data;

            if(typeof result === "object")
            {
                let movieInfos = this.generateInfos(result);
                return movieInfos;
            }
            return -1;
        }
        catch(err)
        {
            return -1;
        }
    }
}









